import { useQuery } from '@tanstack/react-query';
import { companyService } from '@/services/api/company.service';

export const companyKeys = {
  all: ['companies'] as const,
};

export function useCompanies() {
  return useQuery({
    queryKey: companyKeys.all,
    queryFn: companyService.getAll,
  });
}
