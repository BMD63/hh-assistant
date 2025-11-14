import { ChevronDown, ChevronUp } from 'lucide-react';
import { useState } from 'react';
import { useFiltersStore } from '../stores/filtersStore';
import { hhApiService } from '../services/hhApi';

export function AreaFilter() {
  const { area, setArea, expandedFilters, toggleFilterExpanded } = useFiltersStore();
  const [cityQuery, setCityQuery] = useState('');
  const [status, setStatus] = useState<'idle' | 'loading' | 'not-found' | 'applied'>('idle');

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
            Выберите город для поиска вакансий. Введите название города и нажмите «Найти».
          </div>

          <div className="flex items-center gap-2 mb-3">
            <input
              type="text"
              value={cityQuery}
              onChange={(e) => { setCityQuery(e.target.value); setStatus('idle'); }}
              placeholder="Например: Москва"
              className="flex-1 py-2 px-3 border border-gray-300 rounded-md text-sm"
            />
            <button
              onClick={async () => {
                if (!cityQuery.trim()) return;
                setStatus('loading');
                try {
                  const id = await hhApiService.findAreaIdByName(cityQuery.trim());
                  if (id) {
                    setArea(id);
                    setStatus('applied');
                  } else {
                    setStatus('not-found');
                  }
                  } catch {
                  // network or parsing error — treat as not found for UX
                  setStatus('not-found');
                }
              }}
              className="px-3 py-2 bg-blue-600 text-white rounded-md text-sm hover:bg-blue-700"
            >
              {status === 'loading' ? 'Поиск...' : 'Найти'}
            </button>
          </div>

          <div className="flex items-center gap-3 mb-3">
            <label className="flex items-center">
              <input
                type="radio"
                name="area"
                value="113"
                checked={area === '113'}
                onChange={() => { setArea('113'); setStatus('idle'); }}
                className="w-4 h-4 text-blue-600 border-gray-300 focus:ring-blue-500"
              />
              <span className="ml-2 text-sm text-gray-700 font-medium">Вся Россия</span>
            </label>

            <button
              onClick={() => { setArea('113'); setCityQuery(''); setStatus('idle'); }}
              className="ml-auto text-sm text-gray-600 hover:underline"
            >
              Сбросить
            </button>
          </div>

          <div className="text-xs text-gray-500 mt-2">
            {status === 'not-found' && (
              <span className="text-red-600">Город не найден. Попробуйте другое имя или используйте ключевые слова.</span>
            )}
            {status === 'applied' && (
              <span className="text-green-700">Город применён — id: {area}</span>
            )}
          </div>
        </div>
      )}
    </div>
  );
}