import { useState, useEffect } from 'react';
import api from '../utils/api';
import { X, Users, Mail, User } from 'lucide-react';

const ViewFollowersModal = ({ club, onClose }) => {
  const [followers, setFollowers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchFollowers = async () => {
      try {
        const res = await api.get(`/followers/club/${club._id}/followers`);
        setFollowers(res.data);
      } catch (err) {
        setError(err.response?.data?.message || 'Failed to load followers.');
      } finally {
        setLoading(false);
      }
    };

    fetchFollowers();
  }, [club._id]);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4" onClick={onClose}>
      <div
        className="bg-white dark:bg-slate-800 rounded-2xl shadow-2xl w-full max-w-lg max-h-[85vh] flex flex-col overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between p-5 border-b border-gray-100 dark:border-slate-700 bg-white dark:bg-slate-800 z-10">
          <h2 className="text-xl font-bold text-gray-900 dark:text-white flex items-center gap-2">
            <Users className="h-5 w-5 text-indigo-500" />
            Club Followers
          </h2>
          <button onClick={onClose} className="p-2 hover:bg-gray-100 dark:hover:bg-slate-700 rounded-full transition-colors text-gray-400 hover:text-gray-600 dark:hover:text-slate-300">
            <X className="h-5 w-5" />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto p-6">
          {error && (
            <div className="bg-red-50 text-red-700 text-sm p-3 rounded-lg border border-red-100 mb-4">{error}</div>
          )}

          {loading ? (
            <div className="flex justify-center py-10">
              <div className="animate-spin h-8 w-8 border-4 border-indigo-500 border-t-transparent rounded-full"></div>
            </div>
          ) : followers.length === 0 ? (
            <div className="text-center py-10">
              <Users className="h-12 w-12 text-gray-300 dark:text-slate-600 mx-auto mb-3" />
              <p className="text-gray-500 dark:text-slate-400 font-medium">No one is following this club yet.</p>
              <p className="text-sm text-gray-400 mt-1">Publish exciting events to gain followers!</p>
            </div>
          ) : (
            <div className="space-y-3">
              <div className="flex justify-between items-center mb-4 px-1">
                <span className="text-sm font-semibold text-gray-500 dark:text-slate-400 uppercase tracking-wider">
                  Total Followers
                </span>
                <span className="bg-indigo-100 dark:bg-indigo-900/40 text-indigo-700 dark:text-indigo-300 px-3 py-1 rounded-full text-xs font-bold">
                  {followers.length}
                </span>
              </div>
              
              <ul className="divide-y divide-gray-100 dark:divide-slate-700">
                {followers.map((follower, index) => (
                  <li key={index} className="py-3 px-2 flex items-center gap-4 hover:bg-gray-50 dark:hover:bg-slate-700/50 rounded-xl transition-colors">
                    <div className="h-10 w-10 bg-indigo-50 dark:bg-slate-700 rounded-full flex items-center justify-center text-indigo-600 dark:text-indigo-400 border border-indigo-100 dark:border-slate-600 shadow-sm flex-shrink-0">
                      <User className="h-5 w-5" />
                    </div>
                    <div className="min-w-0 flex-1">
                      <p className="text-sm font-bold text-gray-900 dark:text-white truncate">
                        {follower.name || 'Unknown Student'}
                      </p>
                      <p className="text-xs text-gray-500 dark:text-slate-400 truncate flex items-center gap-1 mt-0.5">
                        <Mail className="h-3 w-3" />
                        {follower.email || 'No email provided'}
                      </p>
                    </div>
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ViewFollowersModal;
