import { useState, useEffect } from 'react'
import { Routes, Route } from 'react-router-dom'
import { Filter, X } from 'lucide-react'
import { Header } from './components/Header'
import { SearchForm } from './components/SearchForm'
import { VacancyCard } from './components/VacancyCard'
import { LoadMoreButton } from './components/LoadMoreButton'
import { IncludeExcludeFilter } from './components/IncludeExcludeFilter'
import { SalaryFilter } from './components/SalaryFilter'
import { ExperienceFilter } from './components/ExperienceFilter'
import { ScheduleFilter } from './components/ScheduleFilter'
import { AreaFilter } from './components/AreaFilter'
import { PeriodFilter } from './components/PeriodFilter'
import { SortFilter } from './components/SortFilter'
import { VacancyPage } from './pages/VacancyPage'
import { FavoritesPage } from './pages/FavoritesPage'
import { SavedSearchesPage } from './pages/SavedSearchesPage'
import { useSearch } from './hooks/useSearch'
import { useVacancies } from './hooks/useVacancies'
import { useFiltersStore } from './stores/filtersStore'
import { SaveSearchModal } from './components/SaveSearchModal'
import { useSavedSearchesStore } from './stores/savedSearchesStore'
import { useShallow } from 'zustand/react/shallow'

function HomePage() {
  const { vacancies, isLoading, error, hasMore, searchVacancies, loadMore, clearSearch } = useVacancies();
  const { searchQuery, setSearchQuery, handleSearch } = useSearch((query: string) => {
    searchVacancies(query, 0);
  });
  const filterValues = useFiltersStore(useShallow((state) => ({
    includeTerms: state.includeTerms,
    excludeTerms: state.excludeTerms,
    experience: state.experience,
    salaryFrom: state.salaryFrom,
    salaryTo: state.salaryTo,
    salaryCurrency: state.salaryCurrency,
    employment: state.employment,
    schedule: state.schedule,
    area: state.area,
    period: state.period,
    sortBy: state.sortBy,
  })));
  const resetFilters = useFiltersStore((state) => state.resetFilters);
  const addSavedSearch = useSavedSearchesStore((state) => state.addSavedSearch);
  
  const [isFiltersOpen, setIsFiltersOpen] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const [isSaveModalOpen, setIsSaveModalOpen] = useState(false);
  const [saveSearchName, setSaveSearchName] = useState('');

  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 1024);
    };

    checkMobile();
    window.addEventListener('resize', checkMobile);
    
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  // Восстанавливаем поиск при загрузке страницы, если есть сохраненный запрос
  useEffect(() => {
    if (!searchQuery.trim()) return;
    if (isLoading || vacancies.length > 0) return;

    const timer = setTimeout(() => {
      searchVacancies(searchQuery, 0);
    }, 100);

    return () => clearTimeout(timer);
  }, [searchQuery, vacancies.length, isLoading, searchVacancies]);

  const hasActiveFilters =
    filterValues.includeTerms.length > 0 ||
    filterValues.excludeTerms.length > 0 ||
    filterValues.experience.length > 0 ||
    filterValues.salaryFrom !== null ||
    filterValues.salaryTo !== null ||
    filterValues.employment.length > 0 ||
    filterValues.schedule.length > 0 ||
    filterValues.area !== '113' ||
    filterValues.period !== null ||
    filterValues.sortBy !== 'relevance';

  const canSaveCurrentSearch = Boolean(searchQuery.trim() || hasActiveFilters);

  const handleOpenSaveModal = () => {
    if (!canSaveCurrentSearch) return;
    const defaultName = searchQuery.trim() || 'Новый поиск';
    setSaveSearchName(defaultName);
    setIsSaveModalOpen(true);
  };

  const handleCloseSaveModal = () => {
    setIsSaveModalOpen(false);
    setSaveSearchName('');
  };

  const handleConfirmSaveSearch = () => {
    if (!canSaveCurrentSearch) return;

    const trimmedName = saveSearchName.trim() || searchQuery.trim() || `Поиск ${new Date().toLocaleDateString('ru-RU')}`;
    const queryToSave = searchQuery.trim();

    const filtersToSave = {
      includeTerms: [...filterValues.includeTerms],
      excludeTerms: [...filterValues.excludeTerms],
      experience: [...filterValues.experience],
      salaryFrom: filterValues.salaryFrom,
      salaryTo: filterValues.salaryTo,
      salaryCurrency: filterValues.salaryCurrency,
      employment: [...filterValues.employment],
      schedule: [...filterValues.schedule],
      area: filterValues.area,
      period: filterValues.period,
      sortBy: filterValues.sortBy,
    };

    addSavedSearch({
      name: trimmedName,
      query: queryToSave,
      filters: filtersToSave,
    });

    setIsSaveModalOpen(false);
    setSaveSearchName('');
  };

  const handleReset = () => {
    setSearchQuery('');
    resetFilters();
    clearSearch();
    setIsSaveModalOpen(false);
    setSaveSearchName('');
  };

  return (
    <>
      <div className="text-center mb-8 w-full min-w-0">
        <h2 className="text-4xl font-bold text-gray-900 mb-4">
          Найди свою идеальную вакансию
        </h2>
        <p className="text-xl text-gray-600 mb-8">
          Умный поиск вакансий с HH.ru
        </p>
        
        <SearchForm
          searchQuery={searchQuery}
          onSearchChange={setSearchQuery}
          onSearch={handleSearch}
          onReset={handleReset}
          onSaveSearch={handleOpenSaveModal}
          isLoading={isLoading}
          hasResults={vacancies.length > 0}
          canSaveSearch={hasActiveFilters}
        />
      </div>

      {/* Кнопка открытия фильтров на мобилках */}
      {isMobile && (
        <div className="flex justify-center mb-6">
          <button
            onClick={() => setIsFiltersOpen(true)}
            className="flex items-center px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors"
          >
            <Filter className="w-5 h-5 mr-2" />
            Фильтры
          </button>
        </div>
      )}

      <div className="flex gap-8 w-full max-w-full mx-auto relative">
        {/* Боковая панель с фильтрами */}
        <div className={`
          w-80 flex-shrink-0
          ${isMobile ? `
            fixed top-0 left-0 h-full bg-white z-50 shadow-2xl
            transform transition-transform duration-300 ease-in-out
            ${isFiltersOpen ? 'translate-x-0' : '-translate-x-full'}
          ` : ''}
        `}>
          {/* Заголовок и кнопка закрытия на мобилках */}
          {isMobile && (
            <div className="flex items-center justify-between p-4 border-b border-gray-200">
              <h3 className="text-lg font-semibold text-gray-900">Фильтры</h3>
              <button
                onClick={() => setIsFiltersOpen(false)}
                className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
              >
                <X className="w-5 h-5 text-gray-600" />
              </button>
            </div>
          )}

          {/* Контент фильтров */}
          <div className={`space-y-4 ${isMobile ? 'p-4 h-[calc(100%-80px)] overflow-y-auto' : ''}`}>
            <IncludeExcludeFilter />
            <SalaryFilter />
            <ExperienceFilter />
            <ScheduleFilter />
            <AreaFilter />
            <PeriodFilter />
            <SortFilter />
          </div>
        </div>

        {/* Overlay для мобилок */}
        {isMobile && isFiltersOpen && (
          <div 
            className="fixed inset-0 bg-black bg-opacity-50 z-40"
            onClick={() => setIsFiltersOpen(false)}
          />
        )}

        {/* Основной контент */}
        <div className={`flex-1 ${isMobile ? 'min-w-0' : ''}`}>
          {error && (
            <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg">
              <p className="text-red-800">{error}</p>
            </div>
          )}

          {vacancies.length > 0 && (
            <div className="mb-4 p-3 bg-blue-50 border border-blue-200 rounded-lg">
              <p className="text-blue-800 text-sm">
                Найдено вакансий: <span className="font-semibold">{vacancies.length}</span>
                {hasMore && ' + ещё...'}
              </p>
            </div>
          )}

          <div className="grid gap-4">
            {vacancies.map((vacancy) => (
              <VacancyCard key={vacancy.id} vacancy={vacancy} />
            ))}
            
            {isLoading && vacancies.length === 0 && (
              <div className="text-center py-8">
                <p className="text-gray-500">Ищем вакансии...</p>
              </div>
            )}
            
            {!isLoading && vacancies.length === 0 && searchQuery && (
              <div className="text-center py-8">
                <p className="text-gray-500">Вакансии не найдены</p>
              </div>
            )}
          </div>

          <LoadMoreButton
            onLoadMore={loadMore}
            isLoading={isLoading}
            hasMore={hasMore}
            show={vacancies.length > 0 && hasMore}
          />
        </div>
      </div>

      <SaveSearchModal
        isOpen={isSaveModalOpen}
        name={saveSearchName}
        onNameChange={setSaveSearchName}
        onClose={handleCloseSaveModal}
        onConfirm={handleConfirmSaveSearch}
      />
    </>
  );
}

function App() {
  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      <main className="container mx-auto px-4 py-8">
        <Routes>
          <Route path="/hh-assistant" element={<HomePage />} />
          <Route path="/hh-assistant/vacancy/:id" element={<VacancyPage />} />
          <Route path="/hh-assistant/favorites" element={<FavoritesPage />} />
          <Route path="/hh-assistant/saved-searches" element={<SavedSearchesPage />} />
          {/* Резервные маршруты для локальной разработки */}
          <Route path="/" element={<HomePage />} />
          <Route path="/vacancy/:id" element={<VacancyPage />} />
          <Route path="/favorites" element={<FavoritesPage />} />
          <Route path="/saved-searches" element={<SavedSearchesPage />} />
        </Routes>
      </main>
    </div>
  );
}

export default App