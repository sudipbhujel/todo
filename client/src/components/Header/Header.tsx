import logo from '@/assets/to-do-list-svgrepo-com.svg';
import { useAuth } from '@/hooks/useAuth';
import { LogoutButton } from '@components/Logout';
import { Link } from 'react-router-dom';

export const Header = () => {
  const { data: user, isLoading } = useAuth();

  if (isLoading) return null;

  return (
    <header className="p-2 shadow-sm">
      <nav aria-label="Site Nav" className="flex items-center justify-between">
        <Link
          to="/"
          className="inline-flex items-center justify-center w-10 h-10 bg-gray-100 rounded-lg"
        >
          <span className="sr-only">Todo</span>
          <img src={logo} className="" alt="Logo" />
        </Link>

        <div className="flex items-center gap-2 text-sm font-medium text-gray-500">
          <div className="items-center gap-4 lg:flex">
            {/* Not Authenticated */}
            {!user && (
              <>
                <Link
                  to="/login"
                  className="px-5 py-2 text-sm font-medium text-gray-600 bg-gray-100 rounded-lg"
                >
                  Log in
                </Link>

                <Link
                  to="/signup"
                  className="px-5 py-2 text-sm font-medium text-white bg-blue-600 rounded-lg"
                >
                  Sign up
                </Link>
              </>
            )}
            {/* Authenticated */}
            {user && (
              <>
                <p>{user.email}</p>
                <LogoutButton />
              </>
            )}
          </div>
        </div>
      </nav>
    </header>
  );
};
