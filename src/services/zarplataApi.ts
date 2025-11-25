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

    // Добавляем параметры для JSON ответа
    searchParams.append('enable_snippets', 'true');
    
    const url = `${this.API_BASE_URL}?${searchParams.toString()}`;
    console.log('🔍 Zarplata API URL:', url);

    const response = await fetch(url, {
      headers: {
        'Accept': 'application/json',
        'User-Agent': 'HH-Assistant/1.0',
        'Content-Type': 'application/json'
      }
    });
    
    if (!response.ok) {
      throw new Error(`Zarplata API error: ${response.status}`);
    }

    // Проверим content-type ответа
    const contentType = response.headers.get('content-type');
    console.log('🔍 Zarplata Response Content-Type:', contentType);

    const responseText = await response.text();
    console.log('🔍 Zarplata Response (first 500 chars):', responseText.substring(0, 500));

    try {
      const data = JSON.parse(responseText);
      console.log('🔍 Zarplata Parsed JSON:', data);
      return data;
    } catch {
      console.error('❌ Zarplata API returned non-JSON response');
      console.error('🔍 Full response:', responseText);
      throw new Error('Zarplata API returned HTML instead of JSON');
    }
  }

  async getVacancy(id: string): Promise<ZarplataVacancy> {
    const url = `${this.API_BASE_URL}/${id}`;
    console.log('🔍 Zarplata Get Vacancy URL:', url);

    const response = await fetch(url, {
      headers: {
        'Accept': 'application/json',
        'User-Agent': 'HH-Assistant/1.0'
      }
    });
    
    if (!response.ok) {
      throw new Error(`Zarplata API error: ${response.status}`);
    }

    const responseText = await response.text();
    console.log('🔍 Zarplata Vacancy Response:', responseText.substring(0, 500));

    try {
      return JSON.parse(responseText);
    } catch {
      console.error('❌ Zarplata Vacancy API returned non-JSON response');
      throw new Error('Zarplata Vacancy API returned HTML instead of JSON');
    }
  }
}

export const zarplataApiService = new ZarplataApiService();