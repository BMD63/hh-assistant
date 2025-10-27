import type { VacanciesResponse } from '../types/vacancy';

const API_BASE_URL = 'https://api.hh.ru';

export class HHApiService {
  private async fetchAPI(endpoint: string, params: Record<string, string> = {}) {
    const url = new URL(`${API_BASE_URL}${endpoint}`);
    
    Object.entries(params).forEach(([key, value]) => {
      if (value) {
        url.searchParams.append(key, value);
      }
    });

    const response = await fetch(url.toString());
    
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    
    return response.json();
  }

  async searchVacancies(
    text: string = '', 
    page: number = 0,
    per_page: number = 20
    ): Promise<VacanciesResponse> {
    return this.fetchAPI('/vacancies', {
        text,
        page: page.toString(),
        per_page: per_page.toString(),
        search_field: 'name'
    });
    }

  async getVacancy(id: string) {
    return this.fetchAPI(`/vacancies/${id}`);
  }
}

export const hhApiService = new HHApiService();