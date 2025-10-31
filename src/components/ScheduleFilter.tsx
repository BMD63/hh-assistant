import { ChevronDown, ChevronUp } from 'lucide-react';
import { useFiltersStore } from '../stores/filtersStore';
import { SCHEDULE_OPTIONS } from '../constants/filters';

export function ScheduleFilter() {
  const { schedule, setSchedule, expandedFilters, toggleFilterExpanded } = useFiltersStore();

  const handleScheduleChange = (value: string) => {
    const newSchedule = schedule.includes(value) ? [] : [value];
    setSchedule(newSchedule);
  };

  return (
    <div className="bg-white rounded-lg border border-gray-200">
      {/* Заголовок-кнопка */}
      <button
        onClick={() => toggleFilterExpanded('schedule')}
        className="w-full flex items-center justify-between p-4 hover:bg-gray-50 rounded-lg"
      >
        <span className="font-semibold text-gray-900">График работы</span>
        {expandedFilters.schedule ? (
          <ChevronUp className="w-4 h-4 text-gray-500" />
        ) : (
          <ChevronDown className="w-4 h-4 text-gray-500" />
        )}
      </button>
      
      {/* Контент фильтра */}
      {expandedFilters.schedule && (
        <div className="px-4 pb-4 border-t border-gray-200">
          <div className="space-y-2 pt-3">
            <label className="flex items-center">
              <input
                type="radio"
                name="schedule"
                value=""
                checked={schedule.length === 0}
                onChange={() => setSchedule([])}
                className="w-4 h-4 text-blue-600 border-gray-300 focus:ring-blue-500"
              />
              <span className="ml-2 text-sm text-gray-700">Не имеет значения</span>
            </label>
            
            {SCHEDULE_OPTIONS.map((option) => (
              <label key={option.value} className="flex items-center">
                <input
                  type="radio"
                  name="schedule"
                  value={option.value}
                  checked={schedule.includes(option.value)}
                  onChange={() => handleScheduleChange(option.value)}
                  className="w-4 h-4 text-blue-600 border-gray-300 focus:ring-blue-500"
                />
                <span className="ml-2 text-sm text-gray-700">{option.label}</span>
              </label>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}