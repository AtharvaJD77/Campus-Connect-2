import { useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import api from '../utils/api';
import { Users, Building, Mail } from 'lucide-react';

const ClubCard = ({ club, onManageProfile, onManageMedia }) => {
  const { user, updateFollowedClubs } = useAuth();
  const [isFollowing, setIsFollowing] = useState(
    user?.followedClubs?.includes(club._id) || false
  );
  const [followersCount, setFollowersCount] = useState(club.followersCount || 0);
  const [loading, setLoading] = useState(false);

  const handleFollow = async () => {
    setLoading(true);
    try {
      if (isFollowing) {
        await api.post(`/followers/club/${club._id}/unfollow`);
        setIsFollowing(false);
        setFollowersCount(prev => Math.max(0, prev - 1));
        if (updateFollowedClubs) updateFollowedClubs(club._id, false);
      } else {
        await api.post(`/followers/club/${club._id}/follow`);
        setIsFollowing(true);
        setFollowersCount(prev => prev + 1);
        if (updateFollowedClubs) updateFollowedClubs(club._id, true);
      }
    } catch (error) {
      console.error('Follow error:', error);
      // Auto-correct if backend says already following/not following
      if (error.response?.status === 400) {
        if (error.response.data.message.includes('already following')) {
           setIsFollowing(true);
           if (updateFollowedClubs) updateFollowedClubs(club._id, true);
        } else if (error.response.data.message.includes('not following')) {
           setIsFollowing(false);
           if (updateFollowedClubs) updateFollowedClubs(club._id, false);
        }
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-white dark:bg-slate-800 rounded-2xl p-6 shadow-sm border border-gray-100 dark:border-slate-700 hover:shadow-md transition-shadow flex flex-col h-full group text-center cursor-pointer hover:-translate-y-1">
      <Link to={`/clubs/${club._id}`} className="flex flex-col flex-grow items-center outline-none">
        <div className="mx-auto rounded-full h-20 w-20 mb-4 bg-gray-50 dark:bg-slate-700 flex items-center justify-center border-4 border-white dark:border-slate-800 shadow-sm overflow-hidden transform group-hover:scale-105 transition-transform">
          {club.logo ? (
            <img src={club.logo} alt={club.name} className="h-full w-full object-cover" />
          ) : (
            <Users className="h-8 w-8 text-primary-400" />
          )}
        </div>
        
        <h3 className="text-xl font-bold text-gray-900 dark:text-white group-hover:text-primary-600 transition-colors">{club.name}</h3>
        <div className="flex items-center justify-center text-xs text-gray-500 dark:text-gray-400 mt-2 mb-4 space-x-3">
          <span className="flex items-center"><Building className="h-3 w-3 mr-1" /> {club.college}</span>
          <span className="flex items-center w-max bg-primary-50 dark:bg-primary-900/30 text-primary-700 dark:text-primary-300 px-2 py-0.5 rounded-full font-semibold">
            {followersCount} {followersCount === 1 ? 'Follower' : 'Followers'}
          </span>
        </div>
        
        <p className="text-sm text-gray-600 dark:text-gray-300 mb-6 flex-grow line-clamp-3">
          {club.description}
        </p>
      </Link>
      
      {user?.role === 'Student' && (
        <button
          onClick={handleFollow}
          disabled={loading}
          className={`w-full py-2.5 rounded-xl text-sm font-bold shadow-sm transition-all focus:ring-4 focus:ring-primary-100 ${
            isFollowing 
              ? 'bg-gray-100 dark:bg-slate-700 text-gray-700 dark:text-gray-200 hover:bg-red-50 dark:hover:bg-red-900/20 hover:text-red-600 dark:hover:text-red-400 hover:border-red-200 dark:hover:border-red-800 border border-gray-200 dark:border-slate-600' 
              : 'bg-primary-600 dark:bg-primary-700 hover:bg-primary-700 dark:hover:bg-primary-800 text-white hover:shadow'
          }`}
        >
          {loading ? 'Processing...' : (isFollowing ? 'Unfollow' : 'Follow')}
        </button>
      )}
      
      {user?.role === 'ClubAdmin' && user._id === club.createdBy && (
        <div className="flex gap-2">
          <button 
            onClick={onManageProfile}
            className="flex-1 py-2.5 rounded-xl text-sm font-bold bg-primary-50 dark:bg-primary-900/30 text-primary-700 dark:text-primary-300 hover:bg-primary-100 dark:hover:bg-primary-800 transition-colors"
          >
            Edit Profile
          </button>
          <button 
            onClick={onManageMedia}
            className="flex-1 py-2.5 rounded-xl text-sm font-bold bg-pink-50 dark:bg-pink-900/30 text-pink-700 dark:text-pink-300 hover:bg-pink-100 dark:hover:bg-pink-800 transition-colors"
          >
            Manage Media
          </button>
        </div>
      )}
    </div>
  );
};

export default ClubCard;
