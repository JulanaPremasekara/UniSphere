import { useLocalSearchParams, useRouter } from 'expo-router';
import { ChevronLeft, Calendar, Clock, MapPin, MoreVertical, ExternalLink, CheckCheckIcon, VerifiedIcon, CheckCircle2 } from 'lucide-react-native';
import { Modal } from 'react-native';

import React, { useState, useEffect } from 'react';
import { Image, SafeAreaView, ScrollView, Text, TouchableOpacity, View, Platform, ActivityIndicator, Alert } from 'react-native';
import Footer from '../components/Footer';
import apiClient from '../services/api';

// Define the interface to avoid TypeScript errors
interface EventData {
  title: string;
  startDate: string;
  endDate: string;
  location: string;
  organizerName: string;
  description: string;
  tags: string[];
  image?: string;
}

export default function EventDetail() {
  const { id } = useLocalSearchParams();
  const router = useRouter();
  
  const [event, setEvent] = useState<EventData | null>(null);
  const [loading, setLoading] = useState(true);
  const [isRegistered, setIsRegistered] = useState(false);
  const [registering, setRegistering] = useState(false);
  const [confirmModalVisible, setConfirmModalVisible] = useState(false);


  // 1. Fetch event details and check registration from backend on mount
  useEffect(() => {
    fetchEventDetails();
  }, [id]);

  const fetchEventDetails = async () => {
    try {
      setLoading(true);
      const response = await apiClient.get(`/events/${id}`);
      if (response.data.success) {
        setEvent(response.data.event);
        
        // Check if current user is already in registrants
        const userRes = await apiClient.get('/users/me');
        const registrants = response.data.event.registrants || [];
        if (userRes.data.success && registrants.includes(userRes.data.user._id)) {
          setIsRegistered(true);
        }
      }
    } catch (error) {
      console.error("Error fetching event details:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleRegister = async () => {
    if (isRegistered || registering) return;
    setConfirmModalVisible(true);
  };

  const performRegistration = async () => {
    try {
      setConfirmModalVisible(false);
      setRegistering(true);
      const response = await apiClient.post(`/events/${id}/register`);
      if (response.data.success) {
        setIsRegistered(true);
      }
    } catch (error: any) {
      console.error("Registration error:", error);
      const msg = error.response?.data?.message || "Could not register for event";
      Alert.alert("Error", msg);
    } finally {
      setRegistering(false);
    }
  };


  if (loading) {
    return (
      <View className="flex-1 justify-center items-center bg-white">
        <ActivityIndicator size="large" color="#4F46E5" />
      </View>
    );
  }

  if (!event) {
    return (
      <View className="flex-1 justify-center items-center">
        <Text>Event not found.</Text>
        <TouchableOpacity onPress={() => router.back()} className="mt-4 bg-indigo-600 px-6 py-2 rounded-full">
          <Text className="text-white">Go Back</Text>
        </TouchableOpacity>
      </View>
    );
  }

  // Helper to format dates
  const start = new Date(event.startDate);
  const end = new Date(event.endDate);
  const day = start.getDate();
  const month = start.toLocaleString('en-US', { month: 'short' }).toUpperCase();

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: '#fff' }}>
      {/* Header Navigation */}
      <View 
        className="flex-row justify-between items-center px-6 bg-white" 
        style={{ paddingTop: Platform.OS === 'ios' ? 60 : 50, paddingBottom: 15 }}
      >
        <TouchableOpacity onPress={() => router.back()}>
          <ChevronLeft color="#000" size={28} />
        </TouchableOpacity>
        <Text className="text-xl font-bold text-indigo-900">UniSphere</Text>
        <TouchableOpacity></TouchableOpacity>
      </View>

      <ScrollView className="flex-1" showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingBottom: 120 }}>
        {/* Event Image Card */}
        <View className="px-4 mt-4">
          <View className="relative h-64 w-full rounded-[40px] overflow-hidden bg-indigo-900 shadow-lg">
            <Image 
              source={{ uri: event.image || 'https://images.unsplash.com/photo-1635070041078-e363dbe005cb' }} 
              className="absolute inset-0 opacity-70 w-full h-full" 
            />
            <View className="flex-1 items-center justify-center">
              <MapPin color="white" size={32} />
              <View className="bg-white/20 px-4 py-2 mt-4 rounded-xl border border-white/30">
                <Text className="text-white font-bold tracking-widest text-center">{day} {month}</Text>
              </View>
            </View>
          </View>
        </View>

        {/* Title & Host */}
        <View className="px-6 mt-6">
          <Text className="text-3xl font-black text-gray-900 leading-tight">{event.title}</Text>
          <View className="flex-row items-center mt-2">
            <VerifiedIcon color="#4F46E5" size={18} /><Text className="text-gray-600 font-medium ml-2">Hosted by {event.organizerName}</Text>
          </View>
        </View>  

        {/* Details Info Boxes */}
        <View className="mx-6 mt-8 bg-gray-100/60 p-6 rounded-[35px]">
          <View className="flex-row items-center">
            <View className="bg-white p-3 rounded-2xl shadow-sm"><Calendar color= "#4F46E5"size={20} /></View>
            <View className="ml-4">
              <Text className="text-gray-400 text-[10px] font-bold uppercase">Start Time</Text>
              <Text className="text-gray-900 font-bold">{start.toLocaleString()}</Text>
            </View>
          </View>
          <View className="flex-row items-center pt-4 mt-4 border-t border-gray-200/50">
            <View className="bg-white p-3 rounded-2xl shadow-sm"><Clock color="#4F46E5" size={20} /></View>
            <View className="ml-4">
              <Text className="text-gray-400 text-[10px] font-bold uppercase">End Time</Text>
              <Text className="text-gray-900 font-bold">{end.toLocaleString()}</Text>
            </View>
          </View>
        </View>

        {/* Venue Info Box */}
        <View className="mx-6 mt-4 bg-gray-100/60 p-6 rounded-[35px]">
          <View className="flex-row items-center">
            <View className="bg-white p-3 rounded-2xl shadow-sm"><MapPin color="#4F46E5" size={20} /></View>
            <View className="ml-4 flex-1">
              <Text className="text-gray-400 text-[10px] font-bold uppercase">Venue</Text>
              <Text className="text-gray-900 font-bold">{event.location}</Text>
            </View>
          </View>
        </View>

        {/* About the Event */}
        <View className="px-6 mt-8">
          <Text className="text-xl font-bold text-gray-900">About the Event</Text>
          <Text className="text-gray-600 mt-3 leading-6 text-[15px]">{event.description}</Text>
        </View>

        {/* Tags */}
        <View className="flex-row flex-wrap px-6 mt-6">
          {event.tags?.map((tag, index) => (
            <View key={index} className="bg-indigo-100 px-5 py-2 rounded-full mr-2 mb-2">
              <Text className="text-indigo-700 text-xs font-bold">{tag}</Text>
            </View>
          ))}
        </View>
      </ScrollView>

      {/* RSVP Button */}
      <View className="absolute bottom-28 left-0 right-0 px-6">
        <TouchableOpacity 
          onPress={handleRegister}
          disabled={isRegistered || registering}
          className={`${isRegistered ? 'bg-emerald-600' : 'bg-indigo-700'} py-5 rounded-[30px] flex-row items-center justify-center`}
        >
          {isRegistered && <CheckCheckIcon color="white" size={20} className="mr-2" />}
          <Text className="text-white font-black text-lg">
            {registering ? 'Registering...' : isRegistered ? 'Registered' : 'RSVP / Register'}
          </Text>
        </TouchableOpacity>
      </View>
      <Footer />

      {/* CUSTOM REGISTRATION CONFIRMATION MODAL */}
      <Modal
        animationType="fade"
        transparent={true}
        visible={confirmModalVisible}
        onRequestClose={() => setConfirmModalVisible(false)}
      >
        <TouchableOpacity 
          activeOpacity={1} 
          onPress={() => setConfirmModalVisible(false)} 
          className="flex-1 bg-black/60 justify-center items-center px-6"
        >
          <View className="bg-white rounded-[40px] w-full max-w-sm p-8 shadow-2xl items-center">
            <View className="bg-indigo-50 p-6 rounded-full mb-6">
              <CheckCircle2 size={40} color="#4F46E5" />
            </View>
            <Text className="text-2xl font-black text-gray-900 mb-2">Confirm Attendance?</Text>
            <Text className="text-gray-500 text-center text-lg mb-8 leading-relaxed">
              Are you sure you want to register for "{event.title}"? Your attendance will be confirmed.
            </Text>
            
            <View className="flex-row gap-4 w-full">
              <TouchableOpacity 
                onPress={() => setConfirmModalVisible(false)}
                className="flex-1 bg-gray-50 p-5 rounded-3xl"
              >
                <Text className="text-gray-900 font-bold text-center text-lg">Cancel</Text>
              </TouchableOpacity>
              
              <TouchableOpacity 
                onPress={performRegistration}
                className="flex-1 bg-indigo-600 p-5 rounded-3xl shadow-lg shadow-indigo-200"
              >
                <Text className="text-white font-bold text-center text-lg">Register</Text>
              </TouchableOpacity>
            </View>
          </View>
        </TouchableOpacity>
      </Modal>
    </SafeAreaView>
  );
}