import { Link } from 'react-router-dom'
import { Heart, Bookmark, Search } from 'lucide-react'
import { useFavoritesStore } from '../stores/favoritesStore'
import { useSavedSearchesStore } from '../stores/savedSearchesStore'

export function Header() {
  const { favorites } = useFavoritesStore()
  const savedSearchesCount = useSavedSearchesStore((state) => state.savedSearches.length)

  return (
    <header className="border-b border-gray-200 bg-white">
      <div className="container mx-auto px-2 sm:px-4 py-4">
        <div className="flex items-center justify-between gap-2 min-w-0">
          <div className="flex items-center space-x-2 flex-shrink-0">
            <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center">
              <span className="text-white font-bold text-sm">HH</span>
            </div>
            <Link to="/" className="text-xl sm:text-2xl font-bold text-gray-900 hover:text-gray-700 whitespace-nowrap">
              HH Assistant
            </Link>
          </div>
          <nav className="flex items-center gap-2 sm:gap-4 md:gap-6 flex-shrink-0">
            <Link 
              to="/" 
              className="flex items-center text-gray-600 hover:text-gray-900 font-medium whitespace-nowrap"
              title="Поиск"
            >
              <Search className="w-5 h-5 sm:mr-1" />
              <span className="hidden sm:inline">Поиск</span>
            </Link>
            <Link 
              to="/favorites" 
              className="flex items-center text-gray-600 hover:text-gray-900 font-medium relative whitespace-nowrap"
              title="Избранное"
            >
              <Heart className="w-5 h-5 sm:mr-1" />
              <span className="hidden sm:inline">Избранное</span>
              {favorites.length > 0 && (
                <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                  {favorites.length}
                </span>
              )}
            </Link>
            <Link 
              to="/saved-searches" 
              className="flex items-center text-gray-600 hover:text-gray-900 font-medium relative whitespace-nowrap"
              title="Сохраненные поиски"
            >
              <Bookmark className="w-5 h-5 sm:mr-1" />
              <span className="hidden md:inline">Сохраненные поиски</span>
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