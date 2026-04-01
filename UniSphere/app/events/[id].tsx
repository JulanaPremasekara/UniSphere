import { useLocalSearchParams, useRouter } from 'expo-router';
import { ChevronLeft, Calendar, Clock, MapPin, MoreVertical, ExternalLink } from 'lucide-react-native';
import React from 'react';
import { Dimensions, Image, SafeAreaView, ScrollView, Text, TouchableOpacity, View, Platform } from 'react-native';
import Footer from '../components/Footer';

// 1. Expanded Mock Data to match the UI requirements
const MOCK_EVENTS = [
  { 
    id: '1', 
    title: 'Quantum Computing', 
    month: 'OCT', 
    day: '12', 
    location: 'North Lab, Room 402', 
    organizer: 'Physics Dept',
    category: 'Science',
    image: 'https://images.unsplash.com/photo-1635070041078-e363dbe005cb?q=80&w=1000',
    description: 'Explore the fundamentals of quantum mechanics and its application in next-generation computing. Perfect for students interested in the future of processing power.'
  },
  { 
    id: '2', 
    title: 'Post-Digital Design', 
    month: 'OCT', 
    day: '15', 
    location: 'Arts Collective Studio', 
    organizer: 'Design Guild',
    category: 'Design',
    image: 'https://images.unsplash.com/photo-1558655146-d09347e92766?q=80&w=1000',
    description: 'A deep dive into how design evolves in a world saturated by digital interfaces. Join us for a hands-on workshop on tactile design elements.'
  },
  { 
    id: '3', 
    title: 'Midnight Jazz & Coffee', 
    month: 'OCT', 
    day: '18', 
    location: 'Central Atrium', 
    organizer: 'Music Society',
    category: 'Music',
    image: 'https://images.unsplash.com/photo-1511192336575-5a79af67a629?q=80&w=1000',
    description: 'Unwind with soulful melodies and premium roasts. An evening dedicated to the appreciation of jazz and campus community vibes.'
  },
];

export default function EventDetail() {
  const { id } = useLocalSearchParams();
  const router = useRouter();
  
  // 2. Find the specific event based on ID
  const event = MOCK_EVENTS.find(e => e.id === id) || MOCK_EVENTS[0];

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: '#fff' }}>
      {/* 1. Header Navigation */}
      <View 
        className="flex-row justify-between items-center px-6 bg-white" 
        style={{ 
          paddingTop: Platform.OS === 'ios' ? 60 : 50, // This pushes it down "inches"
          paddingBottom: 15 
        }}
      >
        <TouchableOpacity onPress={() => router.back()}>
          <ChevronLeft color="#000" size={28} />
        </TouchableOpacity>
        
        <Text className="text-xl font-bold text-indigo-900">UniSphere</Text>
        
        <TouchableOpacity>
          <MoreVertical color="#000" size={24} />
        </TouchableOpacity>
      </View>

      <ScrollView 
        className="flex-1" 
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: 180 }} // Space for RSVP button & Footer
        bounces={true}
      >
        {/* Event Image Card */}
        <View className="px-4 mt-4">
          <View className="relative h-64 w-full rounded-[40px] overflow-hidden bg-indigo-900 shadow-lg">
            <Image 
              source={{ uri: event.image }} 
              className="absolute inset-0 opacity-70 w-full h-full" 
            />
            <View className="absolute top-4 left-6 bg-indigo-600 px-3 py-1 rounded-full">
              <Text className="text-white text-[10px] font-bold uppercase tracking-wider">{event.category}</Text>
            </View>
            <View className="flex-1 items-center justify-center">
              <MapPin color="white" size={32} />
              <View className="bg-white/20 px-4 py-2 mt-4 rounded-xl border border-white/30">
                <Text className="text-white font-bold tracking-widest text-center">{event.day} {event.month}</Text>
              </View>
            </View>
          </View>
        </View>

        {/* Title & Host */}
        <View className="px-6 mt-6">
          <Text className="text-3xl font-black text-gray-900 leading-tight">
            {event.title}
          </Text>
          <View className="flex-row items-center mt-2">
            <View className="bg-indigo-600 rounded-full p-1 mr-2">
               <View className="w-4 h-4 items-center justify-center">
                  <Text className="text-white text-[8px]">✓</Text>
               </View>
            </View>
            <Text className="text-gray-600 font-medium">Hosted by {event.organizer}</Text>
          </View>
        </View>

        {/* Details Info Boxes */}
        <View className="mx-6 mt-8 bg-gray-100/60 p-6 rounded-[35px]">
          <View className="flex-row items-center">
            <View className="bg-white p-3 rounded-2xl shadow-sm"><Calendar color="#4F46E5" size={20} /></View>
            <View className="ml-4">
              <Text className="text-gray-400 text-[10px] font-bold uppercase tracking-tighter">Start Time</Text>
              <Text className="text-gray-900 font-bold">{event.month} {event.day}, 2026 • 10:00 AM</Text>
            </View>
          </View>
          <View className="flex-row items-center pt-4 mt-4 border-t border-gray-200/50">
            <View className="bg-white p-3 rounded-2xl shadow-sm"><Clock color="#4F46E5" size={20} /></View>
            <View className="ml-4">
              <Text className="text-gray-400 text-[10px] font-bold uppercase tracking-tighter">End Time</Text>
              <Text className="text-gray-900 font-bold">{event.month} {event.day}, 2026 • 02:00 PM</Text>
            </View>
          </View>
        </View>

        {/* Venue Info Box */}
        <View className="mx-6 mt-4 bg-gray-100/60 p-6 rounded-[35px]">
          <View className="flex-row items-center">
            <View className="bg-white p-3 rounded-2xl shadow-sm"><MapPin color="#4F46E5" size={20} /></View>
            <View className="ml-4 flex-1">
              <Text className="text-gray-400 text-[10px] font-bold uppercase tracking-tighter">Venue</Text>
              <Text className="text-gray-900 font-bold">{event.location}</Text>
              <Text className="text-gray-500 text-xs">University Campus</Text>
            </View>
          </View>
          <TouchableOpacity className="mt-4 flex-row items-center ml-14">
            <Text className="text-indigo-600 font-bold text-xs mr-1">View Map</Text>
            <ExternalLink color="#4F46E5" size={12} />
          </TouchableOpacity>
        </View>

        {/* About the Event */}
        <View className="px-6 mt-8">
          <Text className="text-xl font-bold text-gray-900">About the Event</Text>
          <Text className="text-gray-600 mt-3 leading-6 text-[15px]">
            {event.description}
            {"\n\n"}
            Requirements: Please bring your university ID card for entry. Digital notes are encouraged.
          </Text>
        </View>

        {/* Action Tags */}
        <View className="flex-row flex-wrap px-6 mt-6 pb-20">
          <View className="bg-indigo-100 px-5 py-2 rounded-full mr-2 mb-2">
            <Text className="text-indigo-700 text-xs font-bold">Registration Open</Text>
          </View>
          <View className="bg-gray-200 px-5 py-2 rounded-full mr-2 mb-2">
            <Text className="text-gray-600 text-xs font-bold">Limited Seats</Text>
          </View>
        </View>
      </ScrollView>

      {/* RSVP Button (Floating above Footer) */}
      <View
        className="absolute bottom-28 left-0 right-0 px-6"
        >
        <TouchableOpacity
            className="bg-indigo-700 flex-row items-center justify-center py-5 rounded-[30px]"
            activeOpacity={0.8}
        >
            <Text className="text-white font-black text-lg mr-2">
            RSVP / Register
            </Text>
        </TouchableOpacity>
        </View>
      <Footer />
    </SafeAreaView>
  );
}