import { create } from 'zustand'
import { persist } from 'zustand/middleware'

const generateId = () => {
  if (typeof crypto !== 'undefined' && 'randomUUID' in crypto) {
    return crypto.randomUUID()
  }
  return `${Date.now()}-${Math.random().toString(16).slice(2)}`
}

export interface SavedFiltersSnapshot {
  includeTerms: string[]
  excludeTerms: string[]
  experience: string[]
  salaryFrom: number | null
  salaryTo: number | null
  salaryCurrency: string
  employment: string[]
  schedule: string[]
  area: string
  period: number | null
  sortBy: string
}

export interface SavedSearch {
  id: string
  name: string
  query: string
  filters: SavedFiltersSnapshot
  createdAt: string
}

interface SavedSearchesState {
  savedSearches: SavedSearch[]
  addSavedSearch: (search: { name: string; query: string; filters: SavedFiltersSnapshot }) => void
  removeSavedSearch: (id: string) => void
  clearSavedSearches: () => void
}

export const useSavedSearchesStore = create<SavedSearchesState>()(
  persist(
    (set) => ({
      savedSearches: [],
      addSavedSearch: ({ name, query, filters }) =>
        set((state) => {
          const newSearch: SavedSearch = {
            id: generateId(),
            name: name.trim() || 'Новый поиск',
            query,
            filters,
            createdAt: new Date().toISOString(),
          }

          return {
            savedSearches: [newSearch, ...state.savedSearches],
          }
        }),
      removeSavedSearch: (id) =>
        set((state) => ({
          savedSearches: state.savedSearches.filter((search) => search.id !== id),
        })),
      clearSavedSearches: () => set({ savedSearches: [] }),
    }),
    {
      name: 'saved-searches-storage',
      version: 1,
    }
  )
)
