import { Layout } from '@components/Layout/Layout';
import { useNavigate, useParams } from 'react-router-dom';
import { useGetOneTodo } from '@/hooks/useGetOneTodo';

export const TodoDetailPage = () => {
  const { id } = useParams();

  const navigate = useNavigate();

  if (!id) {
    navigate('/');
    return <></>;
  }

  const { data } = useGetOneTodo(parseInt(id));

  return (
    <Layout>
      <div className="flex items-center justify-between mb-2">
        <div className="flex items-center gap-4">
          <h1 className="text-3xl font-bold">Todo #{data?.id}</h1>
        </div>
        {data?.status !== 'completed' && (
          <a
            href={`/todos/edit/${data?.id}`}
            className="px-5 py-2 text-sm font-medium text-blue-600 rounded-lg"
          >
            Edit Todo
          </a>
        )}
      </div>
      <div className="grid grid-cols-2 gap-2 ">
        <div>
          <p className="text-xl font-bold">Title</p>
          <h1 className="py-2 text-md ">{data?.title}</h1>
          <p className="mt-4 text-xl font-bold">Description</p>
          <p className="py-2">{data?.description}</p>
          <p className="mt-4 text-xl font-bold">Status</p>
          <p className="py-2">{data?.status}</p>
        </div>
        <div>
          <img
            src={`http://localhost:4000/${data?.file_url}`}
            alt={data?.title}
          />
        </div>
      </div>
    </Layout>
  );
};
