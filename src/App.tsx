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
import { useSearch } from './hooks/useSearch'
import { useVacancies } from './hooks/useVacancies'

function HomePage() {
  const { vacancies, isLoading, error, hasMore, searchVacancies, loadMore } = useVacancies();
  const { searchQuery, setSearchQuery, handleSearch } = useSearch((query: string) => {
    searchVacancies(query, 0);
  });
  
  const [isFiltersOpen, setIsFiltersOpen] = useState(false);
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 1024);
    };

    checkMobile();
    window.addEventListener('resize', checkMobile);
    
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

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
          isLoading={isLoading}
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
    </>
  )
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
          {/* Резервные маршруты для локальной разработки */}
          <Route path="/" element={<HomePage />} />
          <Route path="/vacancy/:id" element={<VacancyPage />} />
          <Route path="/favorites" element={<FavoritesPage />} />
        </Routes>
      </main>
    </div>
  )
}

export default App