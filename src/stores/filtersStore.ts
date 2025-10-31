import { create } from 'zustand';

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
  };
  
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
}

export const useFiltersStore = create<FiltersState>((set) => ({
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
  
  // Раскрытые фильтры
  expandedFilters: {
    experience: false,
    schedule: false, 
    area: false,
    salary: false,
    employment: false,
    period: false,
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
    },
  }),
}));