import { useState, useEffect, useRef } from 'react';
import api from '../utils/api';
import { Heart, Info } from 'lucide-react';
import { Link } from 'react-router-dom';

const Reels = () => {
  const [reels, setReels] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchReels = async () => {
      try {
        const res = await api.get('/events');
        const allEvents = res.data;
        const allReels = [];
        allEvents.forEach(event => {
          if (event.short_videos && event.short_videos.length > 0) {
            event.short_videos.forEach(video => {
              allReels.push({ video, event });
            });
          }
        });
        // Shuffle the reels
        setReels(allReels.sort(() => Math.random() - 0.5));
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchReels();
  }, []);

  if (loading) {
     return <div className="flex justify-center items-center min-h-[calc(100vh-64px)] bg-black"><div className="animate-spin h-8 w-8 border-4 border-blue-500 border-t-transparent rounded-full"></div></div>;
  }

  if (reels.length === 0) {
     return <div className="flex justify-center items-center min-h-[calc(100vh-64px)] bg-black text-gray-500">No reels available yet.</div>;
  }

  return (
    <div className="bg-black min-h-[calc(100vh-64px)] flex justify-center overflow-hidden">
      {/* We hide the scrollbar to simulate tiktok/ig reels */}
      <style>{`
        .hide-scrollbar::-webkit-scrollbar { display: none; }
        .hide-scrollbar { -ms-overflow-style: none; scrollbar-width: none; }
      `}</style>
      <div className="w-full max-w-md h-[calc(100vh-64px)] overflow-y-scroll snap-y snap-mandatory hide-scrollbar">
        {reels.map((reel, idx) => (
          <Reel key={idx} reel={reel} />
        ))}
      </div>
    </div>
  );
};

const Reel = ({ reel }) => {
  const videoRef = useRef(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [liked, setLiked] = useState(false);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            videoRef.current.play().then(() => setIsPlaying(true)).catch(() => setIsPlaying(false)); // Autoplay might fail
          } else {
            videoRef.current.pause();
            setIsPlaying(false);
          }
        });
      },
      { threshold: 0.6 }
    );
    if (videoRef.current) observer.observe(videoRef.current);
    return () => observer.disconnect();
  }, []);

  const togglePlay = () => {
    if (isPlaying) {
      videoRef.current.pause();
      setIsPlaying(false);
    } else {
      videoRef.current.play();
      setIsPlaying(true);
    }
  };

  return (
    <div className="relative w-full h-[calc(100vh-64px)] snap-start bg-black flex items-center justify-center">
      <video
        ref={videoRef}
        src={reel.video}
        className="w-full h-full object-cover cursor-pointer"
        onClick={togglePlay}
        loop
        playsInline
      />
      {/* Play/Pause indicator logic can be added here, omitted for minimalism like IG */}
      
      {/* Overlay Details */}
      <div className="absolute bottom-0 left-0 w-full p-4 bg-gradient-to-t from-black/90 via-black/40 to-transparent flex justify-between items-end pb-8">
        <div className="flex-1 pr-4">
          <Link to={`/events/${reel.event._id}`} className="text-white font-bold text-base hover:underline flex items-center gap-2 mb-2">
            {reel.event.club?.logo ? (
              <img src={reel.event.club.logo} className="h-8 w-8 rounded-full object-cover border border-white/20" />
            ) : (
              <div className="h-8 w-8 rounded-full bg-blue-600 flex items-center justify-center text-xs border border-white/20">{reel.event.club?.name?.charAt(0) || 'C'}</div>
            )}
            {reel.event.club?.name || 'Club Name'}
          </Link>
          <p className="text-white font-semibold text-sm drop-shadow-md">{reel.event.title}</p>
          <p className="text-white/80 text-xs mt-1.5 line-clamp-2 drop-shadow-md">{reel.event.description}</p>
        </div>
        <div className="flex flex-col items-center gap-5 pb-2">
          <button 
            onClick={() => setLiked(!liked)} 
            className="flex flex-col items-center group transition-transform hover:scale-110"
          >
            <div className={`p-2 rounded-full ${liked ? 'bg-red-500/20' : 'bg-white/10 group-hover:bg-white/20'} transition`}>
              <Heart className={`h-7 w-7 ${liked ? 'text-red-500 fill-red-500' : 'text-white'}`} />
            </div>
            <span className="text-white text-xs mt-1 font-medium">{liked ? (reel.event.likes_count || 0) + 1 : (reel.event.likes_count || 0)}</span>
          </button>
          
          <Link to={`/events/${reel.event._id}`} className="flex flex-col items-center group transition-transform hover:scale-110">
            <div className="p-2 bg-white/10 rounded-full group-hover:bg-white/20 transition">
              <Info className="h-7 w-7 text-white" />
            </div>
            <span className="text-white text-xs mt-1 font-medium">Info</span>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Reels;
