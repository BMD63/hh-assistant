import { useState } from 'react';
import type { Vacancy } from '../types/vacancy';
import { hhApiService } from '../services/hhApi';
import { buildSearchQuery } from '../utils/searchQueryBuilder';
import { useFiltersStore } from '../stores/filtersStore';

export function useVacancies() {
  const [vacancies, setVacancies] = useState<Vacancy[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [currentPage, setCurrentPage] = useState(0);
  const [hasMore, setHasMore] = useState(true);
  const [currentQuery, setCurrentQuery] = useState('');

  const { includeTerms, excludeTerms, experience, salaryFrom, salaryTo, employment, schedule } = useFiltersStore();

  const searchVacancies = async (baseQuery: string, page: number = 0) => {
    if (!baseQuery.trim()) return;
    
    setIsLoading(true);
    setError(null);
    
    try {
      // Строим финальный запрос с фильтрами
      const finalQuery = buildSearchQuery(baseQuery, includeTerms, excludeTerms);
      
      // Преобразуем фильтры в параметры HH API
      const experienceParam = experience.length > 0 ? experience[0] : undefined;
      const employmentParam = employment.length > 0 ? employment[0] : undefined;
      const scheduleParam = schedule.length > 0 ? schedule[0] : undefined;
      
      const response = await hhApiService.searchVacancies({
        text: finalQuery,
        page,
        per_page: 20,
        salary: salaryFrom || undefined,
        salary_to: salaryTo || undefined,
        experience: experienceParam,
        employment: employmentParam,
        schedule: scheduleParam
      });
      
      if (response && response.items) {
        if (page === 0) {
          setVacancies(response.items);
          setCurrentQuery(baseQuery);
        } else {
          setVacancies(prev => [...prev, ...response.items]);
        }
        
        setHasMore(page < response.pages - 1);
        setCurrentPage(page);
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Ошибка при поиске вакансий');
    } finally {
      setIsLoading(false);
    }
  };

  const loadMore = () => {
    if (!hasMore || isLoading || !currentQuery) return;
    searchVacancies(currentQuery, currentPage + 1);
  };

  return {
    vacancies,
    isLoading,
    error,
    hasMore,
    searchVacancies,
    loadMore,
  };
}