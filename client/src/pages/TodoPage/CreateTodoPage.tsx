import { useState } from 'react';
import { Layout } from '@components/Layout/Layout';
import { useCreateTodo } from '@/hooks/useCreateTodo';
import { Link } from 'react-router-dom';

export const CreateTodoPage = () => {
  const [title, setTitle] = useState<string>('');
  const [description, setDescription] = useState<string>('');
  const [file, setFile] = useState<File | undefined>(undefined);

  const { mutate } = useCreateTodo();

  const handleSubmit = (e: React.MouseEvent<HTMLElement>) => {
    e.preventDefault();
    mutate({ title, description, file });
  };

  return (
    <Layout>
      <div className="flex items-center justify-between">
        <h1 className="mb-4 text-3xl font-bold">Create Todo</h1>
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
          onChange={(e) => setTitle(e.target.value)}
          required
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
          onChange={(e) => setFile(e?.target?.files?.[0])}
        />

        <button
          className="inline-block px-12 py-2 mt-4 text-sm font-medium text-white transition bg-blue-600 border border-blue-600 rounded-md shrink-0 hover:bg-transparent hover:text-blue-600 focus:outline-none focus:ring active:text-blue-500"
          onClick={handleSubmit}
        >
          Add Todo
        </button>
      </form>
    </Layout>
  );
};
