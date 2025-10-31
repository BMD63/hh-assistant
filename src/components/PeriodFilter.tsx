import { ChevronDown, ChevronUp } from 'lucide-react';
import { useFiltersStore } from '../stores/filtersStore';

const PERIOD_OPTIONS = [
  { value: null, label: 'За все время' },
  { value: 1, label: 'За сегодня' },
  { value: 3, label: 'За 3 дня' },
  { value: 7, label: 'За неделю' },
  { value: 30, label: 'За месяц' },
];

export function PeriodFilter() {
  const { period, setPeriod, expandedFilters, toggleFilterExpanded } = useFiltersStore();

  const handlePeriodChange = (value: number | null) => {
    setPeriod(value);
  };

  return (
    <div className="bg-white rounded-lg border border-gray-200">
      {/* Заголовок-кнопка */}
      <button
        onClick={() => toggleFilterExpanded('period')}
        className="w-full flex items-center justify-between p-4 hover:bg-gray-50 rounded-lg"
      >
        <span className="font-semibold text-gray-900">Период публикации</span>
        {expandedFilters.period ? (
          <ChevronUp className="w-4 h-4 text-gray-500" />
        ) : (
          <ChevronDown className="w-4 h-4 text-gray-500" />
        )}
      </button>
      
      {/* Контент фильтра */}
      {expandedFilters.period && (
        <div className="px-4 pb-4 border-t border-gray-200">
          <div className="space-y-2 pt-3">
            {PERIOD_OPTIONS.map((option) => (
              <label key={option.value ?? 'all'} className="flex items-center">
                <input
                  type="radio"
                  name="period"
                  value={option.value ?? ''}
                  checked={period === option.value}
                  onChange={() => handlePeriodChange(option.value)}
                  className="w-4 h-4 text-blue-600 border-gray-300 focus:ring-blue-500"
                />
                <span className="ml-2 text-sm text-gray-700">{option.label}</span>
              </label>
            ))}
          </div>
          
          <div className="text-xs text-gray-500 mt-3 bg-blue-50 p-2 rounded">
            💡 Показывает только вакансии, опубликованные за выбранный период
          </div>
        </div>
      )}
    </div>
  );
}