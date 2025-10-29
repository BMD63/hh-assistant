import { useState, useMemo } from 'react';
import { Search } from 'lucide-react';
import { useFiltersStore } from '../stores/filtersStore';
import { useAreas } from '../hooks/useAreas';

export function AreaFilter() {
  const { area, setArea } = useFiltersStore();
  const { areas, isLoading, error } = useAreas();
  const [searchQuery, setSearchQuery] = useState('');

  // Фильтруем города по поисковому запросу
  const filteredAreas = useMemo(() => {
    if (!searchQuery) return areas.slice(0, 20); // первые 20 без поиска
    
    return areas
      .filter(city => 
        city.name.toLowerCase().includes(searchQuery.toLowerCase())
      )
      .slice(0, 20); // ограничиваем результаты
  }, [areas, searchQuery]);

  // Находим выбранный город для отображения
  const selectedCity = areas.find(city => city.id === area);

  return (
    <div className="bg-white rounded-lg border border-gray-200 p-4">
      <h3 className="font-semibold text-gray-900 mb-3">Город</h3>
      
      {/* Поле поиска */}
      <div className="relative mb-3">
        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
          <Search className="h-4 w-4 text-gray-400" />
        </div>
        <input
          type="text"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          placeholder="Начните вводить город..."
          className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
        />
      </div>

      {/* Выбранный город */}
      {selectedCity && area !== '113' && (
        <div className="mb-3 p-2 bg-blue-50 rounded border border-blue-200">
          <p className="text-sm text-blue-800 font-medium">Выбрано: {selectedCity.name}</p>
          <button
            onClick={() => setArea('113')}
            className="text-xs text-blue-600 hover:text-blue-800 mt-1"
          >
            Сбросить
          </button>
        </div>
      )}

      {/* Список городов */}
      <div className="space-y-1 max-h-60 overflow-y-auto">
        {isLoading ? (
          <p className="text-sm text-gray-500">Загрузка городов...</p>
        ) : error ? (
          <p className="text-sm text-red-500">{error}</p>
        ) : (
          <>
            {/* Опция "Вся Россия" */}
            <label className="flex items-center p-2 hover:bg-gray-50 rounded cursor-pointer">
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

            {/* Список городов */}
            {filteredAreas.map((city) => (
              <label key={city.id} className="flex items-center p-2 hover:bg-gray-50 rounded cursor-pointer">
                <input
                  type="radio"
                  name="area"
                  value={city.id}
                  checked={area === city.id}
                  onChange={() => setArea(city.id)}
                  className="w-4 h-4 text-blue-600 border-gray-300 focus:ring-blue-500"
                />
                <span className="ml-2 text-sm text-gray-700">{city.name}</span>
              </label>
            ))}
          </>
        )}
      </div>
    </div>
  );
}