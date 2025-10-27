import { useState } from 'react';
import type { Vacancy } from '../types/vacancy';
import { hhApiService } from '../services/hhApi';

export function useVacancies() {
  const [vacancies, setVacancies] = useState<Vacancy[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const searchVacancies = async (query: string) => {
    if (!query.trim()) return;
    
    setIsLoading(true);
    setError(null);
    
    try {
      const response = await hhApiService.searchVacancies(query);
      // проверка на наличие данных
      if (response && response.items) {
        setVacancies(response.items);
      } else {
        setVacancies([]);
        setError('Неверный формат ответа от сервера');
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Ошибка при поиске вакансий');
      setVacancies([]);
    } finally {
      setIsLoading(false);
    }
  };

  return {
    vacancies,
    isLoading,
    error,
    searchVacancies,
  };
}