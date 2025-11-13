import { Search, X, BookmarkPlus } from 'lucide-react';
import { useState, useEffect } from 'react';
import { Button } from './Button'

interface SearchFormProps {
  searchQuery: string;
  onSearchChange: (query: string) => void;
  onSearch: () => void;
  onReset?: () => void;
  onSaveSearch?: () => void;
  isLoading?: boolean;
  hasResults?: boolean;
  canSaveSearch?: boolean;
}

export function SearchForm({ 
  searchQuery, 
  onSearchChange, 
  onSearch, 
  onReset,
  onSaveSearch,
  isLoading = false,
  hasResults = false,
  canSaveSearch = false,
}: SearchFormProps) {
  const [placeholder, setPlaceholder] = useState('');

  useEffect(() => {
    const updatePlaceholder = () => {
      if (window.innerWidth < 768) {
        // Мобильная версия - короткий плейсхолдер
        setPlaceholder('Должность...');
      } else if (window.innerWidth < 1024) {
        // Планшетная версия - средний плейсхолдер
        setPlaceholder('Например: frontend...');
      } else {
        // Десктопная версия - полный плейсхолдер
        setPlaceholder('Введите название должности, например: frontend разработчик');
      }
    };

    // Устанавливаем начальное значение
    updatePlaceholder();

    // Слушаем изменения размера окна
    window.addEventListener('resize', updatePlaceholder);

    // Очистка
    return () => window.removeEventListener('resize', updatePlaceholder);
  }, []);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSearch();
  };

  const showResetButton = (searchQuery.trim() || hasResults) && onReset;
  const canSaveByData = canSaveSearch || Boolean(searchQuery.trim());
  const showSaveButton = onSaveSearch && canSaveByData;

  return (
    <div className="w-full max-w-2xl mx-auto">
      <form onSubmit={handleSubmit}>
        <div className="relative">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <Search className="h-5 w-5 text-gray-400" />
          </div>
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => onSearchChange(e.target.value)}
            placeholder={placeholder}
            className="block w-full pl-10 pr-20 sm:pr-24 py-3 border border-gray-300 rounded-lg bg-white text-gray-900 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-base"          
            disabled={isLoading}
          />
          <button
            type="submit"
            disabled={isLoading || !searchQuery.trim()}
            className="absolute right-2 top-1/2 transform -translate-y-1/2 bg-blue-600 text-white px-3 py-2 sm:px-4 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed transition-colors text-sm sm:text-base"        
          >
            {isLoading ? 'Поиск...' : 'Найти'}
          </button>
        </div>
      </form>
      {(showResetButton || showSaveButton) && (
        <div className="flex flex-wrap justify-center gap-3 mt-4">
          {showSaveButton && (
            <Button
              view="blue"
              size="md"
              icon={<BookmarkPlus className="w-5 h-5" />} 
              onClick={onSaveSearch}
              disabled={isLoading || !canSaveByData}
              loading={isLoading}
            >
              Сохранить поиск
            </Button>
          )}
          {showResetButton && (
            <Button
              view="outline"
              size="md"
              icon={<X className="w-5 h-5" />} 
              onClick={onReset}
              disabled={isLoading}
            >
              Сбросить поиск
            </Button>
          )}
        </div>
      )}
    </div>
  );
}