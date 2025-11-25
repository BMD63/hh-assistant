// src/services/zarplataApi.ts
export interface ZarplataVacancy {
  id: string;
  name: string;
  salary?: {
    from?: number;
    to?: number;
    currency?: string;
  };
  company?: {
    name: string;
  };
  area?: {
    name: string;
  };
  description?: string;
  employment?: string;
  experience?: string;
  schedule?: string;
  published_at: string;
}

export interface ZarplataResponse {
  items: ZarplataVacancy[];
  found: number;
  pages: number;
  page: number;
  per_page: number;
}

export class ZarplataApiService {
  private readonly API_BASE_URL = 'https://api.zarplata.ru/vacancies';

  async searchVacancies(params: {
    text?: string;
    page?: number;
    per_page?: number;
    salary_from?: number;
    salary_to?: number;
    experience?: string;
    employment?: string;
    schedule?: string;
    area?: string;
  }): Promise<ZarplataResponse> {
    const searchParams = new URLSearchParams();

    if (params.text) searchParams.append('text', params.text);
    if (params.page) searchParams.append('page', params.page.toString());
    if (params.per_page) searchParams.append('per_page', params.per_page.toString());
    if (params.salary_from) searchParams.append('salary_from', params.salary_from.toString());
    if (params.salary_to) searchParams.append('salary_to', params.salary_to.toString());
    if (params.experience) searchParams.append('experience', params.experience);
    if (params.employment) searchParams.append('employment', params.employment);
    if (params.schedule) searchParams.append('schedule', params.schedule);
    if (params.area) searchParams.append('area', params.area);

    const response = await fetch(`${this.API_BASE_URL}?${searchParams.toString()}`);
    
    if (!response.ok) {
      throw new Error(`Zarplata API error: ${response.status}`);
    }

    return response.json();
  }

  async getVacancy(id: string): Promise<ZarplataVacancy> {
    const response = await fetch(`${this.API_BASE_URL}/${id}`);
    
    if (!response.ok) {
      throw new Error(`Zarplata API error: ${response.status}`);
    }

    return response.json();
  }
}

export const zarplataApiService = new ZarplataApiService();