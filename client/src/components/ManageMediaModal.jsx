import { useState } from 'react';
import api from '../utils/api';
import { X, Image, Video, Upload, Trash2, Loader } from 'lucide-react';

const ManageMediaModal = ({ club, onClose, onClubUpdated }) => {
  const [images, setImages] = useState(club?.images || []);
  const [videos, setVideos] = useState(club?.videos || []);
  const [loading, setLoading] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState('');

  const handleFileUpload = async (e, type) => {
    const files = Array.from(e.target.files);
    if (files.length === 0) return;

    setUploading(true);
    setError('');
    
    try {
      const uploadPromises = files.map(async (file) => {
        const formData = new FormData();
        formData.append('media', file);
        const res = await api.post('/upload', formData, {
          headers: { 'Content-Type': 'multipart/form-data' }
        });
        return res.data;
      });

      const urls = await Promise.all(uploadPromises);
      
      if (type === 'image') {
        setImages(prev => [...prev, ...urls]);
      } else if (type === 'video') {
        setVideos(prev => [...prev, ...urls]);
      }
    } catch (err) {
      setError(err.response?.data || 'Failed to upload file(s).');
    } finally {
      setUploading(false);
      e.target.value = null;
    }
  };

  const addVideoUrl = () => {
    const url = window.prompt("Enter YouTube or Video URL:");
    if (url) {
      setVideos(prev => [...prev, url]);
    }
  };

  const handleRemoveImage = (index) => {
    setImages(prev => prev.filter((_, i) => i !== index));
  };

  const handleRemoveVideo = (index) => {
    setVideos(prev => prev.filter((_, i) => i !== index));
  };

  const handleSubmit = async () => {
    setLoading(true);
    setError('');
    
    try {
      // Send the current fully resolved arrays back to server
      const res = await api.put(`/clubs/${club._id}`, { images, videos });
      onClubUpdated(res.data);
      onClose();
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to update media. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4" onClick={onClose}>
      <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-2xl w-full max-w-3xl max-h-[90vh] overflow-y-auto" onClick={(e) => e.stopPropagation()}>
        <div className="flex items-center justify-between p-6 border-b border-gray-100 dark:border-slate-700">
          <h2 className="text-xl font-bold text-gray-900 dark:text-white">Manage Media Gallery</h2>
          <button onClick={onClose} className="p-2 hover:bg-gray-100 dark:hover:bg-slate-700 rounded-full transition-colors text-gray-400 hover:text-gray-600 dark:hover:text-slate-300">
            <X className="h-5 w-5" />
          </button>
        </div>

        <div className="p-6 space-y-8">
          {error && <div className="bg-red-50 text-red-700 text-sm p-3 rounded-lg border border-red-100">{error}</div>}

          {/* Image Section */}
          <section>
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-bold text-gray-900 dark:text-white flex items-center">
                <Image className="h-5 w-5 mr-2 text-pink-600" /> Images
              </h3>
              <label className="cursor-pointer bg-pink-50 dark:bg-pink-900/30 hover:bg-pink-100 dark:hover:bg-pink-800 text-pink-700 dark:text-pink-300 px-4 py-2 rounded-xl text-sm font-bold transition-colors flex items-center shadow-sm">
                <Upload className="h-4 w-4 mr-2" /> {uploading ? 'Uploading...' : 'Upload Images'}
                <input type="file" multiple accept="image/*" className="hidden" onChange={(e) => handleFileUpload(e, 'image')} disabled={uploading} />
              </label>
            </div>
            
            {images.length === 0 ? (
              <p className="text-gray-400 dark:text-slate-400 text-sm text-center py-8 bg-gray-50 dark:bg-slate-800/50 rounded-xl border border-dashed border-gray-200 dark:border-slate-700">No images added yet. Click Upload to select files from your device.</p>
            ) : (
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
                {images.map((img, i) => (
                  <div key={i} className="relative group aspect-square rounded-xl overflow-hidden border border-gray-200 dark:border-slate-700 shadow-sm">
                    <img src={img} alt="" className="w-full h-full object-cover" />
                    <button type="button" onClick={() => handleRemoveImage(i)} className="absolute top-2 right-2 p-1.5 bg-white/90 text-red-600 rounded-full opacity-0 group-hover:opacity-100 transition-opacity hover:bg-red-50 shadow-sm">
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </div>
                ))}
              </div>
            )}
          </section>

          {/* Video Section */}
          <section>
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-bold text-gray-900 dark:text-white flex items-center">
                <Video className="h-5 w-5 mr-2 text-blue-600" /> Videos
              </h3>
              <div className="flex gap-2">
                <button type="button" onClick={addVideoUrl} className="bg-gray-100 dark:bg-slate-700 hover:bg-gray-200 dark:hover:bg-slate-600 text-gray-700 dark:text-slate-200 px-4 py-2 rounded-xl text-sm font-bold transition-colors flex items-center shadow-sm">
                  Add Link
                </button>
                <label className="cursor-pointer bg-blue-50 dark:bg-blue-900/30 hover:bg-blue-100 dark:hover:bg-blue-800 text-blue-700 dark:text-blue-300 px-4 py-2 rounded-xl text-sm font-bold transition-colors flex items-center shadow-sm">
                  <Upload className="h-4 w-4 mr-2" /> {uploading ? 'Uploading...' : 'Upload Video'}
                  <input type="file" multiple accept="video/*" className="hidden" onChange={(e) => handleFileUpload(e, 'video')} disabled={uploading} />
                </label>
              </div>
            </div>

            {videos.length === 0 ? (
              <p className="text-gray-400 dark:text-slate-400 text-sm text-center py-8 bg-gray-50 dark:bg-slate-800/50 rounded-xl border border-dashed border-gray-200 dark:border-slate-700">No videos added yet.</p>
            ) : (
              <div className="space-y-3">
                {videos.map((vid, i) => (
                  <div key={i} className="flex items-center justify-between p-3 bg-gray-50 dark:bg-slate-700/50 rounded-xl border border-gray-200 dark:border-slate-700 shadow-sm">
                    <p className="text-sm text-blue-600 dark:text-blue-400 truncate mr-4 shrink flex-grow font-medium">{vid}</p>
                    <button type="button" onClick={() => handleRemoveVideo(i)} className="p-1.5 text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-colors flex-shrink-0">
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </div>
                ))}
              </div>
            )}
          </section>

          <div className="flex gap-3 pt-4 border-t border-gray-100 dark:border-slate-700">
            <button type="button" onClick={onClose} className="flex-1 border border-gray-200 dark:border-slate-600 text-gray-600 dark:text-slate-300 font-medium py-3 rounded-xl text-sm hover:bg-gray-50 dark:hover:bg-slate-700 transition-colors">
              Cancel
            </button>
            <button type="button" onClick={handleSubmit} disabled={loading || uploading} className="flex-1 bg-blue-600 hover:bg-blue-700 text-white font-medium py-3 rounded-xl text-sm shadow transition-all disabled:opacity-50 flex items-center justify-center">
              {(loading || uploading) ? <><Loader className="animate-spin h-4 w-4 mr-2" /> Saving...</> : 'Save Media Gallery'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ManageMediaModal;
