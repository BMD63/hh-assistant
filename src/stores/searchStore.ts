import { create } from 'zustand'
import { persist } from 'zustand/middleware'

interface SearchState {
  searchQuery: string
  setSearchQuery: (query: string) => void
  clearSearchQuery: () => void
}

export const useSearchStore = create<SearchState>()(
  persist(
    (set) => ({
      searchQuery: '',
      setSearchQuery: (query) => set({ searchQuery: query }),
      clearSearchQuery: () => set({ searchQuery: '' }),
    }),
    {
      name: 'search-store',
      version: 1,
    }
  )
)
