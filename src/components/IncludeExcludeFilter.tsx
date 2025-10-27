import { useState } from 'react';
import { Plus, X } from 'lucide-react';
import { useFiltersStore } from '../stores/filtersStore';

export function IncludeExcludeFilter() {
  const [includeInput, setIncludeInput] = useState('');
  const [excludeInput, setExcludeInput] = useState('');
  
  const { includeTerms, excludeTerms, addIncludeTerm, removeIncludeTerm, addExcludeTerm, removeExcludeTerm } = useFiltersStore();

  const handleAddInclude = () => {
    if (includeInput.trim()) {
      addIncludeTerm(includeInput);
      setIncludeInput('');
    }
  };

  const handleAddExclude = () => {
    if (excludeInput.trim()) {
      addExcludeTerm(excludeInput);
      setExcludeInput('');
    }
  };

  return (
    <div className="bg-white rounded-lg border border-gray-200 p-4">
      <h3 className="font-semibold text-gray-900 mb-3">Фильтры по ключевым словам</h3>
      
      {/* Включаемые термины */}
      <div className="mb-4">
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Должно включать
        </label>
        <div className="flex gap-2 mb-2">
          <input
            type="text"
            value={includeInput}
            onChange={(e) => setIncludeInput(e.target.value)}
            onKeyPress={(e) => e.key === 'Enter' && handleAddInclude()}
            placeholder="Например: React"
            className="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
          <button
            onClick={handleAddInclude}
            className="px-3 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <Plus className="w-4 h-4" />
          </button>
        </div>
        
        {/* Чипсы включенных терминов */}
        <div className="flex flex-wrap gap-2">
          {includeTerms.map((term, index) => (
            <span
              key={index}
              className="inline-flex items-center px-3 py-1 bg-green-100 text-green-800 text-sm rounded-full"
            >
              {term}
              <button
                onClick={() => removeIncludeTerm(term)}
                className="ml-1 hover:text-green-900 focus:outline-none"
              >
                <X className="w-3 h-3" />
              </button>
            </span>
          ))}
        </div>
      </div>

      {/* Исключаемые термины */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Не должно включать
        </label>
        <div className="flex gap-2 mb-2">
          <input
            type="text"
            value={excludeInput}
            onChange={(e) => setExcludeInput(e.target.value)}
            onKeyPress={(e) => e.key === 'Enter' && handleAddExclude()}
            placeholder="Например: Angular"
            className="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
          <button
            onClick={handleAddExclude}
            className="px-3 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-500"
          >
            <Plus className="w-4 h-4" />
          </button>
        </div>
        
        {/* Чипсы исключенных терминов */}
        <div className="flex flex-wrap gap-2">
          {excludeTerms.map((term, index) => (
            <span
              key={index}
              className="inline-flex items-center px-3 py-1 bg-red-100 text-red-800 text-sm rounded-full"
            >
              {term}
              <button
                onClick={() => removeExcludeTerm(term)}
                className="ml-1 hover:text-red-900 focus:outline-none"
              >
                <X className="w-3 h-3" />
              </button>
            </span>
          ))}
        </div>
      </div>
    </div>
  );
}