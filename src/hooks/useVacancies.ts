// src/hooks/useVacancies.ts
import { useCallback } from 'react';
import { useFiltersStore } from '../stores/filtersStore';
import { vacancyService } from '../services/vacancyService';

export function useVacancies() {
  const { 
    searchResults, 
    setSearchResults, 
    isLoading, 
    setLoading, 
    error, 
    setError, 
    hasMore, 
    setHasMore,
    searchQuery,
    includeTerms,
    excludeTerms,
    experience,
    salaryFrom,
    salaryTo, 
    schedule,
    area,
    period,
    sortBy
  } = useFiltersStore();

  const searchVacancies = useCallback(async (query: string, page: number = 0) => {
    if (!query.trim()) return;
    
    setLoading(true);
    setError(null);
    
    try {
      // Формируем поисковый запрос с учетом фильтров
      let searchText = query;
      if (includeTerms.length > 0) {
        searchText += ` ${includeTerms.join(' ')}`;
      }
      if (excludeTerms.length > 0) {
        excludeTerms.forEach(term => {
          searchText += ` !${term}`;
        });
      }

      const filters = {
        searchQuery: searchText,
        includeTerms,
        excludeTerms,
        experience,
        salaryFrom,
        salaryTo,
        schedule,
        area,
        period,
        sortBy
      };

      const result = await vacancyService.searchVacancies(searchText, page, filters);
      
      if (page === 0) {
        setSearchResults(result.vacancies);
      } else {
        setSearchResults([...searchResults, ...result.vacancies]);
      }
      
      setHasMore(result.hasMore);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Ошибка поиска');
    } finally {
      setLoading(false);
    }
  }, [
    includeTerms, excludeTerms, experience, salaryFrom, salaryTo, 
    schedule, area, period, sortBy, setLoading, setError, 
    setSearchResults, setHasMore, searchResults
  ]);

  const loadMore = useCallback(() => {
    if (!isLoading && hasMore) {
      const currentPage = Math.floor(searchResults.length / 20);
      searchVacancies(searchQuery, currentPage);
    }
  }, [isLoading, hasMore, searchResults.length, searchVacancies, searchQuery]);

  const clearSearch = useCallback(() => {
    setSearchResults([]);
    setHasMore(false);
    setError(null);
  }, [setSearchResults, setHasMore, setError]);

  return {
    vacancies: searchResults,
    isLoading,
    error,
    hasMore,
    searchVacancies,
    loadMore,
    clearSearch,
  };
}