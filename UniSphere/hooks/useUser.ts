 import { useQuery } from '@tanstack/react-query';
import apiClient from '@/services/api';

export const useUser = () => {
  const { data: user, isLoading, error, refetch } = useQuery({
    queryKey: ['currentUser'],
    queryFn: async () => {
      const res = await apiClient.get('/users/me');
      return res.data.user ?? null;
    },
    staleTime: 5 * 60 * 1000,
  });

  const getuserById = async (id: string) => {
    try {
      const res = await apiClient.get(`/users/${id}`);
      return res.data.user;
    } catch {
      return null;
    }
  };

  return {
    user: user ?? null,
    userId: user?._id,
    loading: isLoading,
    error: error ? (error as any).message : null,
    refreshUser: refetch,
    getuserById,
  };
};
