import { apiConfig } from '@/config';
import { TodoDto, TodosApi } from '@openapi/api';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { AxiosError } from 'axios';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';

interface TodoBody extends Omit<TodoDto, 'file_url' | 'id'> {
  file: File | undefined;
}

export const useCreateTodo = (redirect = '/') => {
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (body: TodoBody) => {
      const api = new TodosApi(apiConfig);
      const response = await api.todosControllerCreate(
        body.title,
        body?.description,
        body?.file
      );
      return response.data;
    },
    onSuccess: () => {
      toast.success('Your task is created successfully.');
      queryClient.invalidateQueries(['todos']);
      navigate(redirect);
    },
    onError(error: AxiosError) {
      toast.error(error.message);
    }
  });
};
