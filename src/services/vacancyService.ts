import { hhApiService } from './hhApi';
import { zarplataApiService, type ZarplataVacancy } from './zarplataApi';
import type { Vacancy } from '../types/vacancy';
import { useSearchSourcesStore } from '../stores/searchSourcesStore';

interface SearchFilters {
  searchQuery: string;
  includeTerms: string[];
  excludeTerms: string[];
  experience: string[];
  salaryFrom: number | null;
  salaryTo: number | null;
  schedule: string[];
  area: string;
  period: number | null;
  sortBy: string;
}

// Конвертируем вакансии Zarplata в общий формат
function convertZarplataVacancy(vacancy: ZarplataVacancy): Vacancy {
  const safeString = (value: unknown): string => {
    if (!value) return 'Не указано';
    if (typeof value === 'string') return value;
    if (typeof value === 'object' && value !== null && 'name' in value) {
      return String((value as { name: string }).name);
    }
    return String(value);
  };

  return {
    id: `zarplata_${vacancy.id}`,
    name: vacancy.name,
    salary: vacancy.salary ? {
      from: vacancy.salary.from || undefined,
      to: vacancy.salary.to || undefined,
      currency: vacancy.salary.currency || 'RUR'
    } : null,

    employer: {
      id: vacancy.company?.name || 'unknown',
      name: safeString(vacancy.company?.name), 
      url: '',
      logo_urls: undefined
    },
    area: {
      id: safeString(vacancy.area?.name), 
      name: safeString(vacancy.area?.name) 
    },
    snippet: {
      requirement: vacancy.description,
      responsibility: vacancy.description
    },
    // Обязательные поля 
    experience: {
      id: 'unknown',
      name: safeString(vacancy.experience) 
    },
    employment: {
      id: 'unknown', 
      name: safeString(vacancy.employment) 
    },
    schedule: {
      id: 'unknown',
      name: safeString(vacancy.schedule) 
    },
    key_skills: [],
    published_at: vacancy.published_at,
    alternate_url: `https://zarplata.ru/vacancy/${vacancy.id}`,
    source: 'zarplata'
  };
}

// Конвертируем параметры фильтров для Zarplata API
function convertFiltersToZarplataParams(filters: SearchFilters) {
  return {
    text: filters.searchQuery,
    salary_from: filters.salaryFrom || undefined,
    salary_to: filters.salaryTo || undefined,
    experience: filters.experience?.[0] || undefined,
    employment: undefined, // Zarplata не поддерживает employment фильтр
    schedule: filters.schedule?.[0] || undefined,
    area: filters.area !== '113' ? filters.area : undefined,
  };
}

export class VacancyService {
  async searchVacancies(
    query: string,
    page: number = 0,
    filters: SearchFilters
  ): Promise<{ vacancies: Vacancy[]; hasMore: boolean }> {
    const sources = useSearchSourcesStore.getState().sources;
    const results: Vacancy[] = [];
    let hasMore = false;

    // Поиск в HH.ru
    if (sources.hh) {
      try {
        // Формируем поисковый запрос с учетом фильтров для HH
        let hhSearchText = query;
        if (filters.includeTerms.length > 0) {
          hhSearchText += ` ${filters.includeTerms.join(' ')}`;
        }
        if (filters.excludeTerms.length > 0) {
          filters.excludeTerms.forEach(term => {
            hhSearchText += ` !${term}`;
          });
        }

        const hhResult = await hhApiService.searchVacancies({
          text: hhSearchText,
          page,
          per_page: 20,
          salary: filters.salaryFrom || undefined,
          salary_to: filters.salaryTo || undefined,
          experience: filters.experience?.[0] || undefined,
          schedule: filters.schedule?.[0] || undefined,
          area: filters.area !== '113' ? filters.area : undefined,
          period: filters.period || undefined,
          order_by: filters.sortBy || 'relevance'
        });

        const hhVacancies = (hhResult.items || []).map(vacancy => ({
          ...vacancy,
          source: 'hh' as const
        }));

        results.push(...hhVacancies);
        hasMore = hasMore || !!(hhResult.items && hhResult.items.length === 20);
      } catch (error) {
        console.error('HH.ru search error:', error);
      }
    }

    // Поиск в Zarplata.ru
    if (sources.zarplata) {
        try {
            // Формируем поисковый запрос с include/exclude terms для Zarplata
            // Сначала очищаем от HH-синтаксиса (!term)
            let zarplataQuery = query.replace(/!\w+/g, '').trim();
            
            // Добавляем include terms
            if (filters.includeTerms.length > 0) {
            zarplataQuery += ` ${filters.includeTerms.join(' ')}`;
            }
            
            // Добавляем exclude terms (Zarplata использует минус для исключения)
            if (filters.excludeTerms.length > 0) {
            filters.excludeTerms.forEach(term => {
                zarplataQuery += ` -${term}`;
            });
            }

            // УДАЛЯЕМ ДУБЛИКАТЫ СЛОВ из запроса
            const words = zarplataQuery.split(/\s+/);
            const uniqueWords = [...new Set(words)];
            zarplataQuery = uniqueWords.join(' ').trim();

            const zarplataParams = convertFiltersToZarplataParams({
            ...filters,
            searchQuery: zarplataQuery
            });

            console.log('🔍 Zarplata API params:', zarplataParams);

            const zarplataResult = await zarplataApiService.searchVacancies({
            ...zarplataParams,
            page: page + 1,
            per_page: 20
            });

            console.log('🔍 Zarplata API response:', zarplataResult);

            const zarplataVacancies = zarplataResult.items.map(convertZarplataVacancy);
            results.push(...zarplataVacancies);
            hasMore = hasMore || (zarplataResult.page < zarplataResult.pages);
        } catch (error) {
            console.error('Zarplata.ru search error:', error);
        }
    }

    // Сортируем результаты по релевантности (можно улучшить)
    const sortedResults = results.sort((a, b) => {
      // Приоритет HH.ru, потом Zarplata
      if (a.source === 'hh' && b.source === 'zarplata') return -1;
      if (a.source === 'zarplata' && b.source === 'hh') return 1;
      return 0;
    });

    return {
      vacancies: sortedResults,
      hasMore
    };
  }

  async getVacancy(id: string): Promise<Vacancy> {
    if (id.startsWith('zarplata_')) {
      const zarplataId = id.replace('zarplata_', '');
      const vacancy = await zarplataApiService.getVacancy(zarplataId);
      return convertZarplataVacancy(vacancy);
    } else {
      return await hhApiService.getVacancy(id);
    }
  }
}

export const vacancyService = new VacancyService();