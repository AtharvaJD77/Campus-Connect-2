import { useState } from 'react';
import api from '../utils/api';
import { X, MessageSquare, AlertCircle, Loader } from 'lucide-react';

const FeedbackModal = ({ event, onClose }) => {
  const [form, setForm] = useState({
    type: 'Suggestion',
    message: ''
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setSuccess('');

    try {
      await api.post('/feedback', {
        eventId: event._id,
        ...form
      });
      setSuccess('Feedback submitted successfully!');
      setTimeout(() => {
        onClose();
      }, 1500);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to submit feedback.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-[60] flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-sm" onClick={onClose}>
      <div className="bg-white dark:bg-slate-800 rounded-2xl w-full max-w-lg shadow-2xl overflow-hidden animate-in fade-in zoom-in-95 duration-200" onClick={(e) => e.stopPropagation()}>
        <div className="p-6 border-b border-slate-100 dark:border-slate-700 flex items-start justify-between bg-slate-50/50 dark:bg-slate-800/50">
          <div>
            <h2 className="text-xl font-bold text-slate-900 dark:text-white flex items-center gap-2">
              <MessageSquare className="h-5 w-5 text-blue-500" />
              Give Feedback
            </h2>
            <p className="text-sm text-slate-500 dark:text-slate-400 mt-1 line-clamp-1">For event: {event.title}</p>
          </div>
          <button onClick={onClose} className="p-2 hover:bg-slate-200 dark:hover:bg-slate-700 rounded-full transition-colors text-slate-500 dark:text-slate-400">
            <X className="h-5 w-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-5">
          {error && (
            <div className="bg-red-50 dark:bg-red-900/20 text-red-700 dark:text-red-400 text-sm p-3 rounded-xl border border-red-100 dark:border-red-900/50 flex items-center gap-2">
              <AlertCircle className="h-4 w-4" />
              {error}
            </div>
          )}
          {success && (
            <div className="bg-green-50 dark:bg-green-900/20 text-green-700 dark:text-green-400 text-sm p-3 rounded-xl border border-green-100 dark:border-green-900/50">
              {success}
            </div>
          )}

          <div>
            <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">Feedback Type</label>
            <select
              name="type"
              value={form.type}
              onChange={handleChange}
              className="w-full border border-slate-300 dark:border-slate-600 rounded-xl px-4 py-2.5 text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white dark:bg-slate-700 dark:text-white transition-shadow"
            >
              <option value="Suggestion">💡 Suggestion</option>
              <option value="Complaint">⚠️ Complaint</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">Message</label>
            <textarea
              name="message"
              value={form.message}
              onChange={handleChange}
              required
              rows={4}
              placeholder="Tell us what you think..."
              className="w-full border border-slate-300 dark:border-slate-600 rounded-xl px-4 py-3 text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white dark:bg-slate-700 dark:text-white resize-none transition-shadow"
            />
          </div>

          <div className="flex gap-3 pt-2">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 border border-slate-200 dark:border-slate-600 text-slate-600 dark:text-slate-300 font-medium py-3 rounded-xl text-sm hover:bg-slate-50 dark:hover:bg-slate-700 transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading || success}
              className="flex-1 bg-blue-600 hover:bg-blue-700 text-white font-medium py-3 rounded-xl text-sm shadow hover:shadow-md transition-all disabled:opacity-50 flex items-center justify-center gap-2"
            >
              {loading ? <><Loader className="animate-spin h-4 w-4" /> Submitting...</> : 'Submit Feedback'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default FeedbackModal;
