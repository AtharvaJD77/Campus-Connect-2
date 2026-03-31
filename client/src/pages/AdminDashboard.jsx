import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import api from '../utils/api';
import { CheckCircle, XCircle, Trash2, Users, Building, Calendar, ShieldCheck } from 'lucide-react';

const AdminDashboard = () => {
  const [activeTab, setActiveTab] = useState('clubs');
  const [clubs, setClubs] = useState([]);
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState(null);

  useEffect(() => {
    fetchData();
  }, [activeTab]);

  const fetchData = async () => {
    setLoading(true);
    try {
      if (activeTab === 'clubs') {
        const res = await api.get('/clubs/all');
        setClubs(res.data);
      } else if (activeTab === 'events') {
        const res = await api.get('/events');
        setEvents(res.data);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleVerifyClub = async (clubId) => {
    setActionLoading(clubId);
    try {
      await api.put(`/clubs/${clubId}/verify`);
      setClubs(prev => prev.map(c => c._id === clubId ? { ...c, isVerified: true } : c));
    } catch (err) {
      alert(err.response?.data?.message || 'Failed to verify club');
    } finally {
      setActionLoading(null);
    }
  };

  const handleApproveEvent = async (eventId) => {
    setActionLoading(eventId);
    try {
      await api.put(`/events/${eventId}/approve`);
      setEvents(prev => prev.map(e => e._id === eventId ? { ...e, status: 'approved' } : e));
    } catch (err) {
      alert(err.response?.data?.message || 'Failed to approve event');
    } finally {
      setActionLoading(null);
    }
  };

  const handleDeleteEvent = async (eventId) => {
    if (!window.confirm('Are you sure you want to delete this event?')) return;
    setActionLoading(eventId);
    try {
      await api.delete(`/events/${eventId}`);
      setEvents(prev => prev.filter(e => e._id !== eventId));
    } catch (err) {
      alert(err.response?.data?.message || 'Failed to delete event');
    } finally {
      setActionLoading(null);
    }
  };

  const tabs = [
    { key: 'clubs', label: 'Clubs', icon: Building },
    { key: 'events', label: 'Events', icon: Calendar },
  ];

  const pendingClubs = clubs.filter(c => !c.isVerified);
  const verifiedClubs = clubs.filter(c => c.isVerified);

  const pendingEvents = events.filter(e => e.status === 'pending');
  const approvedEvents = events.filter(e => e.status === 'approved');

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Header */}
      <div className="flex items-center gap-4 mb-10 p-6 bg-gradient-to-r from-purple-900 to-indigo-800 dark:from-purple-950 dark:to-indigo-950 rounded-3xl shadow-xl text-white">
        <div className="h-16 w-16 rounded-2xl bg-white/20 backdrop-blur-md flex items-center justify-center shadow-inner">
          <ShieldCheck className="h-8 w-8 text-white" />
        </div>
        <div>
          <h1 className="text-3xl font-extrabold tracking-tight">System Admin Panel</h1>
          <p className="text-purple-200 mt-1 font-medium">Manage clubs, events, and all platform content</p>
        </div>
      </div>

      {/* Stats Row */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
        <div className="relative overflow-hidden bg-white dark:bg-gray-800 rounded-3xl border border-gray-100 dark:border-gray-700 shadow-sm hover:shadow-md transition-shadow p-6 group">
          <div className="absolute -right-4 -top-4 text-amber-50 dark:text-amber-900/30 group-hover:text-amber-100 dark:group-hover:text-amber-900/50 transition-colors duration-500">
            <Building className="w-32 h-32" />
          </div>
          <div className="relative">
            <p className="text-sm text-gray-500 dark:text-gray-400 font-semibold uppercase tracking-wider">Pending Clubs</p>
            <p className="text-4xl font-black text-amber-600 mt-2">{pendingClubs.length}</p>
          </div>
        </div>
        <div className="relative overflow-hidden bg-white dark:bg-gray-800 rounded-3xl border border-gray-100 dark:border-gray-700 shadow-sm hover:shadow-md transition-shadow p-6 group">
          <div className="absolute -right-4 -top-4 text-emerald-50 dark:text-emerald-900/30 group-hover:text-emerald-100 dark:group-hover:text-emerald-900/50 transition-colors duration-500">
            <CheckCircle className="w-32 h-32" />
          </div>
          <div className="relative">
            <p className="text-sm text-gray-500 dark:text-gray-400 font-semibold uppercase tracking-wider">Verified Clubs</p>
            <p className="text-4xl font-black text-emerald-600 mt-2">{verifiedClubs.length}</p>
          </div>
        </div>
        <div className="relative overflow-hidden bg-white dark:bg-gray-800 rounded-3xl border border-gray-100 dark:border-gray-700 shadow-sm hover:shadow-md transition-shadow p-6 group">
          <div className="absolute -right-4 -top-4 text-blue-50 dark:text-blue-900/30 group-hover:text-blue-100 dark:group-hover:text-blue-900/50 transition-colors duration-500">
            <Calendar className="w-32 h-32" />
          </div>
          <div className="relative">
            <p className="text-sm text-gray-500 dark:text-gray-400 font-semibold uppercase tracking-wider">Total Events</p>
            <p className="text-4xl font-black text-blue-600 mt-2">{events.length}</p>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex space-x-2 bg-gray-100/50 dark:bg-gray-800/50 p-1.5 rounded-2xl w-fit mb-8">
        {tabs.map(({ key, label, icon: Icon }) => (
          <button
            key={key}
            onClick={() => setActiveTab(key)}
            className={`flex items-center gap-2 px-6 py-3 text-sm font-bold rounded-xl transition-all duration-300 ${
              activeTab === key
                ? 'bg-white dark:bg-gray-700 text-purple-700 dark:text-purple-300 shadow-sm ring-1 ring-gray-900/5 dark:ring-gray-100/5'
                : 'text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300 hover:bg-gray-200/50 dark:hover:bg-gray-700/50'
            }`}
          >
            <Icon className={`h-4 w-4 ${activeTab === key ? 'text-purple-600' : ''}`} />
            {label}
          </button>
        ))}
      </div>

      {/* Content */}
      {loading ? (
        <div className="flex justify-center py-20">
          <div className="h-9 w-9 rounded-full border-4 border-purple-100 border-t-purple-600 animate-spin"></div>
        </div>
      ) : activeTab === 'clubs' ? (
        <div className="space-y-3">
          {clubs.length === 0 && (
            <div className="text-center py-16 text-gray-400 dark:text-gray-500">No clubs registered yet.</div>
          )}
          {/* Pending clubs first */}
          {pendingClubs.length > 0 && (
            <>
              <h3 className="text-xs font-bold uppercase tracking-widest text-amber-600 px-1 mb-2">⏳ Awaiting Approval</h3>
              {pendingClubs.map(club => (
                <ClubRow
                  key={club._id}
                  club={club}
                  onVerify={handleVerifyClub}
                  actionLoading={actionLoading}
                />
              ))}
              <div className="h-px bg-gray-100 dark:bg-gray-800 my-4" />
            </>
          )}
          {/* Verified clubs */}
          {verifiedClubs.length > 0 && (
            <>
              <h3 className="text-xs font-bold uppercase tracking-widest text-green-600 px-1 mb-2">✅ Verified Clubs</h3>
              {verifiedClubs.map(club => (
                <ClubRow
                  key={club._id}
                  club={club}
                  onVerify={handleVerifyClub}
                  actionLoading={actionLoading}
                />
              ))}
            </>
          )}
        </div>
      ) : (
        <div className="space-y-3">
          {events.length === 0 && (
            <div className="text-center py-16 text-gray-400 dark:text-gray-500">No events found.</div>
          )}
          {pendingEvents.length > 0 && (
            <>
              <h3 className="text-xs font-bold uppercase tracking-widest text-amber-600 px-1 mb-2">⏳ Awaiting Approval</h3>
              {pendingEvents.map(event => (
                <EventRow
                  key={event._id}
                  event={event}
                  onApprove={handleApproveEvent}
                  onDelete={handleDeleteEvent}
                  actionLoading={actionLoading}
                />
              ))}
              <div className="h-px bg-gray-100 dark:bg-gray-800 my-4" />
            </>
          )}
          {approvedEvents.length > 0 && (
            <>
              <h3 className="text-xs font-bold uppercase tracking-widest text-green-600 px-1 mb-2">✅ Approved Events</h3>
              {approvedEvents.map(event => (
                <EventRow
                  key={event._id}
                  event={event}
                  onApprove={handleApproveEvent}
                  onDelete={handleDeleteEvent}
                  actionLoading={actionLoading}
                />
              ))}
            </>
          )}
        </div>
      )}
    </div>
  );
};

// --- Club Row Component ---
const ClubRow = ({ club, onVerify, actionLoading }) => (
  <div className={`flex items-center justify-between p-5 rounded-2xl border transition-all duration-300 hover:-translate-y-1 hover:shadow-lg group ${
    club.isVerified ? 'bg-white dark:bg-gray-800 border-gray-100 dark:border-gray-700 hover:border-purple-200 dark:hover:border-purple-800' : 'bg-gradient-to-r from-amber-50 to-white dark:from-amber-900/20 dark:to-gray-800 border-amber-200 dark:border-amber-900/50'
  }`}>
    <Link to={`/clubs/${club._id}`} className="flex items-center gap-5 flex-grow outline-none cursor-pointer">
      <div className="h-14 w-14 rounded-2xl overflow-hidden bg-gray-50 dark:bg-gray-700 border border-gray-100 dark:border-gray-600 flex items-center justify-center flex-shrink-0 shadow-sm transition-transform group-hover:scale-105">
        {club.logo ? (
          <img src={club.logo} alt={club.name} className="h-full w-full object-cover" />
        ) : (
          <Building className="h-6 w-6 text-gray-400 dark:text-gray-500" />
        )}
      </div>
      <div>
        <div className="flex items-center gap-3">
          <p className="font-bold text-gray-900 dark:text-white text-lg group-hover:text-purple-700 dark:group-hover:text-purple-400 transition-colors">{club.name}</p>
          {club.isVerified ? (
            <span className="text-xs bg-green-100 text-green-700 px-2.5 py-1 rounded-full font-bold uppercase tracking-wide shadow-sm">Verified</span>
          ) : (
            <span className="text-xs bg-amber-100 text-amber-700 px-2.5 py-1 rounded-full font-bold uppercase tracking-wide shadow-sm">Pending</span>
          )}
        </div>
        <p className="text-sm text-gray-500 dark:text-gray-400 font-medium mt-0.5">{club.college} · {club.contactEmail}</p>
        <p className="text-sm text-gray-400 dark:text-gray-500 mt-1 max-w-lg line-clamp-1">{club.description}</p>
      </div>
    </Link>

    {!club.isVerified && (
      <button
        onClick={() => onVerify(club._id)}
        disabled={actionLoading === club._id}
        className="flex items-center gap-2 bg-green-600 hover:bg-green-700 text-white px-5 py-2.5 rounded-xl text-sm font-bold shadow-md hover:shadow-lg transition-all transform hover:-translate-y-0.5 disabled:opacity-50 disabled:transform-none flex-shrink-0 ml-4"
      >
        <CheckCircle className="h-4 w-4" />
        {actionLoading === club._id ? 'Verifying...' : 'Approve'}
      </button>
    )}
    {club.isVerified && (
      <div className="flex items-center justify-center h-10 w-10 bg-green-50 rounded-full ml-4">
        <CheckCircle className="h-6 w-6 text-green-500" />
      </div>
    )}
  </div>
);

// --- Event Row Component ---
const EventRow = ({ event, onApprove, onDelete, actionLoading }) => (
  <div className={`flex items-center justify-between p-5 rounded-2xl border transition-all duration-300 hover:-translate-y-1 hover:shadow-lg group ${
    event.status === 'approved' ? 'bg-white dark:bg-gray-800 border-gray-100 dark:border-gray-700 hover:border-purple-200 dark:hover:border-purple-800' : 'bg-gradient-to-r from-amber-50 to-white dark:from-amber-900/20 dark:to-gray-800 border-amber-200 dark:border-amber-900/50'
  }`}>
    <div className="flex items-center gap-5">
      <div className="h-14 w-14 rounded-2xl overflow-hidden bg-gray-50 dark:bg-gray-700 border border-gray-100 dark:border-gray-600 flex items-center justify-center flex-shrink-0 shadow-sm">
        {event.poster ? (
          <img src={event.poster} alt={event.title} className="h-full w-full object-cover" />
        ) : (
          <Calendar className="h-6 w-6 text-gray-400 dark:text-gray-500" />
        )}
      </div>
      <div>
        <div className="flex items-center gap-3">
          <p className="font-bold text-gray-900 dark:text-white text-lg">{event.title}</p>
          {event.status === 'approved' ? (
            <span className="text-xs bg-green-100 text-green-700 px-2.5 py-1 rounded-full font-bold uppercase tracking-wide">Approved</span>
          ) : (
            <span className="text-xs bg-amber-100 text-amber-700 px-2.5 py-1 rounded-full font-bold uppercase tracking-wide">Pending</span>
          )}
        </div>
        <p className="text-sm text-gray-500 dark:text-gray-400 font-medium mt-0.5">
          {event.club?.name || 'Unknown Club'} · {new Date(event.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
        </p>
        <p className="text-sm text-gray-400 dark:text-gray-500 mt-1">{event.venue}</p>
      </div>
    </div>

    <div className="flex items-center gap-3 ml-4 flex-shrink-0">
      {event.status === 'pending' && (
        <button
          onClick={() => onApprove(event._id)}
          disabled={actionLoading === event._id}
          className="flex items-center gap-2 bg-green-600 hover:bg-green-700 text-white px-5 py-2.5 rounded-xl text-sm font-bold shadow-md hover:shadow-lg transition-all transform hover:-translate-y-0.5 disabled:opacity-50 disabled:transform-none"
        >
          <CheckCircle className="h-4 w-4" />
          {actionLoading === event._id ? 'Approving...' : 'Approve'}
        </button>
      )}

      <button
        onClick={() => onDelete(event._id)}
        disabled={actionLoading === event._id}
        className="flex items-center gap-2 bg-red-50 dark:bg-red-900/20 hover:bg-red-100 dark:hover:bg-red-900/40 text-red-600 dark:text-red-400 hover:text-red-700 dark:hover:text-red-300 border border-red-100 dark:border-red-900/30 px-5 py-2.5 rounded-xl text-sm font-bold shadow-sm hover:shadow-md transition-all transform hover:-translate-y-0.5 disabled:opacity-50 disabled:transform-none"
      >
        <Trash2 className="h-4 w-4" />
        {actionLoading === event._id ? 'Deleting...' : 'Delete'}
      </button>
    </div>
  </div>
);

export default AdminDashboard;
