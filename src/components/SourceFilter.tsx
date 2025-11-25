// src/components/SourceFilter.tsx
import { ChevronDown, ChevronUp } from 'lucide-react';
import { useSearchSourcesStore } from '../stores/searchSourcesStore';
import { useFiltersStore } from '../stores/filtersStore';

export function SourceFilter() {
  const { sources, toggleSource } = useSearchSourcesStore();
  const { expandedFilters, toggleFilterExpanded } = useFiltersStore();

  return (
    <div className="bg-white rounded-lg border border-gray-200">
      <button
        onClick={() => toggleFilterExpanded('sources')}
        className="w-full flex items-center justify-between p-4 hover:bg-gray-50 rounded-lg"
      >
        <span className="font-semibold text-gray-900">Источники</span>
        {expandedFilters.sources ? (
          <ChevronUp className="w-4 h-4 text-gray-500" />
        ) : (
          <ChevronDown className="w-4 h-4 text-gray-500" />
        )}
      </button>
      
      {expandedFilters.sources && (
        <div className="px-4 pb-4 border-t border-gray-200">
          <div className="space-y-3 pt-3">
            <label className="flex items-center">
              <input
                type="checkbox"
                checked={sources.hh}
                onChange={() => toggleSource('hh')}
                className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
              />
              <span className="ml-2 text-sm text-gray-700">HH.ru</span>
            </label>
            
            <label className="flex items-center">
              <input
                type="checkbox"
                checked={sources.zarplata}
                onChange={() => toggleSource('zarplata')}
                className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
              />
              <span className="ml-2 text-sm text-gray-700">Zarplata.ru</span>
            </label>
          </div>
        </div>
      )}
    </div>
  );
}