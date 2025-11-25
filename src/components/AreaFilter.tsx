import { ChevronDown, ChevronUp, Search } from 'lucide-react';
import { useState, useMemo } from 'react';
import { useFiltersStore } from '../stores/filtersStore';
import { useAreas } from '../hooks/useAreas';

export function AreaFilter() {
  const { area, setArea, expandedFilters, toggleFilterExpanded } = useFiltersStore();
  const { areas, isLoading: areasLoading, error } = useAreas();
  const [searchQuery, setSearchQuery] = useState('');
  
  // Фильтруем города по поисковому запросу
  const filteredAreas = useMemo(() => {
    if (!searchQuery.trim()) return [];
    
    const query = searchQuery.toLowerCase().trim();
    return areas.filter(city => 
      city.name.toLowerCase().includes(query)
    ).slice(0, 10); // Ограничиваем количество результатов
  }, [areas, searchQuery]);

  const handleSelectCity = (cityId: string, cityName: string) => {
    setArea(cityId);
    setSearchQuery(cityName); // Показываем выбранный город в поле поиска
  };

  const handleReset = () => {
    setArea('113');
    setSearchQuery('');
  };

  const isRussiaSelected = area === '113';
  const selectedCity = areas.find(city => city.id === area);

  return (
    <div className="bg-white rounded-lg border border-gray-200">
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
      
      {expandedFilters.area && (
        <div className="px-4 pb-4 border-t border-gray-200">
          <div className="text-sm text-gray-600 mb-3 pt-3">
            Выберите город для поиска вакансий
          </div>

          {/* Поле поиска города */}
          <div className="relative mb-3">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Начните вводить название города..."
              className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md text-sm"
            />
          </div>

          {/* Состояние загрузки */}
          {areasLoading && (
            <div className="text-sm text-gray-500 mb-3">Загрузка городов...</div>
          )}

          {/* Результаты поиска */}
          {searchQuery && filteredAreas.length > 0 && (
            <div className="mb-3 max-h-40 overflow-y-auto border border-gray-200 rounded-md">
              {filteredAreas.map(city => (
                <button
                  key={city.id}
                  onClick={() => handleSelectCity(city.id, city.name)}
                  className="w-full text-left px-3 py-2 text-sm hover:bg-gray-50 border-b border-gray-100 last:border-b-0"
                >
                  {city.name}
                </button>
              ))}
            </div>
          )}

          {/* Сообщение "не найдено" */}
          {searchQuery && !areasLoading && filteredAreas.length === 0 && (
            <div className="text-sm text-gray-500 mb-3">Город не найден</div>
          )}

          {/* Выбор "Вся Россия" */}
          <div className="flex items-center justify-between mb-3">
            <label className="flex items-center">
              <input
                type="radio"
                name="area"
                value="113"
                checked={isRussiaSelected}
                onChange={handleReset}
                className="w-4 h-4 text-blue-600 border-gray-300 focus:ring-blue-500"
              />
              <span className="ml-2 text-sm text-gray-700 font-medium">Вся Россия</span>
            </label>

            {/* Информация о выбранном городе */}
            {!isRussiaSelected && selectedCity && (
              <div className="flex items-center gap-2">
                <span className="text-sm text-blue-700 font-medium">
                  {selectedCity.name}
                </span>
                <button
                  onClick={handleReset}
                  className="text-sm text-gray-600 hover:underline"
                >
                  Сбросить
                </button>
              </div>
            )}
          </div>

          {error && (
            <div className="text-xs text-red-600 mt-2">
              Ошибка загрузки городов: {error}
            </div>
          )}
        </div>
      )}
    </div>
  );
}