import { useState, useEffect, useCallback } from 'react';
import apiClient from '../app/services/api';

export interface Event {
  id: string;
  title: string;
  month: string;
  day: string;
  location: string;
  organizer: string;
  isMine: boolean;
  image?: string;
}

export const useEvents = (type: 'all' | 'mine' | 'registrations' = 'all') => {
  const [events, setEvents] = useState<Event[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const formatEvent = (ev: any, currentUserId?: string): Event => ({
    id: ev._id,
    title: ev.title,
    month: new Date(ev.startDate).toLocaleString('en-US', { month: 'short' }).toUpperCase(),
    day: new Date(ev.startDate).getDate().toString(),
    location: ev.location,
    organizer: ev.organizerName || 'Campus Event',
    isMine: currentUserId ? ev.organizer === currentUserId : false,
    image: ev.image
  });


  const fetchEvents = useCallback(async () => {
    try {
      setLoading(true);
      const [userRes, eventsRes] = await Promise.all([
        apiClient.get('/users/me').catch(() => ({ data: { user: null } })),
        apiClient.get(type === 'registrations' ? '/events/me/registrations' : '/events')
      ]);

      const currentUserId = userRes.data.user?._id;
      const fetchedEvents = eventsRes.data.events || [];

      let processedEvents = fetchedEvents.map((ev: any) => formatEvent(ev, currentUserId));

      if (type === 'mine') {
        processedEvents = processedEvents.filter((ev: any) => ev.isMine);
      }

      setEvents(processedEvents);
      setError(null);
    } catch (err: any) {
      setError(err.message || 'Failed to fetch events');
    } finally {
      setLoading(false);
    }
  }, [type]);

  useEffect(() => {
    fetchEvents();
  }, [fetchEvents]);

  return { events, loading, error, refreshEvents: fetchEvents };
};
