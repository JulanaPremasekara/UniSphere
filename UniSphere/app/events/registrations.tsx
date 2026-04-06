import React, { useEffect, useState } from 'react';
import { View, Text, TouchableOpacity, ScrollView, Platform, ActivityIndicator, Alert } from 'react-native';
import { useRouter } from 'expo-router';
import { Calendar, ChevronLeft } from 'lucide-react-native';
import EventCard from '../components/EventCard';
import Footer from '../components/Footer';
import apiClient from '../services/api';

export default function MyRegistrations() {
  const router = useRouter();
  const [events, setEvents] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => { fetchRegistrations(); }, []);

  const fetchRegistrations = async () => {
    try {
      setLoading(true);
      const { data: { user } } = await apiClient.get('/users/me');
      const { data: { success, events: fetchedEvents } } = await apiClient.get('/events/me/registrations');

      if (success) {
        setEvents(fetchedEvents.map((ev: any) => ({
          id: ev._id, title: ev.title, month: new Date(ev.startDate).toLocaleString('en-US', { month: 'short' }).toUpperCase(),
          day: new Date(ev.startDate).getDate().toString(), location: ev.location,
          organizer: ev.organizerName || 'Campus Event', isMine: ev.organizer === user._id,
        })));
      }
    } catch { Alert.alert("Error", "Could not load your registered events."); } finally { setLoading(false); }
  };

  if (loading) return <View className="flex-1 justify-center items-center bg-white"><ActivityIndicator size="large" color="#4F46E5" /></View>;

  return (
    <View className="flex-1 bg-white">
      <View className="flex-row items-center px-6 pb-4 bg-white" style={{ paddingTop: Platform.OS === 'ios' ? 70 : 60 }}>
        <TouchableOpacity onPress={() => router.back()} className="p-2 -ml-2"><ChevronLeft size={28} color="#1E1B4B" /></TouchableOpacity>
        <Text className="text-xl font-bold ml-4 text-indigo-900">My Registered Events</Text>
      </View>

      <ScrollView className="flex-1 px-6 bg-gray-50/30" contentContainerStyle={{ paddingBottom: 120 }}>
        <View className="mt-6 mb-4"><Text className="text-gray-400 font-bold text-[11px] uppercase tracking-[2px] ml-1">Registered Events ({events.length})</Text></View>

        {events.length > 0 ? events.map(item => (
          <EventCard key={item.id} item={item} onPress={() => router.push(`/events/${item.id}`)} onEdit={item.isMine ? () => router.push({ pathname: '/events/create', params: { editId: item.id } }) : undefined} />
        )) : (
          <View className="flex-1 items-center justify-center py-20">
            <View className="bg-indigo-50 p-8 rounded-full mb-4"><Calendar size={48} color="#4F46E5" /></View>
            <Text className="text-xl font-bold text-gray-800 mb-2">No Registrations Yet</Text>
            <Text className="text-gray-500 text-center px-10">You haven't registered for any events. Browse the campus feed and join some events!</Text>
            <TouchableOpacity onPress={() => router.push('/events')} className="mt-8 bg-indigo-600 px-8 py-4 rounded-3xl"><Text className="text-white font-bold">Discover Events</Text></TouchableOpacity>
          </View>
        )}
      </ScrollView>
      <Footer />
    </View>
  );
}
