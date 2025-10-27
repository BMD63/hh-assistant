import { useState } from 'react';

export function useSearch(onSearch: (query: string) => void) {
  const [searchQuery, setSearchQuery] = useState('');

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