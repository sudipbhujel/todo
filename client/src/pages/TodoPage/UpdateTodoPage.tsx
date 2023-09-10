import { AxiosError } from 'axios';
import { useEffect, useState } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { toast } from 'react-toastify';

import { apiConfig } from '@/config';
import { Layout } from '@components/Layout/Layout';
import { TodosApi } from '@openapi/api';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';

export const UpdateTodoPage = () => {
  const queryClient = useQueryClient();
  const navigate = useNavigate();
  const { id: paramId } = useParams();

  if (!paramId) {
    navigate('/');
    return <></>;
  }

  const { data } = useQuery(
    ['todos', paramId],
    async () => {
      const api = new TodosApi(apiConfig);

      const response = await api.todosControllerFindOne(parseInt(paramId));
      return response.data;
    },
    {
      retry: 1
    }
  );

  const [id, setId] = useState<number>(parseInt(paramId));
  const [title, setTitle] = useState<string>('');
  const [description, setDescription] = useState<string>('');
  const [file, setFile] = useState<File | undefined>(undefined);

  useEffect(() => {
    setId(parseInt(paramId));
    setTitle(data?.title ?? '');
    setDescription(data?.description ?? '');
  }, [data]);

  const { mutate } = useMutation(
    async () => {
      const api = new TodosApi(apiConfig);
      const response = await api.todosControllerUpdate(
        id,
        title,
        description,
        file
      );
      return response.data;
    },
    {
      onSuccess: () => {
        toast.success('Your todo is updated successfully.');
        queryClient.invalidateQueries({ queryKey: ['todos', paramId] });
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
    <Layout>
      <div className="flex items-center justify-between">
        <h1 className="mb-4 text-3xl font-bold">Update Todo</h1>
        <Link
          to="/"
          className="px-5 py-2 text-sm font-medium text-gray-600 bg-gray-100 rounded-lg"
        >
          Back
        </Link>
      </div>
      {/* <pre>{JSON.stringify(data?.data)}</pre> */}

      <form>
        <label
          htmlFor="Title"
          className="block text-sm font-medium text-gray-700"
        >
          Title
        </label>
        <input
          type="text"
          id="Title"
          name="title"
          className="w-full p-2 mt-1 text-sm text-gray-700 bg-white border-gray-200 rounded-md shadow-sm shadow-slate-300"
          defaultValue={data?.title}
          onChange={(e) => setTitle(e.target.value)}
        />

        <label
          htmlFor="Description"
          className="block mt-4 text-sm font-medium text-gray-700"
        >
          Description
        </label>
        <textarea
          // type="text"
          id="Description"
          name="description"
          className="w-full p-2 mt-1 text-sm text-gray-700 bg-white border-gray-200 rounded-md shadow-sm shadow-slate-300"
          defaultValue={data?.description}
          onChange={(e) => setDescription(e.target.value)}
        />

        <label
          className="block mt-4 text-sm font-medium text-gray-900"
          htmlFor="file_input"
        >
          Upload file
        </label>
        <input
          className="block w-full p-2 mt-1 text-sm text-gray-900 border border-gray-300 rounded-lg cursor-pointer bg-gray-50"
          id="file_input"
          type="file"
          onChange={(e) => setFile(e?.target?.files?.[0] ?? undefined)}
        />
        <div>
          <img
            src={`http://localhost:4000/${data?.file_url}`}
            alt={data?.title}
          />
        </div>

        <button
          className="inline-block px-12 py-2 mt-4 text-sm font-medium text-white transition bg-blue-600 border border-blue-600 rounded-md shrink-0 hover:bg-transparent hover:text-blue-600 focus:outline-none focus:ring active:text-blue-500"
          onClick={handleSubmit}
        >
          Update
        </button>
      </form>
    </Layout>
  );
};
