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

interface AreaNode {
  id: string;
  name?: string;
  areas?: AreaNode[];
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

  /**
   * Fetch the list of areas and try to find an area id by a partial name match.
   * Returns the first matched area's id or null if not found.
   * The HH areas endpoint returns a nested tree, so we flatten it recursively.
   */
  async findAreaIdByName(name: string): Promise<string | null> {
    if (!name || !name.trim()) return null;

    const areas = await this.fetchAPI('/areas');

    const needle = name.trim().toLowerCase();

  const stack: AreaNode[] = Array.isArray(areas) ? ([...areas] as AreaNode[]) : [];

    // DFS through the tree and try to find the best match
  let bestMatch: { id: string; name?: string } | null = null;

    while (stack.length > 0) {
      const node = stack.pop();
      if (!node) continue;

      const nodeName = (node.name || '').toString().toLowerCase();
      if (!nodeName) continue;

      if (nodeName === needle) {
        // exact match — return immediately
        return node.id;
      }

      // prefer startsWith over contains
      if (nodeName.startsWith(needle) && !bestMatch) {
        bestMatch = { id: node.id, name: node.name };
      } else if (nodeName.includes(needle) && !bestMatch) {
        bestMatch = { id: node.id, name: node.name };
      }

      if (Array.isArray(node.areas)) {
        for (const child of node.areas) stack.push(child);
      }
    }

    return bestMatch ? bestMatch.id : null;
  }
}

export const hhApiService = new HHApiService();