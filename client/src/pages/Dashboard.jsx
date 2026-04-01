import { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import api from '../utils/api';
import EventCard from '../components/EventCard';
import ClubCard from '../components/ClubCard';
import CreateEventModal from '../components/CreateEventModal';
import CreateClubModal from '../components/CreateClubModal';
import EditClubModal from '../components/EditClubModal';
import EditEventModal from '../components/EditEventModal';
import ManageMediaModal from '../components/ManageMediaModal';
import EventRegistrationsModal from '../components/EventRegistrationsModal';
import ViewFeedbackModal from '../components/ViewFeedbackModal';
import { PlusCircle, Building } from 'lucide-react';

const Dashboard = () => {
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState('feed');
  const [events, setEvents] = useState([]);
  const [clubs, setClubs] = useState([]);
  const [myClubs, setMyClubs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showClubModal, setShowClubModal] = useState(false);
  const [editingClub, setEditingClub] = useState(null);
  const [editingEvent, setEditingEvent] = useState(null);
  const [managingMediaClub, setManagingMediaClub] = useState(null);
  const [viewingEventRegistrations, setViewingEventRegistrations] = useState(null);
  const [viewingFeedback, setViewingFeedback] = useState(null);
  // Fetch ClubAdmin's own clubs for event creation dropdown
  useEffect(() => {
    if (user.role === 'ClubAdmin') {
      api.get('/clubs').then(res => {
        const mine = res.data.filter(c => c.createdBy?._id === user._id || c.createdBy === user._id);
        setMyClubs(mine);
      }).catch(() => {});
    }
  }, [user]);

  // Fetch data based on role and active tab
  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        if (user.role === 'Student') {
          if (activeTab === 'feed') {
            const res = await api.get('/events');
            setEvents(res.data);
          } else if (activeTab === 'discover') {
            const res = await api.get('/clubs');
            setClubs(res.data);
          } else if (activeTab === 'my-events') {
            const res = await api.get('/registrations/my-events');
            setEvents(res.data);
          }
        } else if (user.role === 'ClubAdmin') {
          const res = await api.get('/events');
          setEvents(res.data);
        }
      } catch (error) {
        console.error('Error fetching data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [activeTab, user]);

  // Prepend newly created event to the list immediately
  const handleEventCreated = (newEvent) => {
    setEvents(prev => [newEvent, ...prev]);
  };

  const handleEventUpdated = (updatedEvent) => {
    setEvents(prev => prev.map(e => e._id === updatedEvent._id ? updatedEvent : e));
  };

  // Add newly created club to myClubs
  const handleClubCreated = (newClub) => {
    setMyClubs(prev => [...prev, newClub]);
  };

  const handleClubUpdated = (updatedClub) => {
    setMyClubs(prev => prev.map(c => c._id === updatedClub._id ? updatedClub : c));
    setClubs(prev => prev.map(c => c._id === updatedClub._id ? updatedClub : c));
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-gray-900 dark:text-white">Welcome, {user.name}</h1>
          <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
            {user.role === 'Student' ? 'Discover and manage your campus events.' : 'Manage your club events and registrations.'}
          </p>
        </div>

        {user.role === 'ClubAdmin' && (
          <div className="mt-4 md:mt-0 flex gap-3">
            {/* Only show Create Club if user doesn't have one yet */}
            {myClubs.length === 0 && (
              <button
                onClick={() => setShowClubModal(true)}
                className="flex items-center justify-center gap-2 border border-blue-200 dark:border-blue-900/50 bg-blue-50 dark:bg-blue-900/20 hover:bg-blue-100 dark:hover:bg-blue-900/40 text-blue-700 dark:text-blue-400 px-4 py-2.5 rounded-xl font-semibold text-sm transition-all"
              >
                <Building className="h-4 w-4" />
                Create Club
              </button>
            )}
            <button
              onClick={() => setShowCreateModal(true)}
              className="flex items-center justify-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-5 py-2.5 rounded-xl font-semibold shadow-sm hover:shadow-md transition-all text-sm"
            >
              <PlusCircle className="h-5 w-5" />
              Create Event
            </button>
          </div>
        )}
      </div>

      {/* Tabs (Students only) */}
      {user.role === 'Student' && (
        <div className="flex space-x-1 border-b border-gray-200 mb-8">
          {[
            { key: 'feed', label: 'Event Feed' },
            { key: 'discover', label: 'Discover Clubs' },
            { key: 'my-events', label: 'My Registrations' },
          ].map(tab => (
            <button
              key={tab.key}
              onClick={() => setActiveTab(tab.key)}
              className={`px-4 py-2.5 text-sm font-medium border-b-2 transition-colors ${
                activeTab === tab.key
                  ? 'border-blue-600 dark:border-blue-500 text-blue-600 dark:text-blue-400'
                  : 'border-transparent text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300 hover:border-gray-300 dark:hover:border-gray-600'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>
      )}

      {/* Content Area */}
      {loading ? (
        <div className="flex justify-center py-16">
          <div className="h-9 w-9 rounded-full border-4 border-blue-100 border-t-blue-600 animate-spin"></div>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {/* ClubAdmin's Own Clubs */}
          {user.role === 'ClubAdmin' && myClubs.length > 0 && (
            <div className="col-span-full mb-2">
              <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-4">My Club</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {myClubs.map(club => (
                  <ClubCard 
                    key={club._id} 
                    club={club} 
                    onManageProfile={() => setEditingClub(club)} 
                    onManageMedia={() => setManagingMediaClub(club)}
                  />
                ))}
              </div>
              <h2 className="text-xl font-bold text-gray-900 dark:text-white mt-8 mb-2">Club Events</h2>
            </div>
          )}

          {/* Events */}
          {(activeTab === 'feed' || activeTab === 'my-events' || user.role === 'ClubAdmin') &&
            events.map(event => (
              <EventCard 
                key={event._id} 
                event={event} 
                onViewRegistrations={user.role === 'ClubAdmin' ? setViewingEventRegistrations : undefined} 
                onViewFeedback={user.role === 'ClubAdmin' ? setViewingFeedback : undefined}
                onEditEvent={user.role === 'ClubAdmin' ? setEditingEvent : undefined}
              />
            ))
          }

          {/* Clubs */}
          {activeTab === 'discover' &&
            clubs.map(club => (
              <ClubCard 
                key={club._id} 
                club={club} 
                onManageProfile={() => setEditingClub(club)} 
                onManageMedia={() => setManagingMediaClub(club)}
              />
            ))
          }

          {/* Empty States */}
          {(activeTab === 'feed' || activeTab === 'my-events' || user.role === 'ClubAdmin') && events.length === 0 && (
            <div className="col-span-full text-center py-20 bg-white dark:bg-gray-800 rounded-2xl border border-dashed border-gray-200 dark:border-gray-700">
              <p className="text-gray-400 dark:text-gray-500 text-sm">No events found.</p>
              {user.role === 'ClubAdmin' && (
                <button
                  onClick={() => setShowCreateModal(true)}
                  className="mt-4 text-blue-600 dark:text-blue-400 font-semibold text-sm hover:underline"
                >
                  + Create your first event
                </button>
              )}
            </div>
          )}
          {activeTab === 'discover' && clubs.length === 0 && (
            <div className="col-span-full text-center py-20 bg-white dark:bg-gray-800 rounded-2xl border border-dashed border-gray-200 dark:border-gray-700">
              <p className="text-gray-400 dark:text-gray-500 text-sm">No verified clubs yet. Check back soon!</p>
            </div>
          )}
        </div>
      )}

      {/* Create Event Modal */}
      {showCreateModal && (
        <CreateEventModal
          clubs={myClubs}
          onClose={() => setShowCreateModal(false)}
          onEventCreated={handleEventCreated}
        />
      )}

      {/* Create Club Modal */}
      {showClubModal && (
        <CreateClubModal
          onClose={() => setShowClubModal(false)}
          onClubCreated={handleClubCreated}
        />
      )}

      {/* Edit Club Modal */}
      {editingClub && (
        <EditClubModal
          club={editingClub}
          onClose={() => setEditingClub(null)}
          onClubUpdated={handleClubUpdated}
        />
      )}

      {/* Edit Event Modal */}
      {editingEvent && (
        <EditEventModal
          event={editingEvent}
          onClose={() => setEditingEvent(null)}
          onEventUpdated={handleEventUpdated}
        />
      )}

      {/* Manage Media Modal */}
      {managingMediaClub && (
        <ManageMediaModal
          club={managingMediaClub}
          onClose={() => setManagingMediaClub(null)}
          onClubUpdated={handleClubUpdated}
        />
      )}

      {/* Event Registrations Modal */}
      {viewingEventRegistrations && (
        <EventRegistrationsModal
          event={viewingEventRegistrations}
          onClose={() => setViewingEventRegistrations(null)}
        />
      )}

      {/* View Feedback Modal */}
      {viewingFeedback && (
        <ViewFeedbackModal
          event={viewingFeedback}
          onClose={() => setViewingFeedback(null)}
        />
      )}
    </div>
  );
};

export default Dashboard;
