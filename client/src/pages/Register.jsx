import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const Register = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState('Student');
  const [error, setError] = useState('');
  const { register } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await register(name, email, password, role);
      navigate('/dashboard');
    } catch (err) {
      setError(err.response?.data?.message || 'Registration failed');
    }
  };

  return (
    <div className="flex min-h-[calc(100vh-4rem)] bg-white dark:bg-gray-900">
      {/* Right side - Abstract Tech Art (Flipped for variety) */}
      <div className="hidden lg:flex lg:w-1/2 relative overflow-hidden bg-gradient-to-br from-slate-900 via-indigo-900 to-purple-900 items-center justify-center order-2">
        {/* Decorative elements */}
        <div className="absolute top-0 left-0 w-full h-full opacity-10 bg-[url('data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSI0MCIgaGVpZ2h0PSI0MCI+PGNpcmNsZSBjeD0iMiIgY3k9IjIiIHI9IjEiIGZpbGw9IiNmZmYiLz48L3N2Zz4=')]"></div>
        <div className="absolute top-0 right-0 w-96 h-96 bg-primary-500 rounded-full mix-blend-multiply filter blur-[128px] opacity-50"></div>
        <div className="absolute bottom-0 left-1/4 w-80 h-80 bg-purple-500 rounded-full mix-blend-multiply filter blur-[128px] opacity-50"></div>
        <div className="absolute top-1/3 left-0 w-72 h-72 bg-sky-500 rounded-full mix-blend-multiply filter blur-[128px] opacity-40"></div>
        
        <div className="relative z-10 px-12 text-center max-w-lg">
          <div className="inline-flex items-center justify-center h-20 w-20 rounded-3xl bg-white/10 backdrop-blur-xl border border-white/20 mb-8 shadow-2xl">
            <svg className="w-10 h-10 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4"></path>
            </svg>
          </div>
          <h1 className="text-5xl font-extrabold tracking-tight text-white mb-6 leading-tight">Start Building Your Network</h1>
          <p className="text-lg text-indigo-100 font-medium leading-relaxed">
            Create an account today to discover thousands of campus events, join technical societies, and accelerate your engineering journey.
          </p>
        </div>
      </div>

      {/* Left side - Form */}
      <div className="flex-1 flex items-center justify-center p-8 sm:p-12 lg:p-24 bg-gray-50/50 dark:bg-gray-900/50 order-1">
        <div className="w-full max-w-md">
          <div className="mb-10 text-center lg:text-left">
            <h2 className="text-4xl font-extrabold text-gray-900 dark:text-white tracking-tight">Create an account</h2>
            <p className="text-gray-500 dark:text-gray-400 mt-3 text-base font-medium">Join the Campus Connect ecosystem today.</p>
          </div>

          {error && (
            <div className="bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400 p-4 rounded-xl text-sm mb-8 border border-red-100 dark:border-red-900/50 flex items-center gap-3 font-semibold shadow-sm">
              <svg className="w-5 h-5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label className="block text-sm font-bold text-gray-700 dark:text-gray-300 mb-2">Full Name</label>
              <input
                type="text"
                className="w-full border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 rounded-xl shadow-sm px-5 py-3.5 border focus:ring-2 focus:ring-primary-500 focus:border-primary-500 transition-all font-medium text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-gray-500"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
                placeholder="John Doe"
              />
            </div>
            <div>
              <label className="block text-sm font-bold text-gray-700 dark:text-gray-300 mb-2">University Email</label>
              <input
                type="email"
                className="w-full border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 rounded-xl shadow-sm px-5 py-3.5 border focus:ring-2 focus:ring-primary-500 focus:border-primary-500 transition-all font-medium text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-gray-500"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                placeholder="student@university.edu"
              />
            </div>
            <div>
              <label className="block text-sm font-bold text-gray-700 dark:text-gray-300 mb-2">Password</label>
              <input
                type="password"
                className="w-full border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 rounded-xl shadow-sm px-5 py-3.5 border focus:ring-2 focus:ring-primary-500 focus:border-primary-500 transition-all font-medium text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-gray-500"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                placeholder="••••••••"
                minLength="6"
              />
            </div>
            <div>
              <label className="block text-sm font-bold text-gray-700 dark:text-gray-300 mb-2">Primary Role</label>
              <div className="relative">
                <select
                  className="w-full border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 rounded-xl shadow-sm px-5 py-3.5 border focus:ring-2 focus:ring-primary-500 focus:border-primary-500 transition-all font-bold text-gray-900 dark:text-white appearance-none pr-10"
                  value={role}
                  onChange={(e) => setRole(e.target.value)}
                >
                  <option value="Student">Student (Discover & go to events)</option>
                  <option value="ClubAdmin">Club Organizer (Create & manage events)</option>
                </select>
                <div className="absolute inset-y-0 right-0 flex items-center px-4 pointer-events-none text-gray-500">
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"></path></svg>
                </div>
              </div>
            </div>
            <button
              type="submit"
              className="w-full bg-gradient-to-r from-primary-600 to-indigo-600 hover:from-primary-700 hover:to-indigo-700 text-white font-bold py-3.5 rounded-xl shadow-lg shadow-primary-500/30 hover:shadow-primary-500/50 transition-all transform hover:-translate-y-0.5 mt-2"
            >
              Initialize Account
            </button>
          </form>

          <p className="mt-10 text-center font-medium text-gray-600 dark:text-gray-400">
            Already deeply connected?{' '}
            <Link to="/login" className="font-bold text-primary-600 hover:text-primary-700 dark:text-primary-400 dark:hover:text-primary-300 underline decoration-primary-300 dark:decoration-primary-600 underline-offset-2 hover:decoration-primary-600 dark:hover:decoration-primary-400 transition-all">
              Sign in
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Register;
