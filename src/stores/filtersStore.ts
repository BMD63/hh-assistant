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
  
  // Тип занятости
  employment: string[];
  
  // График работы
  schedule: string[];
  
  // Город 
  area: string;
  
  // Actions
  addIncludeTerm: (term: string) => void;
  removeIncludeTerm: (term: string) => void;
  addExcludeTerm: (term: string) => void;
  removeExcludeTerm: (term: string) => void;
  setExperience: (experience: string[]) => void;
  setSalaryFrom: (salary: number | null) => void;
  setSalaryTo: (salary: number | null) => void;
  setEmployment: (employment: string[]) => void;
  setSchedule: (schedule: string[]) => void;
  setArea: (area: string) => void;
  
  resetFilters: () => void;
}

export const useFiltersStore = create<FiltersState>((set) => ({
  // Initial state
  includeTerms: [],
  excludeTerms: [],
  experience: [],
  salaryFrom: null,
  salaryTo: null,
  employment: [],
  schedule: [],
  area: '113', 
  
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
  setEmployment: (employment) => set({ employment }),
  setSchedule: (schedule) => set({ schedule }),
  
  setArea: (area) => set({ area }),
  
  resetFilters: () => set({
    includeTerms: [],
    excludeTerms: [],
    experience: [],
    salaryFrom: null,
    salaryTo: null,
    employment: [],
    schedule: [],
    area: '113', 
  }),
}));