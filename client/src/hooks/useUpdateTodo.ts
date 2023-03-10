import { apiConfig } from '@/config';
import { TodoDto, TodosApi } from '@openapi/api';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { AxiosError } from 'axios';

import { toast } from 'react-toastify';

export const useUpdateTodo = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (body: TodoDto) => {
      const api = new TodosApi(apiConfig);
      const response = await api.todosControllerUpdate(
        body.id,
        body.title,
        body.description,
        undefined,
        body.status
      );
      return response.data;
    },
    onSuccess: () => {
      toast.success('Todo updated successfully.');
      queryClient.invalidateQueries({ queryKey: ['todos'] });
    },
    onError(error: AxiosError) {
      toast.error(error.message);
    }
  });
};
