import { useEffect, useCallback } from 'react'
import { useSearchStore } from '../stores/searchStore'

const LEGACY_STORAGE_KEY = 'search-query-storage'

export function useSearch(onSearch: (query: string) => void) {
  const searchQuery = useSearchStore((state) => state.searchQuery)
  const setSearchQuery = useSearchStore((state) => state.setSearchQuery)

  // Удаляем старый ключ из localStorage после миграции
  useEffect(() => {
    try {
      localStorage.removeItem(LEGACY_STORAGE_KEY)
    } catch (error) {
      console.error('Не удалось удалить устаревший поисковый ключ в localStorage', error)
    }
  }, [])

  const handleSearch = useCallback(() => {
    if (!searchQuery.trim()) return
    onSearch(searchQuery)
  }, [onSearch, searchQuery])

  return {
    searchQuery,
    setSearchQuery,
    handleSearch,
  }
}