-- 1. Chuyển đổi kiểu dữ liệu cột company_id sang UUID
-- Sử dụng USING NULL nếu cột đang chứa dữ liệu rác (số nguyên) không thể ép kiểu sang UUID
ALTER TABLE public.users 
ALTER COLUMN company_id TYPE UUID USING NULL;

-- 2. Gắn Khóa ngoại (Foreign Key) để đảm bảo tính toàn vẹn dữ liệu
ALTER TABLE public.users
ADD CONSTRAINT users_company_id_fkey 
FOREIGN KEY (company_id) REFERENCES public.companies(id) ON DELETE SET NULL;

-- 3. Gắn Khóa ngoại cho warehouse_id luôn (nếu chưa có)
ALTER TABLE public.users
ADD CONSTRAINT users_warehouse_id_fkey 
FOREIGN KEY (warehouse_id) REFERENCES public.warehouses(id) ON DELETE SET NULL;
