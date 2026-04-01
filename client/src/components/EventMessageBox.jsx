import { useState, useEffect, useRef } from 'react';
import api from '../utils/api';
import { MessageSquare, Send, Lock, Clock, XCircle, CheckCircle } from 'lucide-react';

const EventMessageBox = ({ eventId, registrationStatus, isAdmin }) => {
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState('');
  const [loading, setLoading] = useState(false);
  const [sending, setSending] = useState(false);
  const [error, setError] = useState('');
  const messagesEndRef = useRef(null);

  const isApproved = registrationStatus === 'Approved';

  useEffect(() => {
    if (!isApproved && !isAdmin) return;
    fetchMessages();
  }, [eventId, isApproved, isAdmin]);

  const fetchMessages = async () => {
    setLoading(true);
    try {
      const res = await api.get(`/messages/${eventId}`);
      setMessages(res.data.reverse()); // oldest first
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to load messages.');
    } finally {
      setLoading(false);
    }
  };

  const handleSend = async () => {
    if (!newMessage.trim()) return;
    setSending(true);
    try {
      await api.post(`/messages/${eventId}`, { message_content: newMessage.trim() });
      setNewMessage('');
      fetchMessages();
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to send.');
    } finally {
      setSending(false);
    }
  };

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  // Status badge for non-approved students
  if (!isAdmin && registrationStatus !== 'Approved') {
    return (
      <div className="mt-8 border border-gray-200 dark:border-gray-700 rounded-2xl overflow-hidden bg-white dark:bg-gray-800">
        <div className="p-5 border-b border-gray-100 dark:border-gray-700 bg-gray-50 dark:bg-gray-800/50 flex items-center gap-2">
          <MessageSquare className="h-5 w-5 text-gray-400" />
          <h3 className="font-bold text-gray-900 dark:text-white text-sm">Event Announcements</h3>
        </div>
        <div className="p-8 text-center">
          {registrationStatus === 'Pending' && (
            <div className="flex flex-col items-center gap-3">
              <div className="h-14 w-14 bg-amber-50 dark:bg-amber-900/30 rounded-full flex items-center justify-center">
                <Clock className="h-7 w-7 text-amber-500" />
              </div>
              <p className="font-semibold text-amber-700 dark:text-amber-400 text-sm">Approval Pending</p>
              <p className="text-xs text-gray-500 dark:text-gray-400 max-w-xs">Your registration is pending approval by the event organizer. You'll gain access to announcements once approved.</p>
            </div>
          )}
          {registrationStatus === 'Rejected' && (
            <div className="flex flex-col items-center gap-3">
              <div className="h-14 w-14 bg-red-50 dark:bg-red-900/30 rounded-full flex items-center justify-center">
                <XCircle className="h-7 w-7 text-red-500" />
              </div>
              <p className="font-semibold text-red-700 dark:text-red-400 text-sm">Access Denied</p>
              <p className="text-xs text-gray-500 dark:text-gray-400 max-w-xs">Your registration was not approved. Contact the event organizer for more information.</p>
            </div>
          )}
          {!registrationStatus && (
            <div className="flex flex-col items-center gap-3">
              <div className="h-14 w-14 bg-gray-100 dark:bg-gray-700 rounded-full flex items-center justify-center">
                <Lock className="h-7 w-7 text-gray-400" />
              </div>
              <p className="font-semibold text-gray-600 dark:text-gray-400 text-sm">Register to Access</p>
              <p className="text-xs text-gray-500 dark:text-gray-400 max-w-xs">Register for this event and get approved to access announcements.</p>
            </div>
          )}
        </div>
      </div>
    );
  }

  // Approved student or Admin view
  return (
    <div className="mt-8 border border-gray-200 dark:border-gray-700 rounded-2xl overflow-hidden bg-white dark:bg-gray-800">
      <div className="p-5 border-b border-gray-100 dark:border-gray-700 bg-gray-50 dark:bg-gray-800/50 flex items-center gap-2">
        <MessageSquare className="h-5 w-5 text-blue-500" />
        <h3 className="font-bold text-gray-900 dark:text-white text-sm">Event Announcements</h3>
        {isApproved && (
          <span className="ml-auto flex items-center gap-1 text-[10px] font-bold text-green-600 dark:text-green-400 bg-green-50 dark:bg-green-900/30 px-2 py-0.5 rounded-full">
            <CheckCircle className="h-3 w-3" /> Approved
          </span>
        )}
      </div>

      <div className="h-64 overflow-y-auto p-4 space-y-3 bg-gray-50/50 dark:bg-gray-900/30">
        {loading ? (
          <div className="flex justify-center items-center h-full">
            <div className="h-6 w-6 rounded-full border-2 border-gray-200 dark:border-gray-600 border-t-blue-500 animate-spin"></div>
          </div>
        ) : error ? (
          <p className="text-center text-red-500 text-sm">{error}</p>
        ) : messages.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-full text-gray-400 dark:text-gray-500">
            <MessageSquare className="h-8 w-8 mb-2 opacity-50" />
            <p className="text-sm">No announcements yet.</p>
          </div>
        ) : (
          messages.map((msg) => (
            <div key={msg._id} className="bg-white dark:bg-gray-800 border border-gray-100 dark:border-gray-700 rounded-xl p-3 shadow-sm">
              <div className="flex items-center justify-between mb-1.5">
                <span className="text-xs font-bold text-blue-600 dark:text-blue-400">
                  {msg.sender?.name || 'Admin'}
                </span>
                <span className="text-[10px] text-gray-400 dark:text-gray-500">
                  {new Date(msg.createdAt).toLocaleString('en-US', { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' })}
                </span>
              </div>
              <p className="text-sm text-gray-700 dark:text-gray-300 leading-relaxed">{msg.message_content}</p>
            </div>
          ))
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Admin compose bar */}
      {isAdmin && (
        <div className="p-4 border-t border-gray-100 dark:border-gray-700 flex gap-2">
          <input
            type="text"
            value={newMessage}
            onChange={(e) => setNewMessage(e.target.value)}
            placeholder="Type an announcement..."
            className="flex-1 border border-gray-300 dark:border-gray-600 rounded-xl px-4 py-2.5 text-sm bg-white dark:bg-gray-700 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            onKeyDown={(e) => e.key === 'Enter' && handleSend()}
          />
          <button
            onClick={handleSend}
            disabled={sending || !newMessage.trim()}
            className="bg-blue-600 hover:bg-blue-700 text-white rounded-xl px-4 py-2.5 text-sm font-medium transition-colors disabled:opacity-50 flex items-center gap-1.5"
          >
            <Send className="h-4 w-4" />
            {sending ? '...' : 'Send'}
          </button>
        </div>
      )}
    </div>
  );
};

export default EventMessageBox;
