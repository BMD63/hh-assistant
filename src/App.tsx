import { Header } from './components/Header';
import { SearchForm } from './components/SearchForm';
import { VacancyCard } from './components/VacancyCard';
import { LoadMoreButton } from './components/LoadMoreButton';
import { IncludeExcludeFilter } from './components/IncludeExcludeFilter';
import { ExperienceFilter } from './components/ExperienceFilter';
import { useSearch } from './hooks/useSearch';
import { useVacancies } from './hooks/useVacancies';
import { PeriodFilter } from './components/PeriodFilter';
import { ScheduleFilter } from './components/ScheduleFilter';
import { AreaFilter } from './components/AreaFilter';
import { SalaryFilter } from './components/SalaryFilter';
import { SortFilter } from './components/SortFilter'

function App() {
  const { vacancies, isLoading, error, hasMore, searchVacancies, loadMore } = useVacancies();

  const { searchQuery, setSearchQuery, handleSearch } = useSearch((query: string) => {
    searchVacancies(query, 0);
  });

  // Условия для показа кнопки "Загрузить еще"
  const showLoadMore = vacancies.length > 0 && hasMore;

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      <main className="container mx-auto px-4 py-8">
        <div className="text-center mb-8">
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

        <div className="flex gap-8 max-w-6xl mx-auto">
          {/* Боковая панель с фильтрами */}
          <div className="w-80 flex-shrink-0">
            <div className="space-y-4">
               {/* Всегда видимые фильтры */}
              <IncludeExcludeFilter />

               {/* Условно видимые фильтры */}
              <PeriodFilter />
              <ExperienceFilter />
              <ScheduleFilter />
              <AreaFilter />
              <SalaryFilter />
              <SortFilter />
            </div>
          </div>

          {/* Основной контент */}
          <div className="flex-1">
            {error && (
              <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg">
                <p className="text-red-800">{error}</p>
              </div>
            )}

            {/* Статистика найденных вакансий */}
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
              show={showLoadMore}
            />
          </div>
        </div>
      </main>
    </div>
  );
}

export default App;