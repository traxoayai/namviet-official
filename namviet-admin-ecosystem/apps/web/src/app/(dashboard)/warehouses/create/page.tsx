"use client";

import React from 'react';
import { WarehouseForm } from '@/components/features/warehouses/warehouse-form';
import { useCreateWarehouse } from '@/hooks/queries/use-warehouses';
import { WarehouseFormData } from '@namviet/shared-types/src/warehouse.types';
import { toast } from 'sonner';
import { useRouter } from 'next/navigation';

export default function CreateWarehousePage() {
  const createMutation = useCreateWarehouse();
  const router = useRouter();

  const handleSubmit = (data: WarehouseFormData) => {
    createMutation.mutate(data, {
      onSuccess: () => {
        toast.success('Thêm mới chi nhánh thành công!');
        router.push('/warehouses');
      },
      onError: (err) => {
        toast.error(`Lỗi: ${err.message}`);
      }
    });
  };

  return (
    <div className="p-6 h-[calc(100vh-80px)] overflow-y-auto bg-slate-50/50 dark:bg-slate-900/50">
      <WarehouseForm 
        onSubmit={handleSubmit}
        isLoading={createMutation.isPending}
      />
    </div>
  );
}
