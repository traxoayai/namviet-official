ALTER TABLE public.users 
ADD COLUMN role_id UUID, 
ADD COLUMN company_id BIGINT, 
ADD COLUMN warehouse_id BIGINT;
