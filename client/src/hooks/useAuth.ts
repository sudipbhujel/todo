import { apiConfig } from '@/config';
import { AuthenticationApi } from '@openapi/api';
import { useQuery } from '@tanstack/react-query';

export const useAuth = () => {
  return useQuery(['auth'], async () => {
    const api = new AuthenticationApi(apiConfig);

    const response = await api.authControllerCheckAuth();
    return response.data;
  });
};
