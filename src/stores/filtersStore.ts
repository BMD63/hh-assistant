import { create } from 'zustand';
import { persist } from 'zustand/middleware';

interface FiltersState {
  // === ПОИСК И РЕЗУЛЬТАТЫ ===
  searchQuery: string;
  searchResults: any[];
  isLoading: boolean;
  error: string | null;
  hasMore: boolean;

  // === ФИЛЬТРЫ ===
  includeTerms: string[];
  excludeTerms: string[];
  experience: string[];
  salaryFrom: number | null;
  salaryTo: number | null;
  salaryCurrency: string;
  employment: string[];
  schedule: string[];
  area: string;
  period: number | null;
  sortBy: string;
  
  expandedFilters: {
    experience: boolean;
    schedule: boolean;
    area: boolean;
    salary: boolean;
    employment: boolean;
    period: boolean;
    sort: boolean;
    sources: boolean; // ← ДОБАВЛЯЕМ sources
  };

  // === ACTIONS ===
  // Новые actions для поиска
  setSearchQuery: (query: string) => void;
  setSearchResults: (results: any[]) => void;
  setLoading: (loading: boolean) => void;
  setError: (error: string | null) => void;
  setHasMore: (hasMore: boolean) => void;
  
  // Существующие actions для фильтров
  addIncludeTerm: (term: string) => void;
  removeIncludeTerm: (term: string) => void;
  addExcludeTerm: (term: string) => void;
  removeExcludeTerm: (term: string) => void;
  setExperience: (experience: string[]) => void;
  setSalaryFrom: (salary: number | null) => void;
  setSalaryTo: (salary: number | null) => void;
  setSalaryCurrency: (currency: string) => void;
  setEmployment: (employment: string[]) => void;
  setSchedule: (schedule: string[]) => void;
  setArea: (area: string) => void;
  setPeriod: (period: number | null) => void;
  toggleFilterExpanded: (filterName: keyof FiltersState['expandedFilters']) => void;
  resetFilters: () => void;
  setSortBy: (sortBy: string) => void;
}

export const useFiltersStore = create<FiltersState>()(
  persist(
    (set) => ({
      // === ПОИСК И РЕЗУЛЬТАТЫ ===
      searchQuery: '',
      searchResults: [],
      isLoading: false,
      error: null,
      hasMore: false,

      // === ФИЛЬТРЫ ===
      includeTerms: [],
      excludeTerms: [],
      experience: [],
      salaryFrom: null,
      salaryTo: null,
      salaryCurrency: 'RUR',
      employment: [],
      schedule: [],
      area: '113',
      period: null,
      sortBy: 'relevance',
      
      // === РАСКРЫТЫЕ ФИЛЬТРЫ (ДОБАВЛЯЕМ sources) ===
      expandedFilters: {
        experience: false,
        schedule: false, 
        area: false,
        salary: false,
        employment: false,
        period: false,
        sort: false,
        sources: false, // ← ДОБАВЛЯЕМ ЗДЕСЬ
      },
      
      // === ACTIONS ===
      setSearchQuery: (searchQuery) => set({ searchQuery }),
      setSearchResults: (searchResults) => set({ searchResults }),
      setLoading: (isLoading) => set({ isLoading }),
      setError: (error) => set({ error }),
      setHasMore: (hasMore) => set({ hasMore }),
      
      addIncludeTerm: (term) => 
        set((state) => ({ 
          includeTerms: [...state.includeTerms, term.trim()] 
        })),
        
      removeIncludeTerm: (term) =>
        set((state) => ({
          includeTerms: state.includeTerms.filter(t => t !== term)
        })),
        
      addExcludeTerm: (term) =>
        set((state) => ({
          excludeTerms: [...state.excludeTerms, term.trim()]
        })),
        
      removeExcludeTerm: (term) =>
        set((state) => ({
          excludeTerms: state.excludeTerms.filter(t => t !== term)
        })),
        
      setExperience: (experience) => set({ experience }),
      
      setSalaryFrom: (salaryFrom) => set({ salaryFrom }),
      
      setSalaryTo: (salaryTo) => set({ salaryTo }),
      
      setSalaryCurrency: (salaryCurrency) => set({ salaryCurrency }),
      
      setEmployment: (employment) => set({ employment }),
      
      setSchedule: (schedule) => set({ schedule }),
      
      setArea: (area) => set({ area }),
      
      setPeriod: (period) => set({ period }),
      
      toggleFilterExpanded: (filterName) => 
        set((state) => ({
          expandedFilters: {
            ...state.expandedFilters,
            [filterName]: !state.expandedFilters[filterName]
          }
        })),

      setSortBy: (sortBy) => set({ sortBy }),
      
      resetFilters: () => set({
        includeTerms: [],
        excludeTerms: [],
        experience: [],
        salaryFrom: null,
        salaryTo: null,
        salaryCurrency: 'RUR',
        employment: [],
        schedule: [],
        area: '113',
        period: null,
        expandedFilters: {
          experience: false,
          schedule: false,
          area: false,
          salary: false,
          employment: false,
          period: false,
          sort: false,
          sources: false, // ← И ЗДЕСЬ
        },
      }),
    }),
    {
      name: 'filters-storage',
    }
  )
);