import { apiConfig } from '@/config';
import { TodosApi } from '@openapi/api';
import { useQuery } from '@tanstack/react-query';

export const useGetTodos = (status: string | undefined) => {
  return useQuery(
    ['todos', status],
    async () => {
      const api = new TodosApi(apiConfig);

      const response = await api.todosControllerFindAll(undefined, status);
      return response.data;
    },
    {
      retry: 1
    }
  );
};
