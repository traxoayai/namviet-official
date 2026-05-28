import { createApiClient } from '@namviet/shared-utils';
import { createClient } from '@/lib/supabase/client';

const supabase = createClient();

export const apiClient = createApiClient({
  baseURL: process.env.NEXT_PUBLIC_API_URL as string,
  getToken: async () => {
    const { data: { session }, error } = await supabase.auth.getSession();
    if (error || !session) return null;
    return session.access_token;
  },
  onUnauthorized: () => {
    // TODO: Bắn event văng ra màn hình đăng nhập hoặc redirect sang /login
    if (typeof window !== 'undefined') {
      // window.location.href = '/login';
    }
  }
});
