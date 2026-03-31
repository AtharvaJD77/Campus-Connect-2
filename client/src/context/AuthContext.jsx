import React, { createContext, useState, useEffect, useContext } from 'react';
import api from '../utils/api';

const AuthContext = createContext();

export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Check if user is logged in on mount
    const fetchUser = async () => {
      const token = localStorage.getItem('token');
      if (token) {
        try {
          const res = await api.get('/auth/profile');
          setUser(res.data);
        } catch (error) {
          console.error('Error fetching profile', error);
          localStorage.removeItem('token');
        }
      }
      setLoading(false);
    };

    fetchUser();
  }, []);

  const login = async (email, password) => {
    const res = await api.post('/auth/login', { email, password });
    localStorage.setItem('token', res.data.token);
    setUser(res.data);
    return res.data;
  };

  const register = async (name, email, password, role) => {
    const res = await api.post('/auth/register', { name, email, password, role });
    localStorage.setItem('token', res.data.token);
    setUser(res.data);
    return res.data;
  };

  const logout = () => {
    localStorage.removeItem('token');
    setUser(null);
  };

  const updateFollowedClubs = (clubId, isFollowing) => {
    setUser(prev => {
      if (!prev) return prev;
      let newFollows = [...(prev.followedClubs || [])];
      if (isFollowing) {
        if (!newFollows.includes(clubId)) newFollows.push(clubId);
      } else {
        newFollows = newFollows.filter(id => id !== clubId);
      }
      return { ...prev, followedClubs: newFollows };
    });
  };

  return (
    <AuthContext.Provider value={{ user, login, register, logout, loading, updateFollowedClubs }}>
      {!loading && children}
    </AuthContext.Provider>
  );
};
