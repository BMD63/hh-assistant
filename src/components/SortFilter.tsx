import { ChevronDown, ChevronUp } from 'lucide-react';
import { useFiltersStore } from '../stores/filtersStore';

const SORT_OPTIONS = [
  { value: 'relevance', label: 'По релевантности' },
  { value: 'salary_desc', label: 'По убыванию зарплаты' },
  { value: 'salary_asc', label: 'По возрастанию зарплаты' },
  { value: 'publication_time', label: 'По дате публикации' },
];

export function SortFilter() {
  const { sortBy, setSortBy, expandedFilters, toggleFilterExpanded } = useFiltersStore();

  const handleSortChange = (value: string) => {
    setSortBy(value);
  };

  return (
    <div className="bg-white rounded-lg border border-gray-200">
      {/* Заголовок-кнопка */}
      <button
        onClick={() => toggleFilterExpanded('sort')}
        className="w-full flex items-center justify-between p-4 hover:bg-gray-50 rounded-lg"
      >
        <span className="font-semibold text-gray-900">Сортировка</span>
        {expandedFilters.sort ? (
          <ChevronUp className="w-4 h-4 text-gray-500" />
        ) : (
          <ChevronDown className="w-4 h-4 text-gray-500" />
        )}
      </button>
      
      {/* Контент фильтра */}
      {expandedFilters.sort && (
        <div className="px-4 pb-4 border-t border-gray-200">
          <div className="space-y-2 pt-3">
            {SORT_OPTIONS.map((option) => (
              <label key={option.value} className="flex items-center">
                <input
                  type="radio"
                  name="sort"
                  value={option.value}
                  checked={sortBy === option.value}
                  onChange={() => handleSortChange(option.value)}
                  className="w-4 h-4 text-blue-600 border-gray-300 focus:ring-blue-500"
                />
                <span className="ml-2 text-sm text-gray-700">{option.label}</span>
              </label>
            ))}
          </div>
          
          <div className="text-xs text-gray-500 mt-3 bg-blue-50 p-2 rounded">
            💡 Сортировка по релевантности показывает наиболее подходящие вакансии первыми
          </div>
        </div>
      )}
    </div>
  );
}