import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { warehouseService } from '../../services/api/warehouse.service';
import { WarehouseFormData } from '@namviet/shared-types/src/warehouse.types';

export const warehouseKeys = {
  all: ['warehouses'] as const,
  detail: (id: number) => ['warehouses', id] as const,
};

export function useWarehouses() {
  return useQuery({
    queryKey: warehouseKeys.all,
    queryFn: warehouseService.getAll,
  });
}

export function useWarehouse(id: number) {
  return useQuery({
    queryKey: warehouseKeys.detail(id),
    queryFn: () => warehouseService.getById(id),
    enabled: !!id,
  });
}

export function useCreateWarehouse() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: (data: WarehouseFormData) => warehouseService.create(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: warehouseKeys.all });
    },
  });
}

export function useUpdateWarehouse() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: ({ id, data }: { id: number; data: WarehouseFormData }) => 
      warehouseService.update(id, data),
    onSuccess: (data, variables) => {
      queryClient.invalidateQueries({ queryKey: warehouseKeys.all });
      queryClient.invalidateQueries({ queryKey: warehouseKeys.detail(variables.id) });
    },
  });
}

export function useDeleteWarehouse() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: (id: number) => warehouseService.delete(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: warehouseKeys.all });
    },
  });
}
