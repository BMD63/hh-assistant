import { Link } from 'react-router-dom'
import { Heart, Bookmark } from 'lucide-react'
import { useFavoritesStore } from '../stores/favoritesStore'
import { useSavedSearchesStore } from '../stores/savedSearchesStore'

export function Header() {
  const { favorites } = useFavoritesStore()
  const savedSearchesCount = useSavedSearchesStore((state) => state.savedSearches.length)

  return (
    <header className="border-b border-gray-200 bg-white">
      <div className="container mx-auto px-4 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center">
              <span className="text-white font-bold text-sm">HH</span>
            </div>
            <Link to="/hh-assistant" className="text-2xl font-bold text-gray-900 hover:text-gray-700">
              HH Assistant
            </Link>
          </div>
          <nav className="flex items-center space-x-6">
            <Link to="/hh-assistant" className="text-gray-600 hover:text-gray-900 font-medium">
              Поиск
            </Link>
            <Link 
              to="/hh-assistant/favorites" 
              className="flex items-center text-gray-600 hover:text-gray-900 font-medium relative"
            >
              <Heart className="w-5 h-5 mr-1" />
              Избранное
              {favorites.length > 0 && (
                <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                  {favorites.length}
                </span>
              )}
            </Link>
            <Link 
              to="/hh-assistant/saved-searches" 
              className="flex items-center text-gray-600 hover:text-gray-900 font-medium relative"
            >
              <Bookmark className="w-5 h-5 mr-1" />
              Сохраненные поиски
              {savedSearchesCount > 0 && (
                <span className="absolute -top-2 -right-2 bg-blue-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                  {savedSearchesCount}
                </span>
              )}
            </Link>
          </nav>
        </div>
      </div>
    </header>
  )
}