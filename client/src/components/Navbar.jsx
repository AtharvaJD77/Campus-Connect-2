import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { User, ShieldCheck, Film } from 'lucide-react';

const Navbar = () => {
  const { user } = useAuth();

  return (
    <nav className="bg-white/80 dark:bg-gray-900/90 backdrop-blur-md border-b border-gray-200 dark:border-gray-800 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex items-center">
            <Link to="/" className="flex flex-shrink-0 items-center gap-2">
              <img src="/logo.png" alt="Campus Connect Logo" className="h-10 w-10 object-contain" />
              <span className="font-bold text-xl tracking-tight text-gray-900 dark:text-white">Campus Connect</span>
            </Link>
            <div className="hidden md:flex ml-8 items-center space-x-6">
              <Link to="/reels" className="flex items-center gap-1.5 text-gray-600 dark:text-gray-300 hover:text-pink-500 dark:hover:text-pink-400 font-semibold text-sm transition-colors">
                <Film className="h-4 w-4" />
                Reels
              </Link>
            </div>
          </div>

          <div className="flex items-center space-x-4">
            {user ? (
              <>
                {(user.role === 'SystemAdmin' || user.role === 'Admin') && (
                  <Link
                    to="/admin"
                    className="flex items-center gap-1.5 text-sm font-semibold text-purple-600 dark:text-purple-400 hover:text-purple-700 dark:hover:text-purple-300 bg-purple-50 dark:bg-purple-900/30 hover:bg-purple-100 dark:hover:bg-purple-900/50 px-3 py-1.5 rounded-lg transition-colors"
                  >
                    <ShieldCheck className="h-4 w-4" />
                    Admin Panel
                  </Link>
                )}
                {user.role !== 'SystemAdmin' && user.role !== 'Admin' && (
                  <Link to="/dashboard" className="text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white font-medium text-sm transition-colors">
                    Dashboard
                  </Link>
                )}
                <div className="flex items-center gap-3 ml-4">
                  <div className="flex flex-col items-end">
                    <span className="text-sm font-semibold text-gray-900 dark:text-white">{user.name}</span>
                    <span className="text-xs text-gray-500 dark:text-gray-400">{user.role}</span>
                  </div>
                </div>
              </>
            ) : (
              <>
                <Link to="/login" className="text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white font-medium text-sm transition-colors">
                  Sign in
                </Link>
                <Link
                  to="/register"
                  className="bg-primary-600 hover:bg-primary-700 text-white px-4 py-2 rounded-lg text-sm font-medium transition-all shadow-sm hover:shadow-md"
                >
                  Sign up
                </Link>
              </>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
