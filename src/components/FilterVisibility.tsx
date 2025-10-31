import { useFiltersStore } from '../stores/filtersStore';

const FILTER_OPTIONS = [
  { key: 'experience', label: 'Опыт работы' },
  { key: 'schedule', label: 'График работы' },
  { key: 'area', label: 'Город' },
] as const;

export function FilterVisibility() {
  const { visibleFilters, toggleFilterVisibility } = useFiltersStore();

  return (
    <div className="bg-white rounded-lg border border-gray-200 p-4">
      <h3 className="font-semibold text-gray-900 mb-3">Фильтры</h3>
      
      <div className="space-y-2">
        {/* Текстовые фильтры (всегда включены) */}
        <div className="flex items-center py-1">
          <div className="w-4 h-4 bg-blue-600 rounded flex items-center justify-center">
            <span className="text-white text-xs">✓</span>
          </div>
          <span className="ml-2 text-sm text-gray-700 font-medium">Ключевые слова</span>
        </div>
        
        {/* Остальные фильтры с чекбоксами */}
        {FILTER_OPTIONS.map((option) => (
          <label key={option.key} className="flex items-center py-1 cursor-pointer">
            <input
              type="checkbox"
              checked={visibleFilters[option.key]}
              onChange={() => toggleFilterVisibility(option.key)}
              className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
            />
            <span className="ml-2 text-sm text-gray-700">{option.label}</span>
          </label>
        ))}
      </div>
    </div>
  );
}