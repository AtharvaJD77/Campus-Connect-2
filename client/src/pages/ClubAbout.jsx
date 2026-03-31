import { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import api from '../utils/api';
import { useAuth } from '../context/AuthContext';
import EditClubModal from '../components/EditClubModal';
import ManageMediaModal from '../components/ManageMediaModal';
import { Building, Users, Mail, ArrowLeft, Image, Video, Edit, Layers } from 'lucide-react';

const ClubAbout = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const [club, setClub] = useState(null);
  const [loading, setLoading] = useState(true);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showMediaModal, setShowMediaModal] = useState(false);

  useEffect(() => {
    const fetchClubData = async () => {
      try {
        const res = await api.get(`/clubs/${id}`);
        setClub(res.data);
      } catch (error) {
        console.error('Error fetching club details:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchClubData();
  }, [id]);

  const handleClubUpdated = (updatedClub) => {
    setClub(updatedClub);
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-[60vh]">
        <div className="h-10 w-10 rounded-full border-4 border-primary-100 border-t-primary-600 animate-spin"></div>
      </div>
    );
  }

  if (!club) {
    return (
      <div className="text-center py-20 flex flex-col items-center">
        <h2 className="text-2xl font-bold text-slate-900 dark:text-white">Club not found</h2>
        <button onClick={() => navigate(-1)} className="mt-6 text-white font-bold bg-primary-600 hover:bg-primary-700 px-6 py-3 rounded-xl shadow-md transition-colors">
          Go back
        </button>
      </div>
    );
  }

  const getEmbedUrl = (url) => {
    if (!url) return '';
    try {
      const isYouTube = url.includes('youtube.com') || url.includes('youtu.be');
      if (isYouTube) {
        let videoId = '';
        if (url.includes('youtu.be/')) videoId = url.split('youtu.be/')[1].split('?')[0];
        else if (url.includes('v=')) videoId = url.split('v=')[1].split('&')[0];
        return `https://www.youtube.com/embed/${videoId}`;
      }
      return url;
    } catch (e) {
      return url;
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-900">
      {/* Header / Banner */}
      <div className="bg-gradient-to-br from-primary-900 via-slate-900 to-indigo-950 pt-20 pb-32 px-4 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-64 h-64 bg-primary-500/20 rounded-full blur-3xl -mr-20 -mt-20"></div>
        <div className="absolute bottom-0 left-0 w-64 h-64 bg-indigo-500/20 rounded-full blur-3xl -ml-20 -mb-20"></div>
        
        <div className="max-w-7xl mx-auto relative z-10 flex flex-col md:flex-row items-center gap-8">
          <Link 
            to={`/clubs/${club._id}`} 
            className="absolute top-0 left-0 -mt-12 flex items-center text-slate-300 hover:text-white transition-colors text-sm font-semibold bg-white/5 px-4 py-2 border border-white/10 rounded-full backdrop-blur-md"
          >
            <ArrowLeft className="w-4 h-4 mr-2" /> Back to Profile
          </Link>

          <div className="absolute top-0 right-0 -mt-12 flex gap-3">
            {user?.role === 'ClubAdmin' && user._id === club.createdBy?._id && (
              <>
                <button 
                  onClick={() => setShowEditModal(true)}
                  className="flex items-center text-primary-700 dark:text-primary-300 bg-white dark:bg-slate-800 hover:bg-gray-50 dark:hover:bg-slate-700 transition-colors text-sm font-semibold px-4 py-2 rounded-full shadow-md hover:-translate-y-0.5"
                >
                  <Edit className="w-4 h-4 mr-2" /> Edit Profile
                </button>
                <button 
                  onClick={() => setShowMediaModal(true)}
                  className="flex items-center text-white bg-pink-600 hover:bg-pink-700 transition-colors text-sm font-semibold px-4 py-2 rounded-full shadow-md hover:-translate-y-0.5"
                >
                  <Layers className="w-4 h-4 mr-2" /> Manage Media
                </button>
              </>
            )}
          </div>
          
          <div className="w-32 h-32 md:w-40 md:h-40 shrink-0 rounded-3xl bg-white border-4 border-white/10 shadow-2xl overflow-hidden flex items-center justify-center">
            {club.logo ? (
              <img src={club.logo} alt={club.name} className="w-full h-full object-cover" />
            ) : (
              <Users className="w-16 h-16 text-primary-500" />
            )}
          </div>
          
          <div className="text-center md:text-left flex-grow">
            <h1 className="text-4xl md:text-5xl font-black text-white mb-4 tracking-tight drop-shadow-sm">
              {club.name}
            </h1>
            <div className="flex flex-wrap items-center justify-center md:justify-start gap-3 mt-4 text-slate-300 font-medium text-sm">
              <span className="flex items-center bg-white/10 px-4 py-2 rounded-xl border border-white/10 backdrop-blur-sm shadow-sm">
                <Building className="w-4 h-4 mr-2 text-primary-400" />
                {club.college}
              </span>
              <span className="flex items-center bg-white/10 px-4 py-2 rounded-xl border border-white/10 backdrop-blur-sm shadow-sm">
                <Users className="w-4 h-4 mr-2 text-indigo-400" />
                {club.followersCount} Followers
              </span>
              <span className="flex items-center bg-white/10 px-4 py-2 rounded-xl border border-white/10 backdrop-blur-sm shadow-sm">
                <Mail className="w-4 h-4 mr-2 text-sky-400" />
                {club.contactEmail}
              </span>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 -mt-16 relative z-20 pb-24">
        {/* Full Details Content */}
        <div className="bg-white dark:bg-slate-800 rounded-3xl p-8 md:p-12 shadow-xl shadow-slate-200/50 dark:shadow-none border border-slate-100 dark:border-slate-700">
          
          <section className="mb-16">
            <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-6 flex items-center gap-3">
              <span className="text-primary-600 rounded-xl bg-primary-50 p-2 shadow-sm text-lg block">📝</span>
              Our Story & Mission
            </h2>
            <div className="w-16 h-1 bg-gradient-to-r from-primary-500 to-indigo-500 rounded-full mb-8"></div>
            <p className="text-slate-600 dark:text-slate-300 leading-loose text-lg font-medium whitespace-pre-wrap">
              {club.description}
            </p>
          </section>

          {club.images && club.images.length > 0 && (
            <section className="mb-16">
              <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-6 flex items-center gap-3">
                <Image className="text-pink-600 w-10 h-10 rounded-xl bg-pink-50 p-2 shadow-sm" />
                Image Gallery
              </h2>
              <div className="w-16 h-1 bg-gradient-to-r from-pink-500 to-red-500 rounded-full mb-8"></div>
              <div className="columns-1 sm:columns-2 lg:columns-3 gap-6 space-y-6">
                {club.images.map((img, i) => (
                  <div key={i} className="break-inside-avoid rounded-2xl overflow-hidden shadow-sm hover:shadow-md transition-all group">
                    <img src={img} alt={`${club.name} gallery ${i}`} className="w-full h-auto rounded-2xl group-hover:scale-105 transition-transform duration-500" />
                  </div>
                ))}
              </div>
            </section>
          )}

          {club.videos && club.videos.length > 0 && (
            <section>
              <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-6 flex items-center gap-3">
                <Video className="text-blue-600 w-10 h-10 rounded-xl bg-blue-50 p-2 shadow-sm" />
                Video Gallery
              </h2>
              <div className="w-16 h-1 bg-gradient-to-r from-blue-500 to-cyan-500 rounded-full mb-8"></div>
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                {club.videos.map((vid, i) => {
                  const embedUrl = getEmbedUrl(vid);
                  return (
                    <div key={i} className="rounded-2xl overflow-hidden shadow-sm hover:shadow-lg transition-shadow bg-slate-900 aspect-video flex-shrink-0">
                      <iframe 
                        className="w-full h-full"
                        src={embedUrl} 
                        title={`${club.name} video ${i}`}
                        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" 
                        allowFullScreen
                      ></iframe>
                    </div>
                  );
                })}
              </div>
            </section>
          )}

        </div>
      </div>

      {/* Edit Club Modal */}
      {showEditModal && (
        <EditClubModal
          club={club}
          onClose={() => setShowEditModal(false)}
          onClubUpdated={handleClubUpdated}
        />
      )}
      {/* Manage Media Modal */}
      {showMediaModal && (
        <ManageMediaModal
          club={club}
          onClose={() => setShowMediaModal(false)}
          onClubUpdated={handleClubUpdated}
        />
      )}
    </div>
  );
};

export default ClubAbout;
