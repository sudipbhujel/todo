import { apiConfig } from '@/config';
import { TodosApi } from '@openapi/api';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { AxiosError } from 'axios';
import { toast } from 'react-toastify';

export const useDeleteTodo = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (id: number) => {
      const api = new TodosApi(apiConfig);
      const response = await api.todosControllerRemove(id);
      return response.data;
    },
    onSuccess: () => {
      toast.success('Todo deleted successfully.');
      queryClient.invalidateQueries({ queryKey: ['todos'] });
    },
    onError(error: AxiosError) {
      toast.error(error.message);
    }
  });
};
