import { apiConfig } from '@/config';
import { AuthenticationApi } from '@openapi/api';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { AxiosError } from 'axios';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';

export const LogoutButton = () => {
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  const { mutate } = useMutation(
    async () => {
      const api = new AuthenticationApi(apiConfig);
      const response = await api.authControllerLogout();
      return response.data;
    },
    {
      onSuccess: () => {
        localStorage.removeItem('accessToken');
        toast.success('Logged out successfully.');
        queryClient.invalidateQueries({ queryKey: ['auth'] });
        navigate('/');
        navigate(0);
      },
      onError(error: AxiosError) {
        toast.error(error.message);
      }
    }
  );

  const handleSubmit = (e: React.MouseEvent<HTMLElement>) => {
    e.preventDefault();
    mutate();
  };

  return (
    <a
      className="inline-block rounded bg-red-600 px-2 py-2 text-sm font-medium text-white transition hover:scale-110 hover:shadow-xl focus:outline-none focus:ring active:bg-red-500 hover:cursor-pointer"
      onClick={handleSubmit}
    >
      Log out
    </a>
  );
};
