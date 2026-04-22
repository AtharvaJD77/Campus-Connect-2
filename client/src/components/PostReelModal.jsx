import { useState } from 'react';
import api from '../utils/api';
import { X, Video, Upload, Calendar } from 'lucide-react';

const PostReelModal = ({ onClose, events, onEventUpdated }) => {
  const [selectedEvent, setSelectedEvent] = useState(events[0]?._id || '');
  const [videoUploading, setVideoUploading] = useState(false);
  const [error, setError] = useState('');

  const handleVideoUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;
    if (!selectedEvent) {
      setError('Please select an event first.');
      return;
    }

    const event = events.find(ev => ev._id === selectedEvent);
    if (event.short_videos && event.short_videos.length >= 3) {
      setError('Maximum 3 reels allowed per event. You can delete older reels by editing the event.');
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
      
      const updatedShortVideos = [...(event.short_videos || []), res.data];
      
      const updateRes = await api.put(`/events/${selectedEvent}`, {
        ...event,
        short_videos: updatedShortVideos
      });

      onEventUpdated(updateRes.data);
      onClose();
    } catch (err) {
      setError('Failed to post reel. Please try again.');
    } finally {
      setVideoUploading(false);
      e.target.value = '';
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4" onClick={onClose}>
      <div
        className="bg-white dark:bg-slate-800 rounded-2xl shadow-2xl w-full max-w-md"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between p-5 border-b border-gray-100 dark:border-slate-700">
          <h2 className="text-xl font-bold text-gray-900 dark:text-white flex items-center gap-2">
            <Video className="h-5 w-5 text-pink-500" />
            Post a Reel
          </h2>
          <button onClick={onClose} className="p-2 hover:bg-gray-100 dark:hover:bg-slate-700 rounded-full transition-colors text-gray-400 hover:text-gray-600 dark:hover:text-slate-300">
            <X className="h-5 w-5" />
          </button>
        </div>

        <div className="p-6">
          {error && (
            <div className="bg-red-50 text-red-700 text-sm p-3 rounded-lg border border-red-100 mb-4">{error}</div>
          )}

          {events.length === 0 ? (
            <div className="text-center py-6 text-gray-500">
              You need to create an event before you can post a reel.
            </div>
          ) : (
            <div className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-slate-300 mb-2">
                  Select Event for this Reel
                </label>
                <div className="relative">
                  <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                  <select
                    value={selectedEvent}
                    onChange={(e) => setSelectedEvent(e.target.value)}
                    className="w-full pl-10 pr-4 py-2.5 bg-gray-50 dark:bg-slate-700/50 border border-gray-300 dark:border-slate-600 rounded-xl focus:ring-2 focus:ring-pink-500 focus:border-pink-500 text-sm dark:text-white appearance-none"
                  >
                    {events.map(ev => (
                      <option key={ev._id} value={ev._id}>{ev.title}</option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="pt-2">
                <label className={`flex flex-col items-center justify-center w-full h-48 border-2 border-dashed rounded-xl cursor-pointer transition-all ${
                  videoUploading 
                    ? 'bg-gray-50 dark:bg-slate-800 border-gray-300 dark:border-slate-600 opacity-70 cursor-not-allowed' 
                    : 'bg-pink-50 dark:bg-pink-900/10 border-pink-300 dark:border-pink-700 hover:bg-pink-100 dark:hover:bg-pink-900/20'
                }`}>
                  <div className="flex flex-col items-center justify-center pt-5 pb-6">
                    {videoUploading ? (
                      <>
                        <div className="animate-spin h-10 w-10 border-4 border-pink-500 border-t-transparent rounded-full mb-3"></div>
                        <p className="text-sm font-semibold text-gray-700 dark:text-slate-300">Uploading Reel...</p>
                        <p className="text-xs text-gray-500 dark:text-slate-400 mt-1">Please wait, this might take a moment.</p>
                      </>
                    ) : (
                      <>
                        <Upload className="w-10 h-10 mb-3 text-pink-500" />
                        <p className="mb-2 text-sm text-gray-700 dark:text-slate-300 font-semibold">
                          Click to upload video
                        </p>
                        <p className="text-xs text-gray-500 dark:text-slate-400">MP4 (MAX 100MB)</p>
                      </>
                    )}
                  </div>
                  <input 
                    type="file" 
                    accept="video/mp4,video/quicktime" 
                    className="hidden" 
                    onChange={handleVideoUpload} 
                    disabled={videoUploading}
                  />
                </label>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default PostReelModal;
