import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import type { Vacancy } from '../types/vacancy'

interface FavoritesState {
  favorites: Vacancy[]
  addToFavorites: (vacancy: Vacancy) => void
  removeFromFavorites: (vacancyId: string) => void
  isFavorite: (vacancyId: string) => boolean
  clearFavorites: () => void
}

export const useFavoritesStore = create<FavoritesState>()(
  persist(
    (set, get) => ({
      favorites: [],
      
      addToFavorites: (vacancy) => 
        set((state) => {
          // Проверяем нет ли уже в избранном
          if (state.favorites.find(fav => fav.id === vacancy.id)) {
            return state
          }
          return { favorites: [...state.favorites, vacancy] }
        }),
      
      removeFromFavorites: (vacancyId) =>
        set((state) => ({
          favorites: state.favorites.filter(fav => fav.id !== vacancyId)
        })),
      
      isFavorite: (vacancyId) => 
        get().favorites.some(fav => fav.id === vacancyId),
      
      clearFavorites: () => set({ favorites: [] }),
    }),
    {
      name: 'favorites-storage', // ключ в localStorage
    }
  )
)