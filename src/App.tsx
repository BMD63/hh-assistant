import { Header } from './components/Header';
import { SearchForm } from './components/SearchForm';
import { VacancyCard } from './components/VacancyCard';
import { useSearch } from './hooks/useSearch';
import { useVacancies } from './hooks/useVacancies';

function App() {
  const { vacancies, isLoading, error, searchVacancies } = useVacancies();
  const { searchQuery, setSearchQuery, handleSearch } = useSearch(searchVacancies);

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

        {error && (
          <div className="max-w-2xl mx-auto mb-6 p-4 bg-red-50 border border-red-200 rounded-lg">
            <p className="text-red-800">{error}</p>
          </div>
        )}

        <div className="grid gap-4 max-w-4xl mx-auto">
          {isLoading ? (
            <div className="text-center py-8">
              <p className="text-gray-500">Ищем вакансии...</p>
            </div>
          ) : vacancies.length > 0 ? (
            vacancies.map((vacancy) => (
              <VacancyCard key={vacancy.id} vacancy={vacancy} />
            ))
          ) : searchQuery ? (
            <div className="text-center py-8">
              <p className="text-gray-500">Вакансии не найдены</p>
            </div>
          ) : null}
        </div>
      </main>
    </div>
  );
}

export default App;