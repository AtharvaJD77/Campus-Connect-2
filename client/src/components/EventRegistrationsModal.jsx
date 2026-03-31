import { useState, useEffect } from 'react';
import { X, Users, Mail, User } from 'lucide-react';
import api from '../utils/api';

const EventRegistrationsModal = ({ event, onClose }) => {
  const [registrations, setRegistrations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchRegistrations = async () => {
      try {
        const res = await api.get(`/registrations/event/${event._id}/registrations`);
        setRegistrations(res.data);
      } catch (err) {
        setError('Failed to load registrations. You might not have permission.');
      } finally {
        setLoading(false);
      }
    };

    fetchRegistrations();
  }, [event._id]);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-sm">
      <div className="bg-white dark:bg-slate-800 rounded-3xl w-full max-w-lg shadow-2xl overflow-hidden animate-in fade-in zoom-in-95 duration-200">
        {/* Header */}
        <div className="p-6 border-b border-slate-100 dark:border-slate-700 flex items-start justify-between bg-slate-50/50 dark:bg-slate-800/50">
          <div>
            <h2 className="text-xl font-bold text-slate-900 dark:text-white leading-tight">Registrations</h2>
            <p className="text-sm text-slate-500 dark:text-slate-400 mt-1 line-clamp-1">{event.title}</p>
          </div>
          <button
            onClick={onClose}
            className="p-2 hover:bg-slate-200 dark:hover:bg-slate-700 rounded-full transition-colors text-slate-500 dark:text-slate-400"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 max-h-[60vh] overflow-y-auto">
          {loading ? (
            <div className="flex justify-center items-center py-10">
              <div className="h-8 w-8 rounded-full border-4 border-slate-100 dark:border-slate-700 border-t-primary-600 animate-spin"></div>
            </div>
          ) : error ? (
            <div className="py-8 text-center text-red-500 font-medium">
              {error}
            </div>
          ) : registrations.length === 0 ? (
            <div className="py-12 text-center flex flex-col items-center">
              <div className="h-16 w-16 bg-slate-100 dark:bg-slate-700 rounded-full flex items-center justify-center mb-4">
                <Users className="h-8 w-8 text-slate-400 dark:text-slate-500" />
              </div>
              <p className="text-slate-500 dark:text-slate-400 font-medium">No registrations yet.</p>
              <p className="text-sm text-slate-400 dark:text-slate-500 mt-1">Participants will appear here once they register.</p>
            </div>
          ) : (
            <div className="space-y-3">
              <div className="flex items-center justify-between mb-4">
                <span className="text-sm font-semibold text-slate-600 dark:text-slate-300">Total Participants</span>
                <span className="bg-primary-100 dark:bg-primary-900/40 text-primary-700 dark:text-primary-300 px-3 py-1 rounded-full text-xs font-bold">
                  {registrations.length}
                </span>
              </div>
              
              {registrations.map((student, idx) => (
                <div key={student._id || idx} className="flex items-center p-3 sm:p-4 bg-white dark:bg-slate-800 border border-slate-100 dark:border-slate-700 rounded-2xl hover:border-primary-200 dark:hover:border-primary-800 hover:shadow-sm transition-all group">
                  <div className="h-10 w-10 bg-gradient-to-br from-primary-100 to-indigo-100 rounded-full flex items-center justify-center text-primary-600 font-bold shadow-inner mr-4 flex-shrink-0">
                    {student.name ? student.name.charAt(0).toUpperCase() : <User className="h-5 w-5" />}
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className="font-semibold text-slate-900 dark:text-white truncate">
                      {student.name || 'Unknown Student'}
                    </p>
                    <p className="text-sm text-slate-500 dark:text-slate-400 truncate flex items-center mt-0.5">
                      <Mail className="h-3.5 w-3.5 mr-1.5 opacity-70" />
                      {student.email}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="p-4 sm:p-6 border-t border-slate-100 dark:border-slate-700 bg-slate-50 dark:bg-slate-800/50 flex justify-end">
          <button
            onClick={onClose}
            className="px-6 py-2.5 bg-slate-900 dark:bg-slate-100 hover:bg-slate-800 dark:hover:bg-white text-white dark:text-slate-900 rounded-xl text-sm font-medium transition-colors shadow-sm"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};

export default EventRegistrationsModal;
