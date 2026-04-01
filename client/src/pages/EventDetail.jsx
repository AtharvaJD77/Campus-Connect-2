import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import api from '../utils/api';
import { Calendar, Clock, MapPin, Users, ExternalLink, ArrowLeft, Building, Video, Heart, Share2, Copy, Check } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import FeedbackModal from '../components/FeedbackModal';
import RegisterEventModal from '../components/RegisterEventModal';
import EventMessageBox from '../components/EventMessageBox';

const EventDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();

  const [event, setEvent] = useState(null);
  const [loading, setLoading] = useState(true);
  const [registered, setRegistered] = useState(false);
  const [registrationStatus, setRegistrationStatus] = useState(null);
  const [message, setMessage] = useState('');
  const [showFeedbackModal, setShowFeedbackModal] = useState(false);
  const [isRegisterModalOpen, setIsRegisterModalOpen] = useState(false);
  const [activeVideoIndex, setActiveVideoIndex] = useState(0);
  const [liked, setLiked] = useState(false);
  const [likesCount, setLikesCount] = useState(0);
  const [liking, setLiking] = useState(false);
  const [showShareMenu, setShowShareMenu] = useState(false);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    const fetchEventData = async () => {
      try {
        const res = await api.get(`/events/${id}`);
        setEvent(res.data);
        setLikesCount(res.data.likes_count || 0);
        if (user && res.data.liked_by?.includes(user._id)) {
          setLiked(true);
        }

        if (user?.role === 'Student') {
          const regRes = await api.get('/registrations/my-events');
          const isRegistered = regRes.data.some(e => e._id === id);
          setRegistered(isRegistered);
        }

        // Fetch registration status for message box access control
        if (user?.role === 'Student') {
          try {
            const statusRes = await api.get(`/registrations/my-events`);
            // We need the actual registration object to get status
            // Let's use a dedicated approach
          } catch (err) { /* ignore */ }
        }
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchEventData();
  }, [id, user]);

  // Fetch registration status separately for clarity
  useEffect(() => {
    const fetchRegistrationStatus = async () => {
      if (user?.role !== 'Student') return;
      try {
        // We need to check the registration document directly
        const res = await api.get('/registrations/my-events');
        const myReg = res.data.find(e => e._id === id);
        if (myReg) {
          setRegistered(true);
          // The my-events endpoint returns events, not registrations with status
          // We need status from a different source. Let's get full registration data.
        }
      } catch (err) { /* ignore */ }
    };
    fetchRegistrationStatus();
  }, [id, user]);

  // Fetch the actual registration status for the student
  useEffect(() => {
    const fetchStatus = async () => {
      if (user?.role !== 'Student') return;
      try {
        const res = await api.get(`/registrations/my-status/${id}`);
        if (res.data?.status) {
          setRegistrationStatus(res.data.status);
          setRegistered(true);
        }
      } catch (err) {
        // Not registered or endpoint doesn't exist yet
      }
    };
    fetchStatus();
  }, [id, user]);

  const handleRegistrationSuccess = () => {
    setRegistered(true);
    setRegistrationStatus('Pending');
    setMessage('🎉 Successfully registered! Awaiting admin approval for announcements access.');
  };

  // Check if user is the club admin for this event
  const isClubAdmin = user?.role === 'ClubAdmin';

  const handleToggleLike = async () => {
    if (!user) return;
    setLiking(true);
    try {
      const res = await api.put(`/events/${id}/like`);
      setLiked(res.data.liked);
      setLikesCount(res.data.likes_count);
    } catch (err) {
      console.error('Like failed:', err);
    } finally {
      setLiking(false);
    }
  };

  const eventUrl = `${window.location.origin}/events/${id}`;

  const handleCopyLink = async () => {
    try {
      await navigator.clipboard.writeText(eventUrl);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch { /* fallback */ }
    setShowShareMenu(false);
  };

  const handleShareWhatsApp = () => {
    const text = encodeURIComponent(`Check out this event: ${event?.title}\n${eventUrl}`);
    window.open(`https://wa.me/?text=${text}`, '_blank');
    setShowShareMenu(false);
  };

  const handleShareTwitter = () => {
    const text = encodeURIComponent(`${event?.title} - Check it out!`);
    window.open(`https://twitter.com/intent/tweet?text=${text}&url=${encodeURIComponent(eventUrl)}`, '_blank');
    setShowShareMenu(false);
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

      {/* Like & Share Action Bar */}
      <div className="flex items-center justify-between mb-8 bg-white dark:bg-gray-800 rounded-2xl border border-gray-100 dark:border-gray-700 px-5 py-3 shadow-sm">
        <div className="flex items-center gap-4">
          {/* Like Button */}
          <button
            onClick={handleToggleLike}
            disabled={!user || liking}
            className={`flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-semibold transition-all ${
              liked
                ? 'bg-red-50 dark:bg-red-900/30 text-red-600 dark:text-red-400 border border-red-200 dark:border-red-800'
                : 'bg-gray-50 dark:bg-gray-700 text-gray-600 dark:text-gray-300 border border-gray-200 dark:border-gray-600 hover:bg-red-50 dark:hover:bg-red-900/20 hover:text-red-500 hover:border-red-200'
            } disabled:opacity-50`}
          >
            <Heart className={`h-4.5 w-4.5 transition-all ${liked ? 'fill-red-500 text-red-500 scale-110' : ''}`} />
            {likesCount > 0 && <span>{likesCount}</span>}
            {likesCount === 0 && <span>Like</span>}
          </button>
        </div>

        {/* Share Button */}
        <div className="relative">
          <button
            onClick={() => setShowShareMenu(!showShareMenu)}
            className="flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-semibold bg-gray-50 dark:bg-gray-700 text-gray-600 dark:text-gray-300 border border-gray-200 dark:border-gray-600 hover:bg-blue-50 dark:hover:bg-blue-900/20 hover:text-blue-600 hover:border-blue-200 transition-all"
          >
            <Share2 className="h-4 w-4" />
            Share
          </button>

          {/* Share Dropdown */}
          {showShareMenu && (
            <div className="absolute right-0 top-12 z-30 w-52 bg-white dark:bg-gray-800 rounded-xl shadow-xl border border-gray-100 dark:border-gray-700 overflow-hidden animate-in fade-in slide-in-from-top-2 duration-200">
              <button
                onClick={handleCopyLink}
                className="w-full flex items-center gap-3 px-4 py-3 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
              >
                {copied ? <Check className="h-4 w-4 text-green-500" /> : <Copy className="h-4 w-4" />}
                {copied ? 'Copied!' : 'Copy Link'}
              </button>
              <button
                onClick={handleShareWhatsApp}
                className="w-full flex items-center gap-3 px-4 py-3 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
              >
                <span className="text-lg leading-none">💬</span>
                WhatsApp
              </button>
              <button
                onClick={handleShareTwitter}
                className="w-full flex items-center gap-3 px-4 py-3 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
              >
                <span className="text-lg leading-none">🐦</span>
                Twitter / X
              </button>
            </div>
          )}
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {/* Main Content */}
        <div className="md:col-span-2">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-4 leading-tight">{event.title}</h1>
          <p className="text-gray-600 dark:text-gray-300 leading-relaxed text-base whitespace-pre-wrap">{event.description}</p>

          {/* Short Videos Reel Section */}
          {event.short_videos && event.short_videos.length > 0 && (
            <div className="mt-8">
              <div className="flex items-center gap-2 mb-4">
                <Video className="h-5 w-5 text-blue-500" />
                <h2 className="font-bold text-gray-900 dark:text-white text-lg">Event Videos</h2>
                <span className="text-xs text-gray-400 dark:text-gray-500 bg-gray-100 dark:bg-gray-700 px-2 py-0.5 rounded-full">
                  {event.short_videos.length} clip{event.short_videos.length > 1 ? 's' : ''}
                </span>
              </div>
              
              {/* Active Video Player */}
              <div className="rounded-2xl overflow-hidden bg-black mb-3 shadow-lg">
                <video
                  key={event.short_videos[activeVideoIndex]}
                  controls
                  className="w-full max-h-[400px] object-contain"
                  preload="metadata"
                >
                  <source src={event.short_videos[activeVideoIndex]} type="video/mp4" />
                  Your browser does not support the video tag.
                </video>
              </div>

              {/* Video Thumbnails Strip */}
              {event.short_videos.length > 1 && (
                <div className="flex gap-2 overflow-x-auto pb-2">
                  {event.short_videos.map((videoUrl, index) => (
                    <button
                      key={index}
                      onClick={() => setActiveVideoIndex(index)}
                      className={`flex-shrink-0 w-24 h-16 rounded-xl overflow-hidden border-2 transition-all ${
                        activeVideoIndex === index
                          ? 'border-blue-500 shadow-md scale-105'
                          : 'border-gray-200 dark:border-gray-700 opacity-60 hover:opacity-100'
                      }`}
                    >
                      <video src={videoUrl} className="w-full h-full object-cover" muted preload="metadata" />
                    </button>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* Message Box - Access Controlled */}
          {user && (
            <EventMessageBox
              eventId={id}
              registrationStatus={registrationStatus}
              isAdmin={isClubAdmin}
            />
          )}
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

          <div className="flex items-start gap-3">
            <div className="mt-0.5 flex-shrink-0 text-blue-500 font-bold px-2 py-0.5 bg-blue-50 dark:bg-blue-900/40 rounded-md text-xs leading-none flex items-center justify-center transform translate-y-0.5">
              ₹
            </div>
            <div>
              <p className="text-xs text-gray-400 dark:text-gray-500 font-medium uppercase tracking-wide">Fee</p>
              <p className="text-sm font-bold text-gray-800 dark:text-gray-200">
                {event.isPaid ? `₹ ${event.registrationFee}` : 'FREE'}
              </p>
            </div>
          </div>

          {/* Registration Status Badge */}
          {registered && registrationStatus && (
            <div className={`p-3 rounded-xl text-sm font-medium text-center ${
              registrationStatus === 'Approved' ? 'bg-green-50 dark:bg-green-900/20 text-green-700 dark:text-green-400' :
              registrationStatus === 'Rejected' ? 'bg-red-50 dark:bg-red-900/20 text-red-700 dark:text-red-400' :
              'bg-amber-50 dark:bg-amber-900/20 text-amber-700 dark:text-amber-400'
            }`}>
              {registrationStatus === 'Approved' && '✅ Approved'}
              {registrationStatus === 'Pending' && '⏳ Approval Pending'}
              {registrationStatus === 'Rejected' && '❌ Rejected'}
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
              onClick={() => setIsRegisterModalOpen(true)}
              className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 rounded-xl text-sm shadow-sm hover:shadow-md transition-all"
            >
              Register for Event
            </button>
          )}

          {user?.role === 'Student' && registered && !registrationStatus && (
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
              className="w-full flex items-center justify-center gap-2 border border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700 text-gray-700 dark:text-gray-300 font-medium py-2.5 rounded-xl text-sm transition-colors mt-3"
            >
              <ExternalLink className="h-4 w-4" />
              External Registration
            </a>
          )}

          {event.externalLink && (
            <a
              href={event.externalLink}
              target="_blank"
              rel="noopener noreferrer"
              className="w-full flex items-center justify-center gap-2 bg-indigo-50 hover:bg-indigo-100 dark:bg-indigo-900/30 dark:hover:bg-indigo-900/50 text-indigo-700 dark:text-indigo-300 font-medium py-2.5 rounded-xl text-sm transition-colors mt-3 shadow-sm border border-indigo-100 dark:border-indigo-800"
            >
              <ExternalLink className="h-4 w-4" />
              More Info / Join Link
            </a>
          )}
        </div>
      </div>

      {/* Feedback Modal */}
      {showFeedbackModal && (
        <FeedbackModal event={event} onClose={() => setShowFeedbackModal(false)} />
      )}

      {/* Registration Modal */}
      <RegisterEventModal 
        isOpen={isRegisterModalOpen} 
        onClose={() => setIsRegisterModalOpen(false)} 
        event={event} 
        onSuccess={handleRegistrationSuccess} 
      />
    </div>
  );
};

export default EventDetail;
