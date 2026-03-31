import { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import api from '../utils/api';
import EventCard from '../components/EventCard';
import { Building, Users, Mail, ArrowLeft, Calendar } from 'lucide-react';

const ClubProfile = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [club, setClub] = useState(null);
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchClubData = async () => {
      try {
        const [clubRes, eventsRes] = await Promise.all([
          api.get(`/clubs/${id}`),
          api.get(`/events/club/${id}/events`)
        ]);
        setClub(clubRes.data);
        setEvents(eventsRes.data);
      } catch (error) {
        console.error('Error fetching club profile:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchClubData();
  }, [id]);

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-[60vh]">
        <div className="h-10 w-10 rounded-full border-4 border-primary-100 border-t-primary-600 animate-spin"></div>
      </div>
    );
  }

  if (!club) {
    return (
      <div className="text-center py-20 flex flex-col items-center">
        <h2 className="text-2xl font-bold text-slate-900 dark:text-white">Club not found</h2>
        <button onClick={() => navigate(-1)} className="mt-6 text-white font-bold bg-primary-600 hover:bg-primary-700 px-6 py-3 rounded-xl shadow-md transition-colors">
          Go back
        </button>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-900">
      {/* Header / Banner */}
      <div className="bg-gradient-to-br from-primary-900 via-slate-900 to-indigo-950 pt-20 pb-32 px-4 relative overflow-hidden">
        {/* Glow Effects */}
        <div className="absolute top-0 right-0 w-64 h-64 bg-primary-500/20 rounded-full blur-3xl -mr-20 -mt-20"></div>
        <div className="absolute bottom-0 left-0 w-64 h-64 bg-indigo-500/20 rounded-full blur-3xl -ml-20 -mb-20"></div>
        
        <div className="max-w-7xl mx-auto relative z-10 flex flex-col md:flex-row items-center gap-8">
          <button 
            onClick={() => navigate(-1)} 
            className="absolute top-0 left-0 -mt-12 flex items-center text-slate-300 hover:text-white transition-colors text-sm font-semibold bg-white/5 px-4 py-2 border border-white/10 rounded-full backdrop-blur-md"
          >
            <ArrowLeft className="w-4 h-4 mr-2" /> Back
          </button>
          
          <div className="w-32 h-32 md:w-40 md:h-40 shrink-0 rounded-3xl bg-white border-4 border-white/10 shadow-2xl overflow-hidden flex items-center justify-center">
            {club.logo ? (
              <img src={club.logo} alt={club.name} className="w-full h-full object-cover" />
            ) : (
              <Users className="w-16 h-16 text-primary-500" />
            )}
          </div>
          
          <div className="text-center md:text-left flex-grow">
            <h1 className="text-4xl md:text-5xl font-black text-white mb-4 tracking-tight drop-shadow-sm">
              {club.name}
            </h1>
            <div className="flex flex-wrap items-center justify-center md:justify-start gap-3 mt-4 text-slate-300 font-medium text-sm">
              <span className="flex items-center bg-white/10 px-4 py-2 rounded-xl border border-white/10 backdrop-blur-sm shadow-sm">
                <Building className="w-4 h-4 mr-2 text-primary-400" />
                {club.college}
              </span>
              <span className="flex items-center bg-white/10 px-4 py-2 rounded-xl border border-white/10 backdrop-blur-sm shadow-sm">
                <Users className="w-4 h-4 mr-2 text-indigo-400" />
                {club.followersCount} Followers
              </span>
              <span className="flex items-center bg-white/10 px-4 py-2 rounded-xl border border-white/10 backdrop-blur-sm shadow-sm">
                <Mail className="w-4 h-4 mr-2 text-sky-400" />
                {club.contactEmail}
              </span>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 -mt-16 relative z-20 pb-24">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          
          {/* Left Column: About Section */}
          <div className="lg:col-span-1">
            <div className="bg-white dark:bg-slate-800 rounded-3xl p-8 shadow-xl shadow-slate-200/50 dark:shadow-none border border-slate-100 dark:border-slate-700 lg:sticky lg:top-24">
              <h2 className="text-xl font-bold text-slate-900 dark:text-white mb-4 flex items-center">
                About the Club
              </h2>
              <div className="w-12 h-1 bg-gradient-to-r from-primary-500 to-indigo-500 rounded-full mb-6"></div>
              <p className="text-slate-600 dark:text-slate-300 leading-relaxed font-medium mb-6 line-clamp-6">
                {club.description}
              </p>
              <Link to={`/clubs/${club._id}/about`} className="text-primary-600 font-bold hover:text-primary-700 flex items-center text-sm group">
                Read full about us & see media
                <ArrowLeft className="w-4 h-4 ml-1 rotate-180 transform group-hover:translate-x-1 transition-transform" />
              </Link>
            </div>
          </div>

          {/* Right Column: Events */}
          <div className="lg:col-span-2">
            <div className="bg-white dark:bg-slate-800 rounded-3xl p-8 shadow-xl shadow-slate-200/50 dark:shadow-none border border-slate-100 dark:border-slate-700 min-h-full">
              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-8 pb-6 border-b border-slate-100 dark:border-slate-700 gap-4">
                <div>
                  <h2 className="text-2xl font-black text-slate-900 dark:text-white flex items-center gap-3">
                    <Calendar className="text-primary-600 dark:text-primary-400 rounded-xl bg-primary-50 dark:bg-primary-900/30 p-2 w-10 h-10 shadow-sm" />
                    Club Events
                  </h2>
                  <p className="text-slate-500 dark:text-slate-400 text-sm font-semibold mt-1">Discover what {club.name} is planning next</p>
                </div>
                <div className="bg-slate-100 dark:bg-slate-700 text-slate-800 dark:text-slate-200 font-bold px-4 py-2 rounded-xl text-sm border border-slate-200 dark:border-slate-600">
                  {events.length} Upcoming
                </div>
              </div>

              {events.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {events.map((event) => (
                    <EventCard key={event._id} event={event} />
                  ))}
                </div>
              ) : (
                <div className="text-center py-20 bg-slate-50/50 dark:bg-slate-800/50 rounded-2xl border border-dashed border-slate-300 dark:border-slate-600">
                  <Calendar className="w-12 h-12 text-slate-300 dark:text-slate-600 mx-auto mb-4" />
                  <h3 className="text-lg font-bold text-slate-700 dark:text-slate-300">No events deployed</h3>
                  <p className="text-slate-500 dark:text-slate-400 mt-2 font-medium">This club hasn't launched any events yet.</p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ClubProfile;
