import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { SearchSources } from '../types/vacancy';

interface SearchSourcesState {
  sources: SearchSources;
  toggleSource: (source: keyof SearchSources) => void;
  setSources: (sources: SearchSources) => void;
}

export const useSearchSourcesStore = create<SearchSourcesState>()(
  persist(
    (set) => ({
      sources: {
        hh: true,
        zarplata: true,
      },
      toggleSource: (source) => 
        set((state) => ({
          sources: {
            ...state.sources,
            [source]: !state.sources[source],
          },
        })),
      setSources: (sources) => set({ sources }),
    }),
    {
      name: 'search-sources-storage',
    }
  )
);