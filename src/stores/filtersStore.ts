import { create } from 'zustand';
import { persist } from 'zustand/middleware';

interface FiltersState {
  // Текстовые фильтры
  includeTerms: string[];
  excludeTerms: string[];
  
  // Опыт работы
  experience: string[];
  
  // Зарплата
  salaryFrom: number | null;
  salaryTo: number | null;
  salaryCurrency: string;
  
  // Тип занятости
  employment: string[];
  
  // График работы
  schedule: string[];
  
  // Город
  area: string;
  
  // Период публикации
  period: number | null;
  
  // Состояние раскрытия фильтров
  expandedFilters: {
    experience: boolean;
    schedule: boolean;
    area: boolean;
    salary: boolean;
    employment: boolean;
    period: boolean;
    sort: boolean;
  };

  // Сортировка
  sortBy: string;
  
  // Actions
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
      // Initial state
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
      
      // Раскрытые фильтры
      expandedFilters: {
        experience: false,
        schedule: false, 
        area: false,
        salary: false,
        employment: false,
        period: false,
        sort: false,
      },
      
      // Actions
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
        },
      }),
    }),
    {
      name: 'filters-storage', // ключ в localStorage
      // Исключаем expandedFilters из сохранения, так как это UI состояние
      partialize: (state) => ({
        includeTerms: state.includeTerms,
        excludeTerms: state.excludeTerms,
        experience: state.experience,
        salaryFrom: state.salaryFrom,
        salaryTo: state.salaryTo,
        salaryCurrency: state.salaryCurrency,
        employment: state.employment,
        schedule: state.schedule,
        area: state.area,
        period: state.period,
        sortBy: state.sortBy,
      }),
    }
  )
);