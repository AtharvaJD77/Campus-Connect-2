import { X, Moon, Sun, User, Mail, Shield, LogOut } from 'lucide-react';
import { useTheme } from '../context/ThemeContext';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';

const SettingsModal = ({ onClose }) => {
  const { theme, toggleTheme } = useTheme();
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/');
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4" onClick={onClose}>
      <div
        className="bg-white dark:bg-slate-800 rounded-2xl shadow-2xl w-full max-w-md"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between p-5 border-b border-gray-100 dark:border-slate-700">
          <h2 className="text-xl font-bold text-gray-900 dark:text-white">Account Settings</h2>
          <button onClick={onClose} className="p-2 hover:bg-gray-100 dark:hover:bg-slate-700 rounded-full transition-colors text-gray-400 hover:text-gray-600 dark:hover:text-slate-300">
            <X className="h-5 w-5" />
          </button>
        </div>

        <div className="p-6 space-y-6">
          {/* Profile Section */}
          <div>
            <h3 className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-4">Profile Information</h3>
            <div className="space-y-4">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-blue-50 dark:bg-slate-700 rounded-lg">
                  <User className="h-5 w-5 text-blue-600 dark:text-blue-400" />
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-500 dark:text-gray-400">Full Name</p>
                  <p className="text-base font-semibold text-gray-900 dark:text-white">{user.name}</p>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <div className="p-2 bg-blue-50 dark:bg-slate-700 rounded-lg">
                  <Mail className="h-5 w-5 text-blue-600 dark:text-blue-400" />
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-500 dark:text-gray-400">Email Address</p>
                  <p className="text-base font-semibold text-gray-900 dark:text-white">{user.email}</p>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <div className="p-2 bg-blue-50 dark:bg-slate-700 rounded-lg">
                  <Shield className="h-5 w-5 text-blue-600 dark:text-blue-400" />
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-500 dark:text-gray-400">Account Role</p>
                  <p className="text-base font-semibold text-gray-900 dark:text-white">{user.role}</p>
                </div>
              </div>
            </div>
          </div>

          <hr className="border-gray-100 dark:border-slate-700" />

          {/* Preferences Section */}
          <div>
            <h3 className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-4">Preferences</h3>
            
            <div className="flex items-center justify-between p-4 bg-gray-50 dark:bg-slate-700/50 rounded-xl">
              <div>
                <p className="font-semibold text-gray-900 dark:text-white">Appearance</p>
                <p className="text-sm text-gray-500 dark:text-gray-400">Toggle dark mode theme</p>
              </div>
              <button
                onClick={toggleTheme}
                className="flex items-center gap-2 px-4 py-2 bg-white dark:bg-slate-600 border border-gray-200 dark:border-slate-500 rounded-lg shadow-sm hover:bg-gray-50 dark:hover:bg-slate-500 transition-colors text-sm font-medium dark:text-white"
              >
                {theme === 'dark' ? (
                  <>
                    <Sun className="h-4 w-4 text-amber-500" />
                    Light Mode
                  </>
                ) : (
                  <>
                    <Moon className="h-4 w-4 text-indigo-500" />
                    Dark Mode
                  </>
                )}
              </button>
            </div>
          </div>

          <hr className="border-gray-100 dark:border-slate-700" />
          
          <button
            onClick={handleLogout}
            className="w-full flex items-center justify-center gap-2 py-3 bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400 hover:bg-red-100 dark:hover:bg-red-900/40 rounded-xl font-semibold transition-colors"
          >
            <LogOut className="h-5 w-5" />
            Sign Out
          </button>
        </div>
      </div>
    </div>
  );
};

export default SettingsModal;
