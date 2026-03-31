import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Calendar, Users, Zap, Terminal, Code2, Rocket } from 'lucide-react';

const Home = () => {
  const { user } = useAuth();

  return (
    <div className="bg-slate-900 min-h-screen text-slate-50 selection:bg-primary-500/30">
      {/* Hero Section */}
      <div className="relative isolate pt-24 pb-32 overflow-hidden">
        {/* Glowing background effects */}
        <div className="absolute inset-x-0 -top-40 -z-10 transform-gpu overflow-hidden blur-3xl sm:-top-80" aria-hidden="true">
          <div className="relative left-[calc(50%-11rem)] aspect-[1155/678] w-[36.125rem] -translate-x-1/2 rotate-[30deg] bg-gradient-to-tr from-primary-600 to-indigo-500 opacity-20 sm:left-[calc(50%-30rem)] sm:w-[72.1875rem]"></div>
        </div>
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-primary-600/20 rounded-full blur-[120px] -z-10 mix-blend-screen pointer-events-none"></div>

        <div className="mx-auto max-w-7xl px-6 lg:px-8 relative z-10 mt-10">
          <div className="mx-auto max-w-3xl text-center">
            <div className="mb-8 flex justify-center">
              <span className="relative rounded-full px-4 py-1.5 text-sm leading-6 text-indigo-200 ring-1 ring-white/10 hover:ring-white/20 transition-all bg-white/5 backdrop-blur-md font-medium shadow-lg shadow-primary-500/10">
                Building the future of campus connectivity.{' '}
                <a href="#features" className="font-bold text-primary-400 hover:text-primary-300 ml-1"><span className="absolute inset-0" aria-hidden="true"></span>Explore features <span aria-hidden="true">&rarr;</span></a>
              </span>
            </div>
            <h1 className="text-5xl font-black tracking-tight text-white sm:text-7xl mb-8 leading-[1.1]">
              The Operating System for <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary-400 to-indigo-400 filter drop-shadow-sm">Engineering Campuses</span>
            </h1>
            <p className="mt-6 text-xl leading-8 text-slate-300 mb-12 max-w-2xl mx-auto font-medium">
              A high-performance hub to discover hackathons, manage tech clubs, and never miss an important workshop again. Engineered for speed and built for students.
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              {user ? (
                <Link
                  to={['SystemAdmin', 'Admin'].includes(user.role) ? '/admin' : '/dashboard'}
                  className="w-full sm:w-auto rounded-xl bg-gradient-to-r from-primary-600 to-indigo-600 px-8 py-4 text-base font-bold text-white shadow-lg shadow-primary-500/25 hover:shadow-primary-500/40 focus-visible:outline transition-all transform hover:-translate-y-1 text-center"
                >
                  Access Dashboard
                </Link>
              ) : (
                <>
                  <Link
                    to="/register"
                    className="w-full sm:w-auto rounded-xl bg-gradient-to-r from-primary-600 to-indigo-600 px-8 py-4 text-base font-bold text-white shadow-lg shadow-primary-500/25 hover:shadow-primary-500/40 focus-visible:outline transition-all transform hover:-translate-y-1 text-center"
                  >
                    Sign Up
                  </Link>
                  <Link to="/login" className="w-full sm:w-auto text-base font-bold leading-6 text-white px-8 py-4 rounded-xl hover:bg-white/5 border border-white/10 backdrop-blur-sm transition-all text-center">
                    Sign In <span aria-hidden="true">→</span>
                  </Link>
                </>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Feature Section */}
      <div id="features" className="py-24 sm:py-32 relative z-10 border-t border-white/5 bg-slate-900/50 backdrop-blur-3xl">
        <div className="mx-auto max-w-7xl px-6 lg:px-8">
          <div className="mx-auto max-w-2xl lg:text-center mb-20">
            <h2 className="text-sm font-black leading-7 text-primary-400 uppercase tracking-[0.2em]">System Capabilities</h2>
            <p className="mt-2 text-4xl font-black tracking-tight text-white sm:text-5xl">
              Constructed for Developers & Clubs
            </p>
          </div>
          <div className="mx-auto max-w-5xl grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-3">
            <div className="flex flex-col p-8 bg-slate-800/50 backdrop-blur-xl rounded-2xl border border-white/10 hover:border-primary-500/50 hover:bg-slate-800/80 transition-all hover:-translate-y-1 hover:shadow-2xl hover:shadow-primary-500/10 group">
              <div className="h-14 w-14 rounded-2xl bg-primary-500/10 flex items-center justify-center mb-6 border border-primary-500/20 group-hover:scale-110 transition-transform">
                <Terminal className="h-7 w-7 text-primary-400 drop-shadow-[0_0_8px_rgba(59,130,246,0.5)]" />
              </div>
              <h3 className="text-xl font-bold text-white mb-3">Discover Hackathons</h3>
              <p className="text-slate-400 text-sm leading-relaxed font-medium">Browse a dynamically updated calendar of all technical events, coding competitions, and fests happening in your college ecosystem.</p>
            </div>
            
            <div className="flex flex-col p-8 bg-slate-800/50 backdrop-blur-xl rounded-2xl border border-white/10 hover:border-indigo-500/50 hover:bg-slate-800/80 transition-all hover:-translate-y-1 hover:shadow-2xl hover:shadow-indigo-500/10 group relative overflow-hidden">
               <div className="absolute top-0 right-0 w-32 h-32 bg-indigo-500/10 rounded-full blur-2xl -mr-16 -mt-16 pointer-events-none"></div>
              <div className="h-14 w-14 rounded-2xl bg-indigo-500/10 flex items-center justify-center mb-6 border border-indigo-500/20 group-hover:scale-110 transition-transform relative z-10">
                <Code2 className="h-7 w-7 text-indigo-400 drop-shadow-[0_0_8px_rgba(99,102,241,0.5)]" />
              </div>
              <h3 className="text-xl font-bold text-white mb-3 relative z-10">Follow Tech Clubs</h3>
              <p className="text-slate-400 text-sm leading-relaxed font-medium relative z-10">Create personal profiles and strictly follow your preferred technical societies to get customized feeds and instant alerts.</p>
            </div>
            
            <div className="flex flex-col p-8 bg-slate-800/50 backdrop-blur-xl rounded-2xl border border-white/10 hover:border-sky-500/50 hover:bg-slate-800/80 transition-all hover:-translate-y-1 hover:shadow-2xl hover:shadow-sky-500/10 group sm:col-span-2 lg:col-span-1">
              <div className="h-14 w-14 rounded-2xl bg-sky-500/10 flex items-center justify-center mb-6 border border-sky-500/20 group-hover:scale-110 transition-transform">
                <Rocket className="h-7 w-7 text-sky-400 drop-shadow-[0_0_8px_rgba(14,165,233,0.5)]" />
              </div>
              <h3 className="text-xl font-bold text-white mb-3">Deploy Events</h3>
              <p className="text-slate-400 text-sm leading-relaxed font-medium">As a club admin, rapidly deploy new events, process registrations, and effortlessly monitor attendance metrics efficiently.</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Home;
