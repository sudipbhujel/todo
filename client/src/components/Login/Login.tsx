import { AuthenticationApi } from '@openapi/api';
import { useMutation } from '@tanstack/react-query';
import { AxiosError } from 'axios';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';

export const Login = () => {
  const [email, setEmail] = useState<string>('');
  const [password, setPassword] = useState<string>('');

  const navigate = useNavigate();

  const { mutate } = useMutation(
    async () => {
      const api = new AuthenticationApi();
      const response = await api.authControllerLogin({ email, password });
      return response.data;
    },
    {
      onSuccess: (data) => {
        localStorage.setItem('accessToken', data?.access_token);
        toast.success('You are logged in successfully.');
        navigate('/');
        navigate(0);
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
            <form className="grid grid-cols-12 gap-6 mt-8">
              {/* <div className="col-span-6 sm:col-span-3">
                <label
                  htmlFor="FirstName"
                  className="block text-sm font-medium text-gray-700"
                >
                  First Name
                </label>

                <input
                  type="text"
                  id="FirstName"
                  name="first_name"
                  className="w-full mt-1 text-sm text-gray-700 bg-white border-gray-200 rounded-md shadow-sm"
                />
              </div>

              <div className="col-span-6 sm:col-span-3">
                <label
                  htmlFor="LastName"
                  className="block text-sm font-medium text-gray-700"
                >
                  Last Name
                </label>

                <input
                  type="text"
                  id="LastName"
                  name="last_name"
                  className="w-full mt-1 text-sm text-gray-700 bg-white border-gray-200 rounded-md shadow-sm"
                />
              </div> */}

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
                  className="w-full p-2 mt-1 text-sm text-gray-700 bg-white border-gray-200 rounded-md shadow-sm shadow-slate-300"
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
                  className="w-full p-2 mt-1 text-sm text-gray-700 bg-white border-gray-200 rounded-md shadow-sm shadow-slate-300"
                  onChange={(e) => setPassword(e.target.value)}
                />
              </div>

              <div className="col-span-12">
                <button
                  className="inline-block w-full px-12 py-2 text-sm font-medium text-white transition bg-blue-600 border border-blue-600 rounded-md shrink-0 hover:bg-transparent hover:text-blue-600 focus:outline-none focus:ring active:text-blue-500"
                  onClick={handleSubmit}
                >
                  Login
                </button>

                <p className="mt-4 text-sm text-gray-500 sm:mt-2">
                  Don{"'"}t have an account?
                  <a href="/signup" className="ml-2 text-gray-700 underline">
                    Sign up
                  </a>
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
