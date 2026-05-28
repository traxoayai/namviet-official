import { Warehouse, WarehouseFormData } from '@namviet/shared-types/src/warehouse.types';
import { apiClient } from './index';

export const warehouseService = {
  getAll: (): Promise<Warehouse[]> => {
    return apiClient.get('/warehouses');
  },

  getById: (id: number): Promise<Warehouse> => {
    return apiClient.get(`/warehouses/${id}`);
  },

  create: (data: WarehouseFormData): Promise<Warehouse> => {
    return apiClient.post('/warehouses', data);
  },

  update: (id: number, data: WarehouseFormData): Promise<Warehouse> => {
    return apiClient.put(`/warehouses/${id}`, data);
  },

  delete: (id: number): Promise<void> => {
    return apiClient.delete(`/warehouses/${id}`);
  },
};
