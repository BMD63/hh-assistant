import { Link } from 'react-router-dom'
import { ArrowLeft, Heart, Trash2 } from 'lucide-react'
import { VacancyCard } from '../components/VacancyCard'
import { useFavoritesStore } from '../stores/favoritesStore'

export function FavoritesPage() {
  const { favorites, clearFavorites } = useFavoritesStore()

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="container mx-auto px-4 max-w-6xl">
        {/* Хлебные крошки и заголовок */}
        <div className="mb-6">
          <Link 
            to="/hh-assistant" 
            className="inline-flex items-center text-blue-600 hover:text-blue-800 mb-4"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Назад к поиску
          </Link>
          
          <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 mb-2 flex items-center">
                <Heart className="w-8 h-8 text-red-500 mr-3 fill-red-500" />
                Избранные вакансии
              </h1>
              <p className="text-gray-600">
                {favorites.length === 0 
                  ? 'Здесь появятся вакансии, которые вы добавите в избранное'
                  : `Найдено вакансий: ${favorites.length}`
                }
              </p>
            </div>
            
            {favorites.length > 0 && (
              <div className="w-full flex justify-center">
                <button
                  onClick={clearFavorites}
                  className="flex items-center gap-2 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-500 transition-colors"
                >
                  <Trash2 className="w-5 h-5 align-middle" />
                  <span className="hidden sm:inline align-middle">Очистить все</span>
                  <span className="sm:hidden align-middle">Очистить</span>
                </button>
              </div>
            )}
          </div>
        </div>

        {/* Список избранных вакансий */}
        {favorites.length > 0 ? (
          <div className="grid gap-4">
            {favorites.map((vacancy) => (
              <VacancyCard key={vacancy.id} vacancy={vacancy} />
            ))}
          </div>
        ) : (
          /* Пустое состояние */
          <div className="text-center py-16">
            <Heart className="w-16 h-16 text-gray-300 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-gray-900 mb-2">
              В избранном пока пусто
            </h3>
            <p className="text-gray-600 mb-6 max-w-md mx-auto">
              Нажимайте на сердечко в карточках вакансий, чтобы добавлять их в избранное
            </p>
            <Link
              to="/hh-assistant"
              className="inline-flex items-center px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors"
            >
              Найти вакансии
            </Link>
          </div>
        )}
      </div>
    </div>
  )
}