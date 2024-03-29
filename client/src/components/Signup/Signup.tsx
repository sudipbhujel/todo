import { apiConfig } from '@/config';
import { AuthenticationApi } from '@openapi/api';
import { useMutation } from '@tanstack/react-query';
import { AxiosError } from 'axios';
import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';

export const Signup = () => {
  const [name, setName] = useState<string>('');
  const [email, setEmail] = useState<string>('');
  const [password, setPassword] = useState<string>('');

  const navigate = useNavigate();

  const { mutate } = useMutation(
    async () => {
      const api = new AuthenticationApi(apiConfig);
      const response = await api.authControllerRegister({
        name,
        email,
        password
      });
      return response.data;
    },
    {
      onSuccess: () => {
        toast.success('User registered successfully.');
        navigate('/login');
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
    <section className="">
      <div className="">
        <main className="flex items-center justify-center px-8 py-2 sm:px-12 lg:py-4 lg:px-16">
          <div className="max-w-xl px-4 py-4 shadow-sm lg:max-w-3xl">
            <form action="#" className="grid grid-cols-12 gap-6 mt-8">
              <div className="col-span-12">
                <label
                  htmlFor="name"
                  className="block text-sm font-medium text-gray-700"
                >
                  name
                </label>

                <input
                  type="text"
                  id="name"
                  name="name"
                  className="w-full p-2 mt-1 text-sm text-gray-700 bg-white border-gray-200 rounded-md shadow-sm"
                  onChange={(e) => setName(e.target.value)}
                />
              </div>

              <div className="col-span-12">
                <label
                  htmlFor="Email"
                  className="block text-sm font-medium text-gray-700"
                >
                  Email
                </label>

                <input
                  type="email"
                  id="Email"
                  name="email"
                  className="w-full p-2 mt-1 text-sm text-gray-700 bg-white border-gray-200 rounded-md shadow-sm"
                  onChange={(e) => setEmail(e.target.value)}
                />
              </div>

              <div className="col-span-12">
                <label
                  htmlFor="Password"
                  className="block text-sm font-medium text-gray-700"
                >
                  Password
                </label>

                <input
                  type="password"
                  id="Password"
                  name="password"
                  className="w-full p-2 mt-1 text-sm text-gray-700 bg-white border-gray-200 rounded-md shadow-sm"
                  onChange={(e) => setPassword(e.target.value)}
                />
              </div>

              <div className="col-span-12">
                <button
                  className="inline-block w-full px-12 py-2 text-sm font-medium text-white transition bg-blue-600 border border-blue-600 rounded-md shrink-0 hover:bg-transparent hover:text-blue-600 focus:outline-none focus:ring active:text-blue-500"
                  onClick={handleSubmit}
                >
                  Sign up
                </button>

                <p className="mt-4 text-sm text-gray-500 sm:mt-2">
                  Already have an account?
                  <Link to="/login" className="ml-2 text-gray-700 underline">
                    Login
                  </Link>
                  .
                </p>
              </div>
            </form>
          </div>
        </main>
      </div>
    </section>
  );
};
