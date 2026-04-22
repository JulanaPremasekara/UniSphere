import { useState, useEffect, useCallback } from 'react';
import apiClient from '../app/services/api';
import { Alert } from 'react-native';

export const useEventDetail = (id: string | string[]) => {
  const [event, setEvent] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [isRegistered, setIsRegistered] = useState(false);
  const [registering, setRegistering] = useState(false);

  const fetchDetail = useCallback(async () => {
    if (!id) return;
    try {
      setLoading(true);
      const [{ data: evRes }, { data: userRes }] = await Promise.all([
        apiClient.get(`/events/${id}`),
        apiClient.get('/users/me').catch(() => ({ data: { success: false } }))
      ]);

      if (evRes.success) {
        setEvent(evRes.event);
        if (userRes.success && (evRes.event.registrants || []).includes(userRes.user._id)) {
          setIsRegistered(true);
        }
      }
    } catch (error) {
      console.error("Error fetching event details:", error);
    } finally {
      setLoading(false);
    }
  }, [id]);

  const register = async () => {
    try {
      setRegistering(true);
      const res = await apiClient.post(`/events/${id}/register`);
      if (res.data.success) {
        setIsRegistered(true);
        return true;
      }
    } catch (error: any) {
      Alert.alert("Error", error.response?.data?.message || "Could not register for event");
      return false;
    } finally {
      setRegistering(false);
    }
    return false;
  };

  useEffect(() => {
    fetchDetail();
  }, [fetchDetail]);

  return { event, loading, isRegistered, registering, register, refreshDetail: fetchDetail };
};
