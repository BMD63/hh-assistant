import { ChevronDown, ChevronUp } from 'lucide-react';
import { useFiltersStore } from '../stores/filtersStore';

const CURRENCY_OPTIONS = [
  { value: 'RUR', label: '₽ Рубли' },
  { value: 'USD', label: '$ Доллары' },
  { value: 'EUR', label: '€ Евро' },
];

export function SalaryFilter() {
  const { 
    salaryFrom, 
    salaryTo, 
    salaryCurrency,
    setSalaryFrom, 
    setSalaryTo, 
    setSalaryCurrency,
    expandedFilters, 
    toggleFilterExpanded 
  } = useFiltersStore();

  const handleSalaryFromChange = (value: string) => {
    const numValue = value === '' ? null : parseInt(value, 10);
    setSalaryFrom(numValue);
  };

  const handleSalaryToChange = (value: string) => {
    const numValue = value === '' ? null : parseInt(value, 10);
    setSalaryTo(numValue);
  };

  return (
    <div className="bg-white rounded-lg border border-gray-200">
      {/* Заголовок-кнопка */}
      <button
        onClick={() => toggleFilterExpanded('salary')}
        className="w-full flex items-center justify-between p-4 hover:bg-gray-50 rounded-lg"
      >
        <span className="font-semibold text-gray-900">Зарплата</span>
        {expandedFilters.salary ? (
          <ChevronUp className="w-4 h-4 text-gray-500" />
        ) : (
          <ChevronDown className="w-4 h-4 text-gray-500" />
        )}
      </button>
      
      {/* Контент фильтра */}
      {expandedFilters.salary && (
        <div className="px-4 pb-4 border-t border-gray-200">
          <div className="space-y-3 pt-3">
            {/* Валюта */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Валюта
              </label>
              <select
                value={salaryCurrency}
                onChange={(e) => setSalaryCurrency(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
              >
                {CURRENCY_OPTIONS.map((option) => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>
            </div>

            {/* Зарплата ОТ */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Зарплата от
              </label>
              <input
                type="number"
                value={salaryFrom || ''}
                onChange={(e) => handleSalaryFromChange(e.target.value)}
                placeholder="0"
                min="0"
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
              />
            </div>

            {/* Зарплата ДО */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Зарплата до
              </label>
              <input
                type="number"
                value={salaryTo || ''}
                onChange={(e) => handleSalaryToChange(e.target.value)}
                placeholder="Любая"
                min="0"
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
              />
            </div>

            {/* Подсказка */}
            <div className="text-xs text-gray-500 bg-gray-50 p-2 rounded">
              💡 Укажите "от" для поиска вакансий с зарплатой не ниже указанной
            </div>
          </div>
        </div>
      )}
    </div>
  );
}