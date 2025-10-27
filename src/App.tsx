import { Header } from './components/Header';
import { SearchForm } from './components/SearchForm';
import { useSearch } from './hooks/useSearch';

function App() {
  const { searchQuery, setSearchQuery, isLoading, handleSearch } = useSearch();

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      <main className="container mx-auto px-4 py-8">
        <div className="text-center">
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

          <div className="mt-8 bg-white rounded-lg shadow-sm p-8 max-w-2xl mx-auto">
            {isLoading ? (
              <p className="text-gray-500">Ищем вакансии...</p>
            ) : (
              <p className="text-gray-500">
                Введите запрос для поиска вакансий
              </p>
            )}
          </div>
        </div>
      </main>
    </div>
  );
}

export default App;