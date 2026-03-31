import { useState, useEffect } from 'react';
import { X, MessageSquare, Target, User, Mail, AlertTriangle } from 'lucide-react';
import api from '../utils/api';

const ViewFeedbackModal = ({ event, onClose }) => {
  const [feedbacks, setFeedbacks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchFeedback = async () => {
      try {
        const res = await api.get(`/feedback/event/${event._id}`);
        setFeedbacks(res.data);
      } catch (err) {
        setError('Failed to load feedback. You might not have permission.');
      } finally {
        setLoading(false);
      }
    };

    fetchFeedback();
  }, [event._id]);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-sm" onClick={onClose}>
      <div className="bg-white dark:bg-slate-800 rounded-3xl w-full max-w-2xl shadow-2xl overflow-hidden animate-in fade-in zoom-in-95 duration-200" onClick={(e) => e.stopPropagation()}>
        {/* Header */}
        <div className="p-6 border-b border-slate-100 dark:border-slate-700 flex items-start justify-between bg-slate-50/50 dark:bg-slate-800/50">
          <div>
            <h2 className="text-xl font-bold text-slate-900 dark:text-white leading-tight flex items-center gap-2">
              <MessageSquare className="h-5 w-5 text-blue-500" />
              Event Feedback
            </h2>
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
          ) : feedbacks.length === 0 ? (
            <div className="py-12 text-center flex flex-col items-center">
              <div className="h-16 w-16 bg-slate-100 dark:bg-slate-700 rounded-full flex items-center justify-center mb-4">
                <MessageSquare className="h-8 w-8 text-slate-400 dark:text-slate-500" />
              </div>
              <p className="text-slate-500 dark:text-slate-400 font-medium">No feedback received yet.</p>
              <p className="text-sm text-slate-400 dark:text-slate-500 mt-1">Students can leave suggestions or complaints from the event details page.</p>
            </div>
          ) : (
            <div className="space-y-4">
              <div className="flex items-center justify-between mb-4">
                <span className="text-sm font-semibold text-slate-600 dark:text-slate-300">Total Submissions</span>
                <span className="bg-primary-100 dark:bg-primary-900/40 text-primary-700 dark:text-primary-300 px-3 py-1 rounded-full text-xs font-bold">
                  {feedbacks.length}
                </span>
              </div>
              
              {feedbacks.map((item) => (
                <div key={item._id} className="p-4 bg-white dark:bg-slate-800 border border-slate-100 dark:border-slate-700 rounded-2xl shadow-sm hover:shadow-md transition-shadow">
                  <div className="flex justify-between items-start mb-3">
                    <div className="flex items-center gap-3">
                      <div className="h-10 w-10 bg-gradient-to-br from-slate-100 to-slate-200 dark:from-slate-700 dark:to-slate-600 rounded-full flex items-center justify-center text-slate-600 dark:text-slate-300 shadow-inner">
                        {item.student?.name ? item.student.name.charAt(0).toUpperCase() : <User className="h-5 w-5" />}
                      </div>
                      <div>
                        <p className="font-semibold text-slate-900 dark:text-white text-sm">
                          {item.student?.name || 'Unknown Student'}
                        </p>
                        <p className="text-xs text-slate-500 dark:text-slate-400 flex items-center mt-0.5">
                          <Mail className="h-3 w-3 mr-1 opacity-70" />
                          {item.student?.email}
                        </p>
                      </div>
                    </div>
                    <div>
                      {item.type === 'Suggestion' ? (
                        <span className="flex items-center gap-1 bg-blue-50 dark:bg-blue-900/30 text-blue-700 dark:text-blue-400 px-2.5 py-1 rounded-lg text-xs font-bold uppercase tracking-wider">
                          <Target className="h-3.5 w-3.5" /> Suggestion
                        </span>
                      ) : (
                        <span className="flex items-center gap-1 bg-red-50 dark:bg-red-900/30 text-red-700 dark:text-red-400 px-2.5 py-1 rounded-lg text-xs font-bold uppercase tracking-wider">
                          <AlertTriangle className="h-3.5 w-3.5" /> Complaint
                        </span>
                      )}
                    </div>
                  </div>
                  <div className="bg-slate-50 dark:bg-slate-900/50 p-3 rounded-xl border border-slate-100 dark:border-slate-800 text-sm text-slate-700 dark:text-slate-300 whitespace-pre-wrap">
                    {item.message}
                  </div>
                  <div className="mt-2 text-right">
                    <span className="text-[10px] uppercase text-slate-400 dark:text-slate-500 font-medium">
                      {new Date(item.createdAt).toLocaleString()}
                    </span>
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

export default ViewFeedbackModal;
