 import { useState, useEffect } from 'react';
import apiClient from '../app/services/api';

export const useUser = () => {
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchUser = async () => {
    try {
      setLoading(true);
      const res = await apiClient.get('/users/me');
      setUser(res.data.user);
      setError(null);
    } catch (err: any) {
      setError(err.message || 'Failed to fetch user');
      setUser(null);
    } finally {
      setLoading(false);
    }
  };

  const getuserById = async (id:string) => {
    try{
      setLoading(true);
      const res = await apiClient.get(`/users/${id}`);
      setError(null);
      return res.data.user;
    }catch{
      setError("Failed to fetch user by ID");
      setUser(null);
    }finally{
      setLoading(false);
    }
  };

  useEffect(() => {
    
    fetchUser();
  }, []);

  return { user, userId: user?._id, loading, error, refreshUser: fetchUser,getuserById };
};
