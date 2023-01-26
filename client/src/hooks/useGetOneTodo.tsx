import { apiConfig } from '@/config';
import { TodosApi } from '@openapi/api';
import { useQuery } from '@tanstack/react-query';

export const useGetOneTodo = (id: number) => {
  return useQuery(
    ['todos', id],
    async () => {
      const api = new TodosApi(apiConfig);

      const response = await api.todosControllerFindOne(id);
      return response.data;
    },
    {
      retry: 1
    }
  );
};
