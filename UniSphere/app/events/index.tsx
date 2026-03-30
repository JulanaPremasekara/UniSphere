import React, { useState } from 'react';
import { View, Text, TouchableOpacity, ScrollView, Platform, Alert } from 'react-native';
import { useRouter } from 'expo-router';
import { Calendar, Search, Plus } from 'lucide-react-native';
import EventCard from '../components/EventCard';
import Footer from '../components/Footer';

export default function Home() {
  const router = useRouter();
  const [activeFilter, setActiveFilter] = useState('All');
  
  // Use state for events so we can delete them
  const [events, setEvents] = useState([
    { id: '1', title: 'Quantum Computing', month: 'OCT', day: '12', location: 'North Lab, Room 402', organizer: 'Physics Dept', isMine: true },
    { id: '2', title: 'Post-Digital Design', month: 'OCT', day: '15', location: 'Arts Collective Studio', organizer: 'Design Guild', isMine: false },
    { id: '3', title: 'Midnight Jazz & Coffee', month: 'OCT', day: '18', location: 'Central Atrium', organizer: 'Music Society', isMine: false },
  ]);

  const handleDelete = (id: string) => {
    Alert.alert("Delete Event", "Are you sure you want to remove this event?", [
      { text: "Cancel", style: "cancel" },
      { 
        text: "Delete", 
        style: "destructive", 
        onPress: () => setEvents(prev => prev.filter(ev => ev.id !== id)) 
      }
    ]);
  };

  const handleEdit = (id: string) => {
    // Navigate to the create page but pass the ID to turn it into "Edit Mode"
    router.push({ pathname: '/events/create', params: { editId: id } });
  };

  const filteredEvents = events.filter(event => {
    if (activeFilter === 'All') return true;
    if (activeFilter === 'Mine') return event.isMine;
    if (activeFilter === 'Others') return !event.isMine;
    return true;
  });

  return (
    <View className="flex-1 bg-gray-50">
      <View className="px-6 pb-4 bg-white" style={{ paddingTop: Platform.OS === 'ios' ? 60 : 50 }}>
        <View className="flex-row justify-between items-center">
          <View className="flex-row items-center">
            <Calendar size={28} color="#4F46E5" />
            <Text className="text-2xl font-bold ml-2 text-indigo-900">UniSphere</Text>
          </View>
          <TouchableOpacity className="bg-gray-100 p-2 rounded-full">
            <Search size={22} color="#6B7280" />
          </TouchableOpacity>
        </View>
      </View>

      {/* Filter Tabs */}
      <View className="bg-white pb-4 px-6 border-b border-gray-100">
        <ScrollView horizontal showsHorizontalScrollIndicator={false}>
          {['All', 'Mine', 'Others'].map((f) => (
            <TouchableOpacity
              key={f}
              onPress={() => setActiveFilter(f)}
              className={`mr-3 px-6 py-2 rounded-full ${activeFilter === f ? 'bg-indigo-600' : 'bg-gray-100'}`}
            >
              <Text className={`font-bold ${activeFilter === f ? 'text-white' : 'text-gray-500'}`}>
                {f === 'Mine' ? 'My Events' : f === 'Others' ? 'By Others' : 'All Events'}
              </Text>
            </TouchableOpacity>
          ))}
        </ScrollView>
      </View>

      <ScrollView className="flex-1 px-6" contentContainerStyle={{ paddingBottom: 120 }}>
        <View className="mt-6 mb-4">
          <Text className="text-xl font-medium">Campus Feed</Text>
        </View>

        {filteredEvents.map(item => (
          <EventCard 
            key={item.id} 
            item={item} 
            onPress={() => router.push(`/events/${item.id}`)}
            // Pass the functions only if it's the user's event
            onEdit={item.isMine ? () => handleEdit(item.id) : undefined}
            onDelete={item.isMine ? () => handleDelete(item.id) : undefined}
          />
        ))}
      </ScrollView>

      <TouchableOpacity 
        onPress={() => router.push('/events/create')}
        className="absolute bottom-28 right-8 bg-indigo-600 w-16 h-16 rounded-full items-center justify-center shadow-lg"
      >
        <Plus color="white" size={32} />
      </TouchableOpacity>
      <Footer />
    </View>
  );
}