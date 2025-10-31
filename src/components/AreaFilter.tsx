import { ChevronDown, ChevronUp } from 'lucide-react';
import { useFiltersStore } from '../stores/filtersStore';

export function AreaFilter() {
  const { area, setArea, expandedFilters, toggleFilterExpanded } = useFiltersStore();

  return (
    <div className="bg-white rounded-lg border border-gray-200">
      {/* Заголовок-кнопка */}
      <button
        onClick={() => toggleFilterExpanded('area')}
        className="w-full flex items-center justify-between p-4 hover:bg-gray-50 rounded-lg"
      >
        <span className="font-semibold text-gray-900">Город</span>
        {expandedFilters.area ? (
          <ChevronUp className="w-4 h-4 text-gray-500" />
        ) : (
          <ChevronDown className="w-4 h-4 text-gray-500" />
        )}
      </button>
      
      {/* Контент фильтра */}
      {expandedFilters.area && (
        <div className="px-4 pb-4 border-t border-gray-200">
          <div className="text-sm text-gray-600 mb-3 pt-3">
            Выберите город для поиска вакансий
          </div>
          <label className="flex items-center mb-2">
            <input
              type="radio"
              name="area"
              value="113"
              checked={area === '113'}
              onChange={() => setArea('113')}
              className="w-4 h-4 text-blue-600 border-gray-300 focus:ring-blue-500"
            />
            <span className="ml-2 text-sm text-gray-700 font-medium">Вся Россия</span>
          </label>
          <div className="text-xs text-gray-500 mt-2">
            Для поиска по конкретному городу используйте поле "Ключевые слова"
          </div>
        </div>
      )}
    </div>
  );
}