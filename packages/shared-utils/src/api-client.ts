import axios, { AxiosInstance, InternalAxiosRequestConfig, AxiosResponse, AxiosError } from 'axios';

export interface ApiClientOptions {
  baseURL: string;
  getToken?: () => Promise<string | null>;
  onUnauthorized?: () => void;
}

export const createApiClient = ({ baseURL, getToken, onUnauthorized }: ApiClientOptions): AxiosInstance => {
  if (!baseURL) {
    throw new Error('Lỗi hệ thống: Không tìm thấy baseURL.');
  }

  const client = axios.create({
    baseURL,
    timeout: 15000,
    headers: {
      'Content-Type': 'application/json',
    },
  });

  // 1. TRẠM KIỂM SOÁT CHIỀU ĐI (REQUEST)
  client.interceptors.request.use(
    async (config: InternalAxiosRequestConfig) => {
      if (getToken && config.headers) {
        const token = await getToken();
        if (token) {
          config.headers.Authorization = `Bearer ${token}`;
        }
      }
      return config;
    },
    (error: AxiosError) => Promise.reject(error)
  );

  // 2. TRẠM KIỂM SOÁT CHIỀU VỀ (RESPONSE)
  client.interceptors.response.use(
    (response: AxiosResponse) => {
      // Chỉ bóc tách lấy đúng phần dữ liệu lõi (data)
      return response.data;
    },
    (error: AxiosError) => {
      // Bắt mã lỗi 401
      if (error.response?.status === 401) {
        console.error('Báo động: Phiên đăng nhập hết hạn hoặc không hợp lệ.');
        if (onUnauthorized) {
          onUnauthorized();
        }
      }
      
      return Promise.reject(error.response?.data || error.message);
    }
  );

  return client;
};
