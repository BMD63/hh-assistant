import { useState, useEffect } from 'react';

const SEARCH_QUERY_STORAGE_KEY = 'search-query-storage';

export function useSearch(onSearch: (query: string) => void) {
  // Загружаем сохраненный запрос из localStorage при инициализации
  const [searchQuery, setSearchQuery] = useState(() => {
    try {
      const saved = localStorage.getItem(SEARCH_QUERY_STORAGE_KEY);
      return saved ? saved : '';
    } catch {
      return '';
    }
  });

  // Сохраняем запрос в localStorage при изменении
  useEffect(() => {
    try {
      if (searchQuery.trim()) {
        localStorage.setItem(SEARCH_QUERY_STORAGE_KEY, searchQuery);
      } else {
        localStorage.removeItem(SEARCH_QUERY_STORAGE_KEY);
      }
    } catch (error) {
      console.error('Ошибка при сохранении поискового запроса:', error);
    }
  }, [searchQuery]);

  const handleSearch = () => {
    if (!searchQuery.trim()) return;
    onSearch(searchQuery);
  };

  return {
    searchQuery,
    setSearchQuery,
    handleSearch,
  };
}