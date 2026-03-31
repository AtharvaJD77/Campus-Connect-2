import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import api from '../utils/api';
import { Calendar, Clock, MapPin, Users, ExternalLink, ArrowLeft, Building } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import FeedbackModal from '../components/FeedbackModal';

const EventDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();

  const [event, setEvent] = useState(null);
  const [loading, setLoading] = useState(true);
  const [registered, setRegistered] = useState(false);
  const [regLoading, setRegLoading] = useState(false);
  const [message, setMessage] = useState('');
  const [showFeedbackModal, setShowFeedbackModal] = useState(false);

  useEffect(() => {
    const fetchEventData = async () => {
      try {
        const res = await api.get(`/events/${id}`);
        setEvent(res.data);

        if (user?.role === 'Student') {
          const regRes = await api.get('/registrations/my-events');
          const isRegistered = regRes.data.some(e => e._id === id);
          setRegistered(isRegistered);
        }
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchEventData();
  }, [id, user]);

  const handleRegister = async () => {
    setRegLoading(true);
    setMessage('');
    try {
      await api.post(`/registrations/event/${id}/register`);
      setRegistered(true);
      setMessage('🎉 Successfully registered for this event!');
    } catch (err) {
      setMessage(err.response?.data?.message || 'Registration failed. Please try again.');
    } finally {
      setRegLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-[60vh]">
        <div className="h-10 w-10 rounded-full border-4 border-blue-100 border-t-blue-600 animate-spin"></div>
      </div>
    );
  }

  if (!event) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] text-center">
        <p className="text-gray-400 dark:text-gray-500 text-lg mb-4">Event not found.</p>
        <button onClick={() => navigate(-1)} className="text-blue-600 hover:underline text-sm font-medium">Go Back</button>
      </div>
    );
  }

  const formattedDate = new Date(event.date).toLocaleDateString('en-US', {
    weekday: 'long', month: 'long', day: 'numeric', year: 'numeric'
  });

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Back Button */}
      <button
        onClick={() => navigate(-1)}
        className="flex items-center gap-2 text-sm text-gray-500 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white mb-6 transition-colors group"
      >
        <ArrowLeft className="h-4 w-4 group-hover:-translate-x-1 transition-transform" />
        Back to Dashboard
      </button>

      {/* Poster */}
      <div className="relative w-full h-72 md:h-96 rounded-3xl overflow-hidden bg-gray-100 dark:bg-gray-800 mb-8 shadow-lg">
        {event.poster ? (
          <img src={event.poster} alt={event.title} className="w-full h-full object-cover" />
        ) : (
          <div className="w-full h-full bg-gradient-to-br from-blue-100 to-indigo-200 flex items-center justify-center">
            <Calendar className="h-20 w-20 text-blue-300" />
          </div>
        )}
        {/* Club badge overlay */}
        <div className="absolute bottom-4 left-4 flex items-center gap-2 bg-white/90 dark:bg-gray-900/90 backdrop-blur-sm rounded-full px-4 py-2 shadow-sm">
          {event.club?.logo ? (
            <img src={event.club.logo} className="h-6 w-6 rounded-full object-cover" alt="Club" />
          ) : (
            <div className="h-6 w-6 rounded-full bg-blue-100 flex items-center justify-center">
              <Building className="h-3 w-3 text-blue-600" />
            </div>
          )}
          <span className="text-xs font-bold text-gray-700 dark:text-gray-200 uppercase tracking-wider">{event.club?.name || 'Unknown Club'}</span>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {/* Main Content */}
        <div className="md:col-span-2">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-4 leading-tight">{event.title}</h1>
          <p className="text-gray-600 dark:text-gray-300 leading-relaxed text-base whitespace-pre-wrap">{event.description}</p>
        </div>

        {/* Sidebar Info Card */}
        <div className="bg-white dark:bg-gray-800 rounded-2xl border border-gray-100 dark:border-gray-700 shadow-sm p-6 space-y-5 h-fit">
          <h2 className="font-bold text-gray-900 dark:text-white text-base border-b border-gray-100 dark:border-gray-700 pb-3">Event Details</h2>

          <div className="flex items-start gap-3">
            <Calendar className="h-5 w-5 text-blue-500 mt-0.5 flex-shrink-0" />
            <div>
              <p className="text-xs text-gray-400 dark:text-gray-500 font-medium uppercase tracking-wide">Date</p>
              <p className="text-sm font-semibold text-gray-800 dark:text-gray-200">{formattedDate}</p>
            </div>
          </div>

          <div className="flex items-start gap-3">
            <Clock className="h-5 w-5 text-blue-500 mt-0.5 flex-shrink-0" />
            <div>
              <p className="text-xs text-gray-400 dark:text-gray-500 font-medium uppercase tracking-wide">Time</p>
              <p className="text-sm font-semibold text-gray-800 dark:text-gray-200">{event.time}</p>
            </div>
          </div>

          <div className="flex items-start gap-3">
            <MapPin className="h-5 w-5 text-blue-500 mt-0.5 flex-shrink-0" />
            <div>
              <p className="text-xs text-gray-400 dark:text-gray-500 font-medium uppercase tracking-wide">Venue</p>
              <p className="text-sm font-semibold text-gray-800 dark:text-gray-200">{event.venue}</p>
            </div>
          </div>

          {event.participantLimit && (
            <div className="flex items-start gap-3">
              <Users className="h-5 w-5 text-blue-500 mt-0.5 flex-shrink-0" />
              <div>
                <p className="text-xs text-gray-400 dark:text-gray-500 font-medium uppercase tracking-wide">Capacity</p>
                <p className="text-sm font-semibold text-gray-800 dark:text-gray-200">{event.participantLimit} participants</p>
              </div>
            </div>
          )}

          {/* Message */}
          {message && (
            <div className={`p-3 rounded-xl text-sm font-medium text-center ${
              message.startsWith('🎉') ? 'bg-green-50 dark:bg-green-900/20 text-green-700 dark:text-green-400' : 'bg-red-50 dark:bg-red-900/20 text-red-700 dark:text-red-400'
            }`}>
              {message}
            </div>
          )}

          {/* Action Buttons */}
          {user?.role === 'Student' && !registered && (
            <button
              onClick={handleRegister}
              disabled={regLoading}
              className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 rounded-xl text-sm shadow-sm hover:shadow-md transition-all disabled:opacity-50"
            >
              {regLoading ? 'Registering...' : 'Register for Event'}
            </button>
          )}

          {user?.role === 'Student' && registered && (
            <div className="w-full bg-green-50 dark:bg-green-900/20 text-green-700 dark:text-green-400 font-semibold py-3 rounded-xl text-sm text-center border border-green-100 dark:border-green-900/50">
              ✅ You are registered
            </div>
          )}

          {user?.role === 'Student' && (
            <button
              onClick={() => setShowFeedbackModal(true)}
              className="w-full bg-slate-100 hover:bg-slate-200 dark:bg-slate-700 dark:hover:bg-slate-600 text-slate-700 dark:text-slate-300 font-semibold py-3 rounded-xl text-sm transition-colors border border-slate-200 dark:border-slate-600 mt-3"
            >
              Give Feedback
            </button>
          )}

          {event.registrationLink && (
            <a
              href={event.registrationLink}
              target="_blank"
              rel="noopener noreferrer"
              className="w-full flex items-center justify-center gap-2 border border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700 text-gray-700 dark:text-gray-300 font-medium py-2.5 rounded-xl text-sm transition-colors"
            >
              <ExternalLink className="h-4 w-4" />
              External Registration
            </a>
          )}
        </div>
      </div>

      {/* Feedback Modal */}
      {showFeedbackModal && (
        <FeedbackModal event={event} onClose={() => setShowFeedbackModal(false)} />
      )}
    </div>
  );
};

export default EventDetail;
