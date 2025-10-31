import { ChevronDown, ChevronUp } from 'lucide-react';
import { useFiltersStore } from '../stores/filtersStore';
import { EXPERIENCE_OPTIONS } from '../constants/filters';

export function ExperienceFilter() {
  const { experience, setExperience, expandedFilters, toggleFilterExpanded } = useFiltersStore();

  const handleExperienceChange = (value: string) => {
    const newExperience = experience.includes(value) ? [] : [value];
    setExperience(newExperience);
  };

  return (
    <div className="bg-white rounded-lg border border-gray-200">
      {/* Заголовок-кнопка */}
      <button
        onClick={() => toggleFilterExpanded('experience')}
        className="w-full flex items-center justify-between p-4 hover:bg-gray-50 rounded-lg"
      >
        <span className="font-semibold text-gray-900">Опыт работы</span>
        {expandedFilters.experience ? (
          <ChevronUp className="w-4 h-4 text-gray-500" />
        ) : (
          <ChevronDown className="w-4 h-4 text-gray-500" />
        )}
      </button>
      
      {/* Контент фильтра */}
      {expandedFilters.experience && (
        <div className="px-4 pb-4 border-t border-gray-200">
          <div className="space-y-2 pt-3">
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
      )}
    </div>
  );
}