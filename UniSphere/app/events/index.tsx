import React, { useEffect, useState } from 'react';
import { View, Text, TouchableOpacity, ScrollView, Platform, Alert, ActivityIndicator, Modal, Pressable } from 'react-native';
import { useRouter } from 'expo-router';
import { Calendar, Search, Plus, Trash2 } from 'lucide-react-native';
import EventCard from '../components/EventCard';
import Footer from '../components/Footer';
import apiClient from '../services/api';

export default function Home() {
  const router = useRouter();
  const [activeFilter, setActiveFilter] = useState('All');

  interface AppEvent {
    id: string;
    title: string;
    month: string;
    day: string;
    location: string;
    organizer: string;
    isMine: boolean;
  }

  // Use state for events so we can delete them
  {/*const [events, setEvents] = useState([
    { id: '1', title: 'Quantum Computing', month: 'OCT', day: '12', location: 'North Lab, Room 402', organizer: 'Physics Dept', isMine: true },
    { id: '2', title: 'Post-Digital Design', month: 'OCT', day: '15', location: 'Arts Collective Studio', organizer: 'Design Guild', isMine: false },
    { id: '3', title: 'Midnight Jazz & Coffee', month: 'OCT', day: '18', location: 'Central Atrium', organizer: 'Music Society', isMine: false },
  ]);*/}

  const [events, setEvents] = useState<AppEvent[]>([]); // Start with empty array
  const [loading, setLoading] = useState(true);
  const [userId, setUserId] = useState(null);
  const [deleteModalVisible, setDeleteModalVisible] = useState(false);
  const [eventToDelete, setEventToDelete] = useState<string | null>(null);
  const [loginModalVisible, setLoginModalVisible] = useState(false);


  // 1. Fetch User and Events on Mount
  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      setLoading(true);

      // Get current user details to identify "isMine"
      const userResponse = await apiClient.get('/users/me');
      const currentUserId = userResponse.data.user._id;
      setUserId(currentUserId);

      // Fetch all events
      const eventResponse = await apiClient.get('/events');

      if (eventResponse.data.success) {
        // Map backend data to the format your EventCard expects
        const formattedEvents: AppEvent[] = eventResponse.data.events.map((ev: any) => {
          const eventDate = new Date(ev.startDate);
          return {
            id: ev._id, // MongoDB uses _id, but we map it to id
            title: ev.title,
            month: eventDate.toLocaleString('en-US', { month: 'short' }).toUpperCase(),
            day: eventDate.getDate().toString(),
            location: ev.location,
            organizer: ev.organizerName || 'Campus Event',
            isMine: ev.organizer === currentUserId,
          };
        });

        setEvents(formattedEvents);
      }
    } catch (error) {
      console.error("Error fetching data:", error);
      Alert.alert("Error", "Could not load events.");
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = (id: string) => {
    setEventToDelete(id);
    setDeleteModalVisible(true);
  };

  const confirmDelete = async () => {
    if (!eventToDelete) return;

    try {
      const response = await apiClient.delete(`/events/${eventToDelete}`);
      if (response.data.success) {
        setEvents(prev => prev.filter(ev => ev.id !== eventToDelete));
      }
    } catch (err) {
      console.error("Delete Error:", err);
      Alert.alert("Error", "Failed to delete event.");
    } finally {
      setDeleteModalVisible(false);
      setEventToDelete(null);
    }
  };

  const handleEdit = (id: string) => {
    router.push({ pathname: '/events/create', params: { editId: id } });
  };

  const filteredEvents = events.filter(event => {
    if (activeFilter === 'All') return true;
    if (activeFilter === 'Mine') return event.isMine;
    if (activeFilter === 'Others') return !event.isMine;
    return true;
  });

  if (loading) {
    return (
      <View className="flex-1 justify-center items-center bg-white">
        <ActivityIndicator size="large" color="#4F46E5" />
      </View>
    );
  }

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

        {filteredEvents.length > 0 ? (
          filteredEvents.map(item => (
            <EventCard
              key={item.id}
              item={item}
              onPress={() => router.push(`/events/${item.id}`)}
              // Pass the functions only if it's the user's event
              onEdit={item.isMine ? () => handleEdit(item.id) : undefined}
              onDelete={item.isMine ? () => handleDelete(item.id) : undefined}
            />
          ))
        ) : (
          <View className="flex-1 items-center justify-center py-20">
            <View className="bg-gray-100 p-8 rounded-full mb-4">
              <Calendar size={48} color="#9CA3AF" />
            </View>
            <Text className="text-xl font-bold text-gray-800 mb-2">No Events Found</Text>
            <Text className="text-gray-500 text-center px-10">
              There are currently no events matching your criteria. Try changing the filter or create a new one!
            </Text>
          </View>
        )}
      </ScrollView>

      <TouchableOpacity
        onPress={() => {
          if (!userId) {
            setLoginModalVisible(true);
          } else {
            router.push('/events/create');
          }
        }}
        className="absolute bottom-28 right-8 bg-indigo-600 w-16 h-16 rounded-full items-center justify-center shadow-lg"
      >
        <Plus color="white" size={32} />
      </TouchableOpacity>
      <Footer />

      {/* CUSTOM DELETE CONFIRMATION MODAL */}
      <Modal
        animationType="fade"
        transparent={true}
        visible={deleteModalVisible}
        onRequestClose={() => setDeleteModalVisible(false)}
      >
        <TouchableOpacity 
          activeOpacity={1} 
          onPress={() => setDeleteModalVisible(false)} 
          className="flex-1 bg-black/60 justify-center items-center px-6"
        >
          <View className="bg-white rounded-[40px] w-full max-w-sm p-8 shadow-2xl items-center">
            <View className="bg-red-50 p-6 rounded-full mb-6">
              <Trash2 size={40} color="#EF4444" />
            </View>
            <Text className="text-2xl font-black text-gray-900 mb-2">Delete Event?</Text>
            <Text className="text-gray-500 text-center text-lg mb-8 leading-relaxed">
              This will permanently remove your curated event from the campus feed. This action cannot be undone.
            </Text>
            
            <View className="flex-row gap-4 w-full">
              <TouchableOpacity 
                onPress={() => setDeleteModalVisible(false)}
                className="flex-1 bg-gray-50 p-5 rounded-3xl"
              >
                <Text className="text-gray-900 font-bold text-center text-lg">Cancel</Text>
              </TouchableOpacity>
              
              <TouchableOpacity 
                onPress={confirmDelete}
                className="flex-1 bg-red-600 p-5 rounded-3xl shadow-lg shadow-red-200"
              >
                <Text className="text-white font-bold text-center text-lg">Delete</Text>
              </TouchableOpacity>
            </View>
          </View>
        </TouchableOpacity>
      </Modal>
      
      {/* CUSTOM LOGIN REQUIRED MODAL */}
      <Modal
        animationType="fade"
        transparent={true}
        visible={loginModalVisible}
        onRequestClose={() => setLoginModalVisible(false)}
      >
        <TouchableOpacity 
          activeOpacity={1} 
          onPress={() => setLoginModalVisible(false)} 
          className="flex-1 bg-black/60 justify-center items-center px-6"
        >
          <View className="bg-white rounded-[40px] w-full max-w-sm p-8 shadow-2xl items-center">
            <View className="bg-indigo-50 p-6 rounded-full mb-6">
              <Calendar size={40} color="#4F46E5" />
            </View>
            <Text className="text-2xl font-black text-gray-900 mb-2">Login Required</Text>
            <Text className="text-gray-500 text-center text-lg mb-8 leading-relaxed">
              Please sign in to your UniSphere account to create and share new events with the campus.
            </Text>
            
            <View className="flex-row gap-4 w-full">
              <TouchableOpacity 
                onPress={() => setLoginModalVisible(false)}
                className="flex-1 bg-gray-50 p-5 rounded-3xl"
              >
                <Text className="text-gray-900 font-bold text-center text-lg">Cancel</Text>
              </TouchableOpacity>
              
              <TouchableOpacity 
                onPress={() => {
                  setLoginModalVisible(false);
                  router.push('/login');
                }}
                className="flex-1 bg-indigo-600 p-5 rounded-3xl shadow-lg shadow-indigo-200"
              >
                <Text className="text-white font-bold text-center text-lg">Sign In</Text>
              </TouchableOpacity>
            </View>
          </View>
        </TouchableOpacity>
      </Modal>
    </View>
  );
}