export interface Salary {
  from?: number;
  to?: number;
  currency: string;
  gross?: boolean;
}

export interface Employer {
  id: string;
  name: string;
  url?: string;
  alternate_url?: string;
  logo_urls?: {
    '90'?: string;
    '240'?: string;
    original?: string;
  };
}

export interface Vacancy {
  id: string;
  name: string;
  area: {
    id: string;
    name: string;
    url?: string;
  };
  salary: Salary | null;
  employer: Employer;
  snippet: {
    requirement?: string;
    responsibility?: string;
  };
  experience: {
    id: string;
    name: string;
  };
  employment: {
    id: string;
    name: string;
  };
  schedule: {
    id: string;
    name: string;
  };
  key_skills: Array<{
    name: string;
  }>;
  published_at: string;
  alternate_url: string;
}

export interface VacanciesResponse {
  items: Vacancy[];
  found: number;
  pages: number;
  page: number;
  per_page: number;
}