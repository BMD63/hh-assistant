import { useFiltersStore } from '../stores/filtersStore';

const SCHEDULE_OPTIONS = [
  { value: 'remote', label: 'Удаленная работа' },
  { value: 'fullDay', label: 'Полный день' },
  { value: 'flexible', label: 'Гибкий график' },
  { value: 'shift', label: 'Сменный график' },
];

export function ScheduleFilter() {
  const { schedule, setSchedule } = useFiltersStore();

  const handleScheduleChange = (value: string) => {
    const newSchedule = schedule.includes(value)
      ? schedule.filter(s => s !== value)
      : [...schedule, value];
    
    setSchedule(newSchedule);
  };

  return (
    <div className="bg-white rounded-lg border border-gray-200 p-4">
      <h3 className="font-semibold text-gray-900 mb-3">График работы</h3>
      
      <div className="space-y-2">
        {SCHEDULE_OPTIONS.map((option) => (
          <label key={option.value} className="flex items-center">
            <input
              type="checkbox"
              value={option.value}
              checked={schedule.includes(option.value)}
              onChange={() => handleScheduleChange(option.value)}
              className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
            />
            <span className="ml-2 text-sm text-gray-700">{option.label}</span>
          </label>
        ))}
      </div>
    </div>
  );
}