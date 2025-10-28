import { useFiltersStore } from '../stores/filtersStore';

const EXPERIENCE_OPTIONS = [
  { value: 'noExperience', label: 'Нет опыта' },
  { value: 'between1And3', label: 'От 1 года до 3 лет' },
  { value: 'between3And6', label: 'От 3 до 6 лет' },
  { value: 'moreThan6', label: 'Более 6 лет' },
];

export function ExperienceFilter() {
  const { experience, setExperience } = useFiltersStore();

  const handleExperienceChange = (value: string) => {
    const newExperience = experience.includes(value)
      ? [] // сбрасываем фильтр
      : [value]; // выбираем новый
    
    setExperience(newExperience);
  };

  return (
    <div className="bg-white rounded-lg border border-gray-200 p-4">
      <h3 className="font-semibold text-gray-900 mb-3">Опыт работы</h3>
      
      <div className="space-y-2">
        <label className="flex items-center">
          <input
            type="radio"
            name="experience"
            value=""
            checked={experience.length === 0}
            onChange={() => setExperience([])}
            className="w-4 h-4 text-blue-600 border-gray-300 focus:ring-blue-500"
          />
          <span className="ml-2 text-sm text-gray-700">Не имеет значения</span>
        </label>
        
        {EXPERIENCE_OPTIONS.map((option) => (
          <label key={option.value} className="flex items-center">
            <input
              type="radio"
              name="experience"
              value={option.value}
              checked={experience.includes(option.value)}
              onChange={() => handleExperienceChange(option.value)}
              className="w-4 h-4 text-blue-600 border-gray-300 focus:ring-blue-500"
            />
            <span className="ml-2 text-sm text-gray-700">{option.label}</span>
          </label>
        ))}
      </div>
    </div>
  );
}