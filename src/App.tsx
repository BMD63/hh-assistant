import { Header } from './components/Header';

function App() {
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
          <div className="bg-white rounded-lg shadow-sm p-8 max-w-2xl mx-auto">
            <p className="text-gray-500">
              Скоро здесь появится поиск вакансий...
            </p>
          </div>
        </div>
      </main>
    </div>
  );
}

export default App;