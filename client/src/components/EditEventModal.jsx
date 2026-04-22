import { useState } from 'react';
import api from '../utils/api';
import { X, Calendar, Clock, MapPin, Link, Users, Video, Upload, Trash2 } from 'lucide-react';

const EditEventModal = ({ onClose, onEventUpdated, event }) => {
  const [form, setForm] = useState({
    title: event.title || '',
    description: event.description || '',
    date: event.date ? new Date(event.date).toISOString().split('T')[0] : '',
    time: event.time || '',
    venue: event.venue || '',
    poster: event.poster || '',
    registrationLink: event.registrationLink || '',
    externalLink: event.externalLink || '',
    participantLimit: event.participantLimit || '',
    isPaid: event.isPaid || false,
    registrationFee: event.registrationFee || '',
    short_videos: event.short_videos || [],
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [videoUploading, setVideoUploading] = useState(false);
  const [posterUploading, setPosterUploading] = useState(false);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleVideoUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;
    if (form.short_videos.length >= 3) {
      setError('Maximum 3 videos allowed per event.');
      return;
    }
    setVideoUploading(true);
    setError('');
    try {
      const formData = new FormData();
      formData.append('media', file);
      const res = await api.post('/upload', formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });
      setForm(prev => ({ ...prev, short_videos: [...prev.short_videos, res.data] }));
    } catch (err) {
      setError('Failed to upload video.');
    } finally {
      setVideoUploading(false);
      e.target.value = '';
    }
  };

  const handlePosterUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;
    setPosterUploading(true);
    setError('');
    try {
      const formData = new FormData();
      formData.append('media', file);
      const res = await api.post('/upload', formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });
      setForm(prev => ({ ...prev, poster: res.data }));
    } catch (err) {
      setError('Failed to upload poster.');
    } finally {
      setPosterUploading(false);
      e.target.value = '';
    }
  };

  const removeVideo = (index) => {
    setForm(prev => ({ ...prev, short_videos: prev.short_videos.filter((_, i) => i !== index) }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    try {
      const payload = {
        ...form,
        participantLimit: form.participantLimit ? Number(form.participantLimit) : undefined,
        registrationFee: form.isPaid ? Number(form.registrationFee) : 0,
      };
      const res = await api.put(`/events/${event._id}`, payload);
      onEventUpdated(res.data);
      onClose();
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to update event. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4" onClick={onClose}>
      <div
        className="bg-white dark:bg-slate-800 rounded-2xl shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between p-6 border-b border-gray-100 dark:border-slate-700">
          <h2 className="text-xl font-bold text-gray-900 dark:text-white">Edit Event</h2>
          <button onClick={onClose} className="p-2 hover:bg-gray-100 dark:hover:bg-slate-700 rounded-full transition-colors text-gray-400 hover:text-gray-600 dark:hover:text-slate-300">
            <X className="h-5 w-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-5">
          {error && (
            <div className="bg-red-50 text-red-700 text-sm p-3 rounded-lg border border-red-100">{error}</div>
          )}

          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-slate-300 mb-1">Event Title *</label>
            <input
              type="text"
              name="title"
              value={form.title}
              onChange={handleChange}
              required
              placeholder="e.g. Annual Hackathon 2025"
              className="w-full border border-gray-300 dark:border-slate-600 rounded-lg px-4 py-2 text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white dark:bg-slate-700 dark:text-white"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-slate-300 mb-1">Description *</label>
            <textarea
              name="description"
              value={form.description}
              onChange={handleChange}
              required
              rows={3}
              placeholder="Describe the event, what to expect..."
              className="w-full border border-gray-300 dark:border-slate-600 rounded-lg px-4 py-2 text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white dark:bg-slate-700 dark:text-white resize-none"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-slate-300 mb-1">
                <Calendar className="inline h-3.5 w-3.5 mr-1" />Date *
              </label>
              <input
                type="date"
                name="date"
                value={form.date}
                onChange={handleChange}
                required
                className="w-full border border-gray-300 dark:border-slate-600 rounded-lg px-4 py-2 text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white dark:bg-slate-700 dark:text-white"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-slate-300 mb-1">
                <Clock className="inline h-3.5 w-3.5 mr-1" />Time *
              </label>
              <input
                type="time"
                name="time"
                value={form.time}
                onChange={handleChange}
                required
                className="w-full border border-gray-300 dark:border-slate-600 rounded-lg px-4 py-2 text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white dark:bg-slate-700 dark:text-white"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-slate-300 mb-1">
              <MapPin className="inline h-3.5 w-3.5 mr-1" />Venue *
            </label>
            <input
              type="text"
              name="venue"
              value={form.venue}
              onChange={handleChange}
              required
              placeholder="e.g. Main Auditorium, Block A"
              className="w-full border border-gray-300 dark:border-slate-600 rounded-lg px-4 py-2 text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white dark:bg-slate-700 dark:text-white"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-slate-300 mb-1">
                <Link className="inline h-3.5 w-3.5 mr-1" />Poster URL / Upload
              </label>
              <div className="flex gap-2">
                <input
                  type="text"
                  name="poster"
                  value={form.poster}
                  onChange={handleChange}
                  placeholder="https://..."
                  className="w-full border border-gray-300 dark:border-slate-600 rounded-lg px-4 py-2 text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white dark:bg-slate-700 dark:text-white"
                />
                <label className={`flex items-center justify-center bg-gray-100 dark:bg-slate-700 border border-gray-300 dark:border-slate-600 rounded-lg px-3 cursor-pointer hover:bg-gray-200 dark:hover:bg-slate-600 transition-colors ${posterUploading ? 'opacity-50 pointer-events-none' : ''}`} title="Upload Poster Image">
                  {posterUploading ? (
                    <span className="w-4 h-4 border-2 border-blue-500 border-t-transparent rounded-full animate-spin"></span>
                  ) : (
                    <Upload className="h-4 w-4 text-gray-600 dark:text-slate-300" />
                  )}
                  <input type="file" accept="image/*" className="hidden" onChange={handlePosterUpload} />
                </label>
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-slate-300 mb-1">
                <Users className="inline h-3.5 w-3.5 mr-1" />Participant Limit
              </label>
              <input
                type="number"
                name="participantLimit"
                value={form.participantLimit}
                onChange={handleChange}
                min="1"
                placeholder="Leave blank for unlimited"
                className="w-full border border-gray-300 dark:border-slate-600 rounded-lg px-4 py-2 text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white dark:bg-slate-700 dark:text-white"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-slate-300 mb-1">Registration Link</label>
              <input
                type="url"
                name="registrationLink"
                value={form.registrationLink}
                onChange={handleChange}
                placeholder="External Form (e.g. Google Forms)"
                className="w-full border border-gray-300 dark:border-slate-600 rounded-lg px-4 py-2 text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white dark:bg-slate-700 dark:text-white"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-slate-300 mb-1">External Info Link</label>
              <input
                type="url"
                name="externalLink"
                value={form.externalLink}
                onChange={handleChange}
                placeholder="Meeting Link / More Info"
                className="w-full border border-gray-300 dark:border-slate-600 rounded-lg px-4 py-2 text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white dark:bg-slate-700 dark:text-white"
              />
            </div>
          </div>

          {/* Short Videos Section */}
          <div className="border border-gray-200 dark:border-slate-700 rounded-xl p-4 bg-gray-50 dark:bg-slate-800/50">
            <div className="flex items-center justify-between mb-3">
              <label className="text-sm font-semibold text-gray-800 dark:text-slate-200 flex items-center gap-1.5">
                <Video className="h-4 w-4" /> Short Videos
              </label>
              <span className="text-xs text-gray-400 dark:text-slate-500">{form.short_videos.length}/3</span>
            </div>
            {form.short_videos.length > 0 && (
              <div className="space-y-2 mb-3">
                {form.short_videos.map((url, i) => (
                  <div key={i} className="flex items-center justify-between bg-white dark:bg-slate-700 p-2 rounded-lg border border-gray-200 dark:border-slate-600">
                    <span className="text-xs text-gray-600 dark:text-slate-300 truncate flex-1">Video {i + 1}</span>
                    <button type="button" onClick={() => removeVideo(i)} className="ml-2 text-red-500 hover:text-red-700 p-1">
                      <Trash2 className="h-3.5 w-3.5" />
                    </button>
                  </div>
                ))}
              </div>
            )}
            {form.short_videos.length < 3 && (
              <label className={`flex items-center justify-center gap-2 border-2 border-dashed border-gray-300 dark:border-slate-600 rounded-lg p-3 cursor-pointer hover:border-blue-400 dark:hover:border-blue-500 transition-colors ${videoUploading ? 'opacity-50 pointer-events-none' : ''}`}>
                <Upload className="h-4 w-4 text-gray-400" />
                <span className="text-xs text-gray-500 dark:text-slate-400">{videoUploading ? 'Uploading...' : 'Upload MP4 Video'}</span>
                <input type="file" accept="video/mp4" className="hidden" onChange={handleVideoUpload} />
              </label>
            )}
          </div>

          <div className="border border-gray-200 dark:border-slate-700 rounded-xl p-4 bg-gray-50 dark:bg-slate-800/50">
            <div className="flex items-center justify-between mb-3">
              <label className="text-sm font-semibold text-gray-800 dark:text-slate-200">Event Pricing</label>
              <div className="flex bg-gray-200 dark:bg-slate-700 rounded-lg p-0.5">
                <button
                  type="button"
                  onClick={() => setForm({ ...form, isPaid: false })}
                  className={`px-3 py-1 text-xs font-medium rounded-md transition-all ${
                    !form.isPaid ? 'bg-white dark:bg-slate-600 shadow-sm text-gray-900 dark:text-white' : 'text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200'
                  }`}
                >
                  Free
                </button>
                <button
                  type="button"
                  onClick={() => setForm({ ...form, isPaid: true })}
                  className={`px-3 py-1 text-xs font-medium rounded-md transition-all ${
                    form.isPaid ? 'bg-white dark:bg-slate-600 shadow-sm text-gray-900 dark:text-white' : 'text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200'
                  }`}
                >
                  Paid
                </button>
              </div>
            </div>
            
            {form.isPaid && (
              <div className="pt-2 border-t border-gray-200 dark:border-slate-700">
                <label className="block text-sm font-medium text-gray-700 dark:text-slate-300 mb-1">Registration Fee (₹) *</label>
                <input
                  type="number"
                  name="registrationFee"
                  value={form.registrationFee}
                  onChange={handleChange}
                  required
                  min="1"
                  placeholder="e.g. 500"
                  className="w-full border border-gray-300 dark:border-slate-600 rounded-lg px-4 py-2 text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white dark:bg-slate-700 dark:text-white"
                />
              </div>
            )}
          </div>

          <div className="flex gap-3 pt-2">
            <button
               type="button"
              onClick={onClose}
              className="flex-1 border border-gray-200 dark:border-slate-600 text-gray-600 dark:text-slate-300 font-medium py-2.5 rounded-xl text-sm hover:bg-gray-50 dark:hover:bg-slate-700 transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading}
              className="flex-1 bg-blue-600 hover:bg-blue-700 text-white font-medium py-2.5 rounded-xl text-sm shadow transition-all disabled:opacity-50"
            >
              {loading ? 'Updating...' : 'Update Event'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default EditEventModal;
