import { useState } from 'react';
import type { Vacancy } from '../types/vacancy';
import { hhApiService } from '../services/hhApi';

export function useVacancies() {
  const [vacancies, setVacancies] = useState<Vacancy[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [currentPage, setCurrentPage] = useState(0);
  const [hasMore, setHasMore] = useState(true);

  const searchVacancies = async (query: string, page: number = 0) => {
    if (!query.trim()) return;
    
    setIsLoading(true);
    setError(null);
    
    try {
      const response = await hhApiService.searchVacancies(query, page);
      
      if (response && response.items) {
        if (page === 0) {
          // Новый поиск
          setVacancies(response.items);
        } else {
          // Подгрузка следующих страниц
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

  const loadMore = (query: string) => {
    if (!hasMore || isLoading) return;
    searchVacancies(query, currentPage + 1);
  };

  const resetSearch = () => {
    setVacancies([]);
    setCurrentPage(0);
    setHasMore(true);
  };

  return {
    vacancies,
    isLoading,
    error,
    hasMore,
    searchVacancies,
    loadMore,
    resetSearch,
  };
}