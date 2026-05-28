ALTER TABLE public.users DROP COLUMN IF EXISTS company_id;
ALTER TABLE public.users ADD COLUMN company_id UUID REFERENCES public.companies(id) ON DELETE SET NULL;
