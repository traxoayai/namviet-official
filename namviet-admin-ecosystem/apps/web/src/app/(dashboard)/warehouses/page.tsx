"use client";

import React, { useEffect } from 'react';
import { WarehouseTable } from '@/components/features/warehouses/warehouse-table';
import { useWarehouses, useDeleteWarehouse, useUpdateWarehouse } from '@/hooks/queries/use-warehouses';
import { toast } from 'sonner';

export default function WarehousesPage() {
  const { data: warehouses = [], isLoading, error } = useWarehouses();
  const deleteMutation = useDeleteWarehouse();
  const updateMutation = useUpdateWarehouse();

  useEffect(() => {
    // Session storage logic for menu persistence if needed
    sessionStorage.setItem('activePage', 'warehouses');
  }, []);

  if (error) {
    toast.error('Lỗi khi tải danh sách chi nhánh');
  }

  const handleDelete = (id: number) => {
    deleteMutation.mutate(id, {
      onSuccess: () => {
        toast.success('Xóa vĩnh viễn chi nhánh thành công');
      },
      onError: (err) => {
        toast.error(`Lỗi: ${err.message}`);
      }
    });
  };

  const handleToggleStatus = (id: number, currentStatus: string) => {
    const warehouseToUpdate = warehouses.find(w => w.id === id);
    if (!warehouseToUpdate) return;
    
    const newStatus = currentStatus === 'active' ? 'inactive' : 'active';
    const updatedData = {
      ...warehouseToUpdate,
      status: newStatus
    };

    updateMutation.mutate(
      { id, data: updatedData as any },
      {
        onSuccess: () => {
          toast.success(`Đã chuyển trạng thái thành: ${newStatus === 'active' ? 'Hoạt động' : 'Không hoạt động'}`);
        },
        onError: (err) => {
          toast.error(`Lỗi: ${err.message}`);
        }
      }
    );
  };

  return (
    <div className="p-6 h-[calc(100vh-80px)] overflow-hidden">
      <WarehouseTable 
        data={warehouses}
        isLoading={isLoading}
        onDelete={handleDelete}
        onToggleStatus={handleToggleStatus}
      />
    </div>
  );
}
