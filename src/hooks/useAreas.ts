import { useState, useEffect } from 'react';

export interface Area {
  id: string;
  name: string;
  parent_id: string | null;
}

interface HHArea {
  id: string;
  name: string;
  parent_id: string | null;
  areas: HHArea[];
}

interface HHAreaResponse {
  id: string;
  name: string;
  areas: HHArea[];
}

export function useAreas() {
  const [areas, setAreas] = useState<Area[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const loadAreas = async () => {
      setIsLoading(true);
      setError(null);
      
      try {
        const response = await fetch('https://api.hh.ru/areas/113'); // Россия
        const data: HHAreaResponse = await response.json();
        
        // Извлекаем все города из дерева регионов
        const allCities: Area[] = [];
        
        const extractCities = (area: HHArea) => {
          if (area.areas && area.areas.length > 0) {
            area.areas.forEach(extractCities);
          } else {
            allCities.push({
              id: area.id,
              name: area.name,
              parent_id: area.parent_id
            });
          }
        };
        
        // Обрабатываем все регионы верхнего уровня
        data.areas.forEach(extractCities);
        setAreas(allCities);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Ошибка загрузки городов');
      } finally {
        setIsLoading(false);
      }
    };

    loadAreas();
  }, []);

  return { areas, isLoading, error };
}