import { useQuery } from '@tanstack/react-query';
import apiClient from '@/services/api';

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

const formatEvent = (ev: any, currentUserId?: string): Event => ({
  id: ev._id,
  title: ev.title,
  month: new Date(ev.startDate).toLocaleString('en-US', { month: 'short' }).toUpperCase(),
  day: new Date(ev.startDate).getDate().toString(),
  location: ev.location,
  organizer: ev.organizerName || 'Campus Event',
  isMine: currentUserId ? ev.organizer === currentUserId : false,
  image: ev.image,
});

const fetchEvents = async (type: 'all' | 'mine' | 'registrations') => {
  const [userRes, eventsRes] = await Promise.all([
    apiClient.get('/users/me').catch(() => ({ data: { user: null } })),
    apiClient.get(type === 'registrations' ? '/events/me/registrations' : '/events'),
  ]);

  const currentUserId = userRes.data.user?._id;
  const fetchedEvents = eventsRes.data.events || [];

  let processed: Event[] = fetchedEvents.map((ev: any) =>
    formatEvent(ev, currentUserId)
  );

  if (type === 'mine') {
    processed = processed.filter((ev) => ev.isMine);
  }

  return processed;
};

export const useEvents = (type: 'all' | 'mine' | 'registrations' = 'all') => {
  const { data, isLoading, error, refetch } = useQuery({
    queryKey: ['events', type],
    queryFn: () => fetchEvents(type),
  });

  return {
    events: data ?? [],
    loading: isLoading,
    error: error ? (error as any).message : null,
    refreshEvents: refetch,
  };
};
