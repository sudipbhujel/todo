import { Route, Routes } from 'react-router-dom';

import { useAuth } from '@/hooks/useAuth';
import { HomePage } from '@pages/HomePage';
import { LoginPage } from '@pages/LoginPage/LoginPage';
import { NotFoundPage } from '@pages/NotFoundPage';
import { SignupPage } from '@pages/SignupPage';
import { CreateTodoPage } from '@pages/TodoPage';
import { TodoDetailPage } from '@pages/TodoPage/TodoDetailPage';
import { UpdateTodoPage } from '@pages/TodoPage/UpdateTodoPage';

export const Router = () => {
  const { data: user } = useAuth();
  return (
    <Routes>
      <Route index element={<HomePage />} />
      <Route path="/signup" element={<SignupPage />} />
      <Route path="/login" element={<LoginPage />} />
      {user && (
        <>
          <Route path="/todos/edit/:id" element={<UpdateTodoPage />} />
          <Route path="/todos/new" element={<CreateTodoPage />} />
          <Route path="/todos/:id" element={<TodoDetailPage />} />
        </>
      )}
      <Route path="*" element={<NotFoundPage />} />
    </Routes>
  );
};
