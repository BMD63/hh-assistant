import { useParams, Link } from 'react-router-dom';
import { useState, useEffect } from 'react';
import { ArrowLeft, MapPin, Building, Calendar, DollarSign, Clock } from 'lucide-react';
import type { Vacancy } from '../types/vacancy';
import { hhApiService } from '../services/hhApi';

export function VacancyPage() {
  const { id } = useParams<{ id: string }>();
  const [vacancy, setVacancy] = useState<Vacancy | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchVacancy = async () => {
      if (!id) return;
      
      setIsLoading(true);
      setError(null);
      
      try {
        const vacancyData = await hhApiService.getVacancy(id);
        setVacancy(vacancyData);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Ошибка загрузки вакансии');
      } finally {
        setIsLoading(false);
      }
    };

    fetchVacancy();
  }, [id]);

  const formatSalary = (salary: Vacancy['salary']) => {
    if (!salary) return 'Зарплата не указана';
    
    const parts = [];
    if (salary.from) parts.push(`от ${salary.from}`);
    if (salary.to) parts.push(`до ${salary.to}`);
    
    return `${parts.join(' ')} ${salary.currency}`;
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 py-8">
        <div className="container mx-auto px-4">
          <div className="text-center py-12">
            <p className="text-gray-500">Загрузка вакансии...</p>
          </div>
        </div>
      </div>
    );
  }

  if (error || !vacancy) {
    return (
      <div className="min-h-screen bg-gray-50 py-8">
        <div className="container mx-auto px-4">
          <div className="text-center py-12">
            <p className="text-red-500 mb-4">{error || 'Вакансия не найдена'}</p>
            <Link to="/" className="text-blue-600 hover:text-blue-800">
              Вернуться к поиску
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="container mx-auto px-4 max-w-4xl">
        {/* Хлебные крошки */}
        <div className="mb-6">
          <Link 
            to="/" 
            className="inline-flex items-center text-blue-600 hover:text-blue-800 mb-4"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Назад к поиску
          </Link>
        </div>

        {/* Карточка вакансии */}
        <div className="bg-white rounded-lg border border-gray-200 p-6 mb-6">
          <div className="flex justify-between items-start mb-4">
            <div className="flex-1">
              <h1 className="text-2xl font-bold text-gray-900 mb-2">{vacancy.name}</h1>
              
              <div className="flex items-center text-gray-600 mb-2">
                <Building className="w-4 h-4 mr-2" />
                <span className="font-medium">{vacancy.employer.name}</span>
              </div>
              
              <div className="flex items-center text-gray-600 mb-2">
                <MapPin className="w-4 h-4 mr-2" />
                <span>{vacancy.area.name}</span>
              </div>
            </div>
            
            <div className="text-right">
              <p className="text-green-600 font-bold text-lg">
                {formatSalary(vacancy.salary)}
              </p>
            </div>
          </div>

          {/* Детали вакансии */}
          <div className="grid grid-cols-2 gap-4 mb-6">
            <div className="flex items-center text-gray-600">
              <Clock className="w-4 h-4 mr-2" />
              <span>{vacancy.schedule.name}</span>
            </div>
            
            <div className="flex items-center text-gray-600">
              <Calendar className="w-4 h-4 mr-2" />
              <span>{vacancy.experience.name}</span>
            </div>
            
            <div className="flex items-center text-gray-600">
              <DollarSign className="w-4 h-4 mr-2" />
              <span>{vacancy.employment.name}</span>
            </div>
          </div>

          {/* Описание */}
          {vacancy.snippet?.requirement && (
            <div className="mb-6">
              <h3 className="font-semibold text-gray-900 mb-2">Требования</h3>
              <p className="text-gray-700 leading-relaxed">{vacancy.snippet.requirement}</p>
            </div>
          )}

          {vacancy.snippet?.responsibility && (
            <div className="mb-6">
              <h3 className="font-semibold text-gray-900 mb-2">Обязанности</h3>
              <p className="text-gray-700 leading-relaxed">{vacancy.snippet.responsibility}</p>
            </div>
          )}

          {/* Навыки */}
          {vacancy.key_skills && vacancy.key_skills.length > 0 && (
            <div className="mb-6">
              <h3 className="font-semibold text-gray-900 mb-2">Ключевые навыки</h3>
              <div className="flex flex-wrap gap-2">
                {vacancy.key_skills.map((skill, index) => (
                  <span
                    key={index}
                    className="px-3 py-1 bg-blue-100 text-blue-800 text-sm rounded-full"
                  >
                    {skill.name}
                  </span>
                ))}
              </div>
            </div>
          )}

          {/* Кнопка отклика */}
          <div className="border-t border-gray-200 pt-6">
            <a
              href={vacancy.alternate_url}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-block bg-green-600 text-white px-6 py-3 rounded-lg hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500 font-medium"
            >
              Откликнуться на вакансию
            </a>
            <p className="text-sm text-gray-500 mt-2">
              Отклик откроется на официальном сайте HH.ru
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}