import React from 'react';
import { View, Text, TouchableOpacity, ScrollView, Platform, ActivityIndicator } from 'react-native';
import { useRouter } from 'expo-router';
import { Calendar, ChevronLeft } from 'lucide-react-native';
import EventCard from './components/EventCard';
import Footer from '@/components/Footer';
import { useEvents } from './hooks/useEvents';
import { useTheme } from '@/context/ThemeContext';

export default function MyRegistrations() {
  const router = useRouter();
  const { colors } = useTheme();
  const { events, loading } = useEvents('registrations');

  if (loading) return (
    <View style={{ backgroundColor: colors.bg }} className="flex-1 justify-center items-center">
      <ActivityIndicator size="large" color={colors.primary} />
    </View>
  );

  return (
    <View style={{ backgroundColor: colors.bg }} className="flex-1">
      <View
        style={{ backgroundColor: colors.bg, paddingTop: Platform.OS === 'ios' ? 70 : 60 }}
        className="flex-row items-center px-6 pb-4"
      >
        <TouchableOpacity onPress={() => router.back()} className="p-2 -ml-2">
          <ChevronLeft size={28} color={colors.text} />
        </TouchableOpacity>
        <Text style={{ color: colors.text }} className="text-xl font-bold ml-4">My Registered Events</Text>
      </View>

      <ScrollView
        style={{ backgroundColor: colors.bg }}
        className="flex-1 px-6"
        contentContainerStyle={{ paddingBottom: 120 }}
      >
        <View className="mt-6 mb-4">
          <Text style={{ color: colors.textMuted }} className="font-bold text-[11px] uppercase tracking-[2px] ml-1">
            Registered Events ({events.length})
          </Text>
        </View>

        {events.length > 0 ? events.map(item => (
          <EventCard
            key={item.id}
            item={item}
            onPress={() => router.push(`/events/${item.id}`)}
            onEdit={item.isMine ? () => router.push({ pathname: '/events/create', params: { editId: item.id } }) : undefined}
          />
        )) : (
          <View className="flex-1 items-center justify-center py-20">
            <View style={{ backgroundColor: colors.primaryLight }} className="p-8 rounded-full mb-4">
              <Calendar size={48} color={colors.primary} />
            </View>
            <Text style={{ color: colors.text }} className="text-xl font-bold mb-2">No Registrations Yet</Text>
            <Text style={{ color: colors.textSecondary }} className="text-center px-10">
              You haven't registered for any events. Browse the campus feed and join some events!
            </Text>
            <TouchableOpacity
              onPress={() => router.push('/events')}
              style={{ backgroundColor: colors.primary }}
              className="mt-8 px-8 py-4 rounded-3xl"
            >
              <Text className="text-white font-bold">Discover Events</Text>
            </TouchableOpacity>
          </View>
        )}
      </ScrollView>
      <Footer />
    </View>
  );
}
