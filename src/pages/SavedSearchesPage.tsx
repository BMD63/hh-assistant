import { useMemo, useCallback } from 'react'
import { useNavigate } from 'react-router-dom'
import { Clock, Play, Trash2 } from 'lucide-react'
import { useSavedSearchesStore } from '../stores/savedSearchesStore'
import { useFiltersStore } from '../stores/filtersStore'
import { useSearchStore } from '../stores/searchStore'
import { Button } from '../components/Button'

export function SavedSearchesPage() {
  const savedSearches = useSavedSearchesStore((state) => state.savedSearches)
  const removeSavedSearch = useSavedSearchesStore((state) => state.removeSavedSearch)
  const clearSavedSearches = useSavedSearchesStore((state) => state.clearSavedSearches)
  const navigate = useNavigate()

  const hasSavedSearches = savedSearches.length > 0

  const handleApplySearch = useCallback((searchId: string) => {
    const saved = savedSearches.find((item) => item.id === searchId)
    if (!saved) return

    const { filters, query } = saved

    useFiltersStore.setState((state) => ({
      ...state,
      includeTerms: [...filters.includeTerms],
      excludeTerms: [...filters.excludeTerms],
      experience: [...filters.experience],
      salaryFrom: filters.salaryFrom,
      salaryTo: filters.salaryTo,
      salaryCurrency: filters.salaryCurrency,
      employment: [...filters.employment],
      schedule: [...filters.schedule],
      area: filters.area,
      period: filters.period,
      sortBy: filters.sortBy,
      expandedFilters: {
        experience: false,
        schedule: false,
        area: false,
        salary: false,
        employment: false,
        period: false,
        sort: false,
        sources: false,
      },
    }))

    useSearchStore.getState().setSearchQuery(query)

    navigate('/hh-assistant')
  }, [navigate, savedSearches])

  const handleDeleteSearch = useCallback((searchId: string) => {
    removeSavedSearch(searchId)
  }, [removeSavedSearch])

  const handleClearAll = useCallback(() => {
    clearSavedSearches()
  }, [clearSavedSearches])

  const savedSearchCards = useMemo(() => {
    return savedSearches.map((savedSearch) => {
      const badges: Array<{ label: string; value: string }> = []

      if (savedSearch.filters.includeTerms.length > 0) {
        badges.push({ label: 'Включить', value: savedSearch.filters.includeTerms.join(', ') })
      }
      if (savedSearch.filters.excludeTerms.length > 0) {
        badges.push({ label: 'Исключить', value: savedSearch.filters.excludeTerms.join(', ') })
      }
      if (savedSearch.filters.experience.length > 0) {
        badges.push({ label: 'Опыт', value: savedSearch.filters.experience.join(', ') })
      }
      if (savedSearch.filters.employment.length > 0) {
        badges.push({ label: 'Занятость', value: savedSearch.filters.employment.join(', ') })
      }
      if (savedSearch.filters.schedule.length > 0) {
        badges.push({ label: 'График', value: savedSearch.filters.schedule.join(', ') })
      }
      if (savedSearch.filters.salaryFrom !== null || savedSearch.filters.salaryTo !== null) {
        const parts = []
        if (savedSearch.filters.salaryFrom !== null) parts.push(`от ${savedSearch.filters.salaryFrom}`)
        if (savedSearch.filters.salaryTo !== null) parts.push(`до ${savedSearch.filters.salaryTo}`)
        const salaryText = [parts.join(' '), savedSearch.filters.salaryCurrency].filter(Boolean).join(' ')
        badges.push({ label: 'Зарплата', value: salaryText.trim() })
      }
      if (savedSearch.filters.area !== '113') {
        badges.push({ label: 'Регион', value: savedSearch.filters.area })
      }
      if (savedSearch.filters.period !== null) {
        badges.push({ label: 'Период', value: `${savedSearch.filters.period} дн.` })
      }
      if (savedSearch.filters.sortBy !== 'relevance') {
        badges.push({ label: 'Сортировка', value: savedSearch.filters.sortBy })
      }

      const createdAtFormatted = new Date(savedSearch.createdAt).toLocaleString('ru-RU')

      return (
        <div
          key={savedSearch.id}
          className="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm transition hover:shadow-md"
        >
          <div className="flex flex-col gap-4 md:flex-row md:items-start md:justify-between">
            <div>
              <h3 className="text-lg font-semibold text-gray-900">{savedSearch.name}</h3>
              <p className="mt-1 text-sm text-gray-600">
                Запрос: <span className="font-medium text-gray-900">{savedSearch.query || 'Без текстового запроса'}</span>
              </p>
              <div className="mt-2 flex items-center gap-2 text-xs text-gray-500">
                <Clock className="h-4 w-4" />
                <span>Создан: {createdAtFormatted}</span>
              </div>
            </div>
            <div className="flex flex-shrink-0 gap-2 flex-wrap">
              <Button
                view="blue"
                size="md"
                icon={<Play className="w-5 h-5" />} 
                onClick={() => handleApplySearch(savedSearch.id)}
              >
                Применить
              </Button>
              <Button
                view="outline"
                size="md"
                icon={<Trash2 className="w-5 h-5" />} 
                onClick={() => handleDeleteSearch(savedSearch.id)}
              >
                Удалить
              </Button>
            </div>
          </div>
          {badges.length > 0 && (
            <div className="mt-4 flex flex-wrap gap-2">
              {badges.map((badge, index) => (
                <span
                  key={`${savedSearch.id}-badge-${index}`}
                  className="inline-flex items-center gap-2 rounded-full border border-blue-200 bg-blue-50 px-3 py-1 text-xs font-medium text-blue-700"
                >
                  <span className="uppercase text-[10px] tracking-wide text-blue-500">{badge.label}</span>
                  <span>{badge.value}</span>
                </span>
              ))}
            </div>
          )}
        </div>
      )
    })
  }, [savedSearches, handleApplySearch, handleDeleteSearch])

  return (
    <div className="mx-auto max-w-4xl px-4 py-8">
      <div className="mb-6 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Сохраненные поиски</h1>
          <p className="mt-2 text-sm text-gray-600">
            Возвращайтесь к часто используемым фильтрам и настройкам одним кликом.
          </p>
        </div>
        {hasSavedSearches && (
          <Button
            view="red"
            size="md"
            className="mx-auto mt-2"
            icon={<Trash2 className="w-5 h-5" />} 
            onClick={handleClearAll}
          >
            <span className="hidden sm:inline">Очистить все</span>
            <span className="sm:hidden">Очистить</span>
          </Button>
        )}
      </div>

      {!hasSavedSearches ? (
        <div className="rounded-2xl border border-dashed border-gray-300 bg-white px-6 py-10 text-center">
          <h2 className="text-lg font-semibold text-gray-900">Пока нет сохраненных поисков</h2>
          <p className="mt-2 text-sm text-gray-600">
            Настройте параметры поиска и сохраните их, чтобы быстро возвращаться к нужным вакансиям.
          </p>
        </div>
      ) : (
        <div className="space-y-4">
          {savedSearchCards}
        </div>
      )}
    </div>
  )
}
