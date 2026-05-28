import { apiClient } from './index';

export interface Role {
  id: string;
  name: string;
  description?: string;
  created_at?: string;
}

export const roleService = {
  getAll: (): Promise<Role[]> => {
    return apiClient.get('/roles');
  },
  create: (data: { name: string; description: string; permissions: string[] }): Promise<Role> => {
    return apiClient.post('/roles', data);
  },
};
