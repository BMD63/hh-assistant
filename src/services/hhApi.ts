import type { VacanciesResponse } from '../types/vacancy';

const API_BASE_URL = 'https://api.hh.ru';

interface SearchParams {
  text?: string;
  page?: number;
  per_page?: number;
  salary?: number;
  salary_to?: number;
  experience?: string;
  employment?: string;
  schedule?: string;
  area?: string;
  period?: number;
  order_by?: string;
}

export class HHApiService {
  private async fetchAPI(endpoint: string, params: Record<string, string> = {}) {
    const url = new URL(`${API_BASE_URL}${endpoint}`);
    
    Object.entries(params).forEach(([key, value]) => {
      if (value !== undefined && value !== '') {
        url.searchParams.append(key, value);
      }
    });

    const response = await fetch(url.toString());
    
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    
    return response.json();
  }

  async searchVacancies(params: SearchParams): Promise<VacanciesResponse> {

    console.log('🔍 searchVacancies called with:', params);

    const apiParams: Record<string, string> = {};

    if (params.text) apiParams.text = params.text;
    if (params.page !== undefined) apiParams.page = params.page.toString();
    if (params.per_page !== undefined) apiParams.per_page = params.per_page.toString();
    if (params.salary !== undefined) apiParams.salary = params.salary.toString();
    if (params.salary_to !== undefined) apiParams.salary_to = params.salary_to.toString();
    if (params.experience) apiParams.experience = params.experience;
    if (params.employment) apiParams.employment = params.employment;
    if (params.schedule) apiParams.schedule = params.schedule;

    if (params.area !== undefined && params.area !== '113') {
      apiParams.area = params.area;
    }
    if (params.period) apiParams.period = params.period.toString();
    if (params.order_by) apiParams.order_by = params.order_by;

    apiParams.search_field = 'name';

    return this.fetchAPI('/vacancies', apiParams);
  }

  async getVacancy(id: string) {
    return this.fetchAPI(`/vacancies/${id}`);
  }
}

export const hhApiService = new HHApiService();