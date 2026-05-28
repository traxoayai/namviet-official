import { z } from 'zod';

export interface Warehouse {
  id?: number;
  company_id?: string | null;
  key: string;
  code?: string | null;
  name: string;
  type: string;
  address?: string | null;
  manager?: string | null;
  phone?: string | null;
  latitude?: number | null;
  longitude?: number | null;
  status: string;
  created_at?: string;
}

export const warehouseSchema = z.object({
  company_id: z.string().nullable().optional(),
  key: z.string().min(1, 'Mã định danh (Key) là bắt buộc'),
  code: z.string().nullable().optional(),
  name: z.string().min(1, 'Tên chi nhánh là bắt buộc'),
  type: z.string().default('retail'),
  address: z.string().nullable().optional(),
  manager: z.string().nullable().optional(),
  phone: z.string().nullable().optional(),
  latitude: z.coerce.number().nullable().optional(),
  longitude: z.coerce.number().nullable().optional(),
  status: z.string().default('active'),
});

export type WarehouseFormData = z.infer<typeof warehouseSchema>;
