import { useAuth } from '@/hooks/useAuth';
import { useDeleteTodo } from '@/hooks/useDeleteTodo';
import { useUpdateTodo } from '@/hooks/useUpdateTodo';

import { useState } from 'react';
import { Loader } from '@components/Loader';
import { useGetTodos } from '@/hooks/useGetTodos';
import { Link } from 'react-router-dom';

export const Todo = () => {
  const [statusState, setStatusState] = useState<string | undefined>(undefined);

  const { data: user, isLoading: authLoading } = useAuth();

  const { data: todos, isLoading: todosLoading } = useGetTodos(statusState);

  const { mutate: mutateDelete, isLoading: deleteLoading } = useDeleteTodo();

  const { mutate: mutateTodo } = useUpdateTodo();

  if (authLoading || todosLoading || deleteLoading) return <Loader />;

  const handleStatusChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const value = e.target.value === 'all' ? undefined : e.target.value;
    setStatusState(value);
  };

  return (
    <div>
      {user && (
        <>
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center gap-4">
              <h1 className="text-3xl font-bold">Todo</h1>
              <select
                className="block w-full p-2 text-sm text-gray-900 border border-gray-300 rounded-lg bg-gray-50 focus:ring-blue-500 focus:border-blue-500"
                value={statusState}
                onChange={handleStatusChange}
              >
                <option value="all">All todos</option>
                <option value="not started">Not Started</option>
                <option value="completed">Completed</option>
              </select>
            </div>
            <Link
              to="/todos/new"
              className="px-5 py-2 text-sm font-medium text-blue-600 rounded-lg"
            >
              Create Todo
            </Link>
          </div>
          <ul className="">
            {todos?.map((todo, index: number) => (
              <li
                key={index}
                className="flex items-center justify-between p-2 my-1 border-2 rounded border-slate-50 text-slate-600"
              >
                <div className="flex items-center gap-2">
                  <input
                    id="link-checkbox"
                    type="checkbox"
                    value={todo.id}
                    className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded cursor-pointer focus:ring-blue-50"
                    defaultChecked={todo?.status == 'completed' ? true : false}
                    disabled={todo?.status == 'completed' ? true : false}
                    onChange={() =>
                      mutateTodo({
                        id: todo.id,
                        title: todo.title,
                        status: 'completed'
                      })
                    }
                  />

                  <Link
                    className="text-blue-600 underline cursor-pointer hover:text-blue-900"
                    to={`/todos/${todo.id}`}
                  >
                    {todo?.title}
                  </Link>
                </div>
                <div className="flex items-center gap-2">
                  {todo?.status !== 'completed' && (
                    <Link
                      className="inline-block px-2 py-2 text-sm font-medium text-white transition bg-blue-600 rounded hover:scale-110 hover:shadow-xl focus:outline-none focus:ring active:bg-blue-500 hover:cursor-pointer"
                      to={`/todos/edit/${todo.id}`}
                    >
                      Edit
                    </Link>
                  )}
                  <button
                    className="inline-block px-2 py-2 text-sm font-medium text-white transition bg-red-600 rounded hover:scale-110 hover:shadow-xl focus:outline-none focus:ring active:bg-red-500 hover:cursor-pointer"
                    onClick={() => mutateDelete(todo.id)}
                  >
                    Delete
                  </button>
                </div>
              </li>
            ))}
            {!todos?.length && (
              <div className="flex justify-center text-slate-500">
                No items available.
              </div>
            )}
          </ul>
        </>
      )}
      {!user && (
        <div className="flex items-center justify-center text-xl font-bold text-gray-500">
          <h1>Please Login or Signup to manage todo list.</h1>
        </div>
      )}
    </div>
  );
};
