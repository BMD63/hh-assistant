import { Link } from 'react-router-dom'
import { MapPin, Building, Calendar, Heart } from 'lucide-react'
import type { Vacancy } from '../types/vacancy'
import { useFavoritesStore } from '../stores/favoritesStore'

interface VacancyCardProps {
  vacancy: Vacancy
}

export function VacancyCard({ vacancy }: VacancyCardProps) {
  const { addToFavorites, removeFromFavorites, isFavorite } = useFavoritesStore()
  const isVacancyFavorite = isFavorite(vacancy.id)

  console.log('🔍 Vacancy data:', vacancy)
  console.log('🔍 Experience:', vacancy.experience)
  console.log('🔍 Area:', vacancy.area)
  console.log('🔍 Employer:', vacancy.employer)

  const handleFavoriteClick = (e: React.MouseEvent) => {
    e.preventDefault()
    e.stopPropagation()
    
    if (isVacancyFavorite) {
      removeFromFavorites(vacancy.id)
    } else {
      addToFavorites(vacancy)
    }
  }

  const formatSalary = (salary: Vacancy['salary']) => {
    if (!salary) return 'Зарплата не указана'
    
    const parts: string[] = []
    if (salary.from) parts.push(`от ${salary.from}`)
    if (salary.to) parts.push(`до ${salary.to}`)
    
    return `${parts.join(' ')} ${salary.currency}`
  }

  // Преобразуем служебные теги HH <highlighttext> в <mark>
  const toHighlightedHtml = (text: string) => {
    return text
      .replaceAll('<highlighttext>', '<mark class="bg-yellow-100 text-gray-900 px-0.5 rounded">')
      .replaceAll('</highlighttext>', '</mark>')
  }

  const skills = vacancy.key_skills || []

  return (
    <Link to={`/vacancy/${vacancy.id}`} className="block">
      <div className="bg-white rounded-lg border border-gray-200 p-6 hover:shadow-md transition-shadow cursor-pointer relative">
        {/* Кнопка избранного */}
        <button
          onClick={handleFavoriteClick}
          className="absolute top-4 right-4 p-2 rounded-full hover:bg-gray-100 transition-colors"
          title={isVacancyFavorite ? 'Удалить из избранного' : 'Добавить в избранное'}
        >
          <Heart 
            className={`w-5 h-5 ${
              isVacancyFavorite 
                ? 'fill-red-500 text-red-500' 
                : 'text-gray-400 hover:text-red-500'
            } transition-colors`}
          />
        </button>

        <div className="flex justify-between items-start mb-3 pr-8">
          <h3 className="text-lg font-semibold text-gray-900">{vacancy.name}</h3>
          <div className="text-right">
            <p className="text-green-600 font-medium">
              {formatSalary(vacancy.salary)}
            </p>
          </div>
        </div>
        
        <div className="flex items-center text-gray-600 mb-2">
          <Building className="w-4 h-4 mr-2" />
          <span>{vacancy.employer?.name || 'Работодатель не указан'}</span>
        </div>
        
        <div className="flex items-center text-gray-600 mb-2">
          <MapPin className="w-4 h-4 mr-2" />
          <span>{vacancy.area?.name || 'Город не указан'}</span>
        </div>
        
        <div className="flex items-center text-gray-600 mb-3">
          <Calendar className="w-4 h-4 mr-2" />
           <span>(vacancy.experience?.name || 'Опыт не указан')</span>
        </div>

        {vacancy.snippet?.requirement && (
          <div className="mb-3">
            <p
              className="text-sm text-gray-600 line-clamp-2"
              dangerouslySetInnerHTML={{ __html: toHighlightedHtml(vacancy.snippet.requirement) }}
            />
          </div>
        )}

        {skills.length > 0 && (
          <div className="flex flex-wrap gap-1">
            {skills.slice(0, 3).map((skill, index) => (
              <span
                key={index}
                className="px-2 py-1 bg-blue-100 text-blue-800 text-xs rounded"
              >
                {skill.name}
              </span>
            ))}
            {skills.length > 3 && (
              <span className="px-2 py-1 bg-gray-100 text-gray-600 text-xs rounded">
                +{skills.length - 3}
              </span>
            )}
          </div>
        )}
        {vacancy.source && (
          <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${
            vacancy.source === 'hh' 
              ? 'bg-blue-100 text-blue-800' 
              : 'bg-green-100 text-green-800'
          }`}>
            {vacancy.source === 'hh' ? 'HH.ru' : 'Zarplata.ru'}
          </span>
        )}
      </div>
    </Link>
  )
}