import { apiClient } from './index';

export interface Company {
  id: string;
  name: string;
  short_name?: string;
  status: string;
}

export const companyService = {
  getAll: (): Promise<Company[]> => {
    return apiClient.get('/companies');
  },
};
