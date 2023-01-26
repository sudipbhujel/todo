import { apiConfig } from '@/config';
import { AuthDto, AuthenticationApi } from '@openapi/api';
import { useQuery } from '@tanstack/react-query';
import { useState } from 'react';

export const useAuth = () => {
  const [user, setUser] = useState<AuthDto | undefined>(undefined);

  const { status, error } = useQuery(
    ['auth'],
    async () => {
      const api = new AuthenticationApi(apiConfig);

      const response = await api.authControllerCheckAuth();
      return response.data;
    },
    {
      onSuccess: (data) => {
        setUser(data);
      }
    }
  );

  return { user, status, error };
};
