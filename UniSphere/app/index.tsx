import React, { useEffect, useState } from 'react';
import { View, Text, TextInput, ScrollView, TouchableOpacity, Image, ActivityIndicator } from 'react-native';
import { Search, ShoppingBasket, Users, Calendar, GraduationCap, UtensilsCrossed, Map as MapIcon, Bookmark, BookOpen, HomeIcon, HelpCircle } from 'lucide-react-native';
import { useRouter } from 'expo-router';
import Footer from './components/Footer';
import { useEvents } from '../hooks/useEvents';
import AppHeader from "./components/AppHeader";
import { AppStorage } from './services/storage';
import { Modal } from 'react-native';

// Defined routes inside the category object for cleaner navigation logic
const categories = [
  { name: 'Marketplace', icon: ShoppingBasket, color: '#EEF2FF', iconColor: '#4338CA', route: '/marketplace' },
  { name: 'Study Groups', icon: Users, color: '#F5F3FF', iconColor: '#5B21B6', route: '/studyGroup' },
  { name: 'Events', icon: Calendar, color: '#F0F9FF', iconColor: '#0369A1', route: '/events' },
  { name: 'Lost &\n Found', icon: HelpCircle, color: '#FFF7ED', iconColor: '#C2410C', route: '/lost' },
  { name: 'Housing', icon: HomeIcon, color: '#ECFDF5', iconColor: '#047857', route: '/housing' },
  { name: 'Tutors', icon: BookOpen, color: '#FEF2F2', iconColor: '#B91C1C', route: '/tutors' },
];

export default function Home() {
  const router = useRouter();
  const { events, loading } = useEvents();
  const [showWelcome, setShowWelcome] = useState(false);

  useEffect(() => {
    const checkUser = async () => {
      const token = await AppStorage.getItem("userToken");
      if (!token) {
        setShowWelcome(true);
        setTimeout(() => {
          setShowWelcome(false);
          router.replace("/login");
        }, 3000);
      }
    };
    checkUser();
  }, []);

  const renderHeader = () => (
    <View>
      <AppHeader title="UniSphere" subtitle="Campus Connection" />
    </View>
  );

  const FeaturedEventCard = ({ event, onPress }: any) => (
    <TouchableOpacity 
      onPress={onPress} 
      activeOpacity={0.9} 
      className="w-[300px] bg-white rounded-[35px] border border-gray-100 shadow-sm mr-5 overflow-hidden"
    >
      <Image 
        source={{ uri: event.image || 'https://images.unsplash.com/photo-1501281668745-f7f57925c3b4?q=80&w=1000' }} 
        className="w-full h-48" 
      />
      <View className="p-5">
        <View className="flex-row justify-between items-center mb-2">
          <View className="bg-indigo-100 px-3 py-1 rounded-full">
            <Text className="text-indigo-600 text-[10px] font-bold uppercase tracking-wider">
              {event.month} {event.day}
            </Text>
          </View>
          <Bookmark size={18} color="#4338CA" />
        </View>
        <Text className="text-lg font-bold text-gray-900 mb-1" numberOfLines={1}>{event.title}</Text>
        <Text className="text-gray-500 text-xs leading-4" numberOfLines={2}>
          Hosted by {event.organizer} • {event.location}
        </Text>
      </View>
    </TouchableOpacity>
  );

  return (
    <View className="flex-1 bg-white">
      {renderHeader()}
      
      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingTop: 8, paddingBottom: 30 }}>
        {/* Search Bar */}
        <View className="px-6 mt-2">
          <View className="flex-row items-center bg-gray-100 rounded-full px-5 h-14">
            <Search size={20} color="#9CA3AF" />
            <TextInput 
              placeholder="Find courses, events, or groups..." 
              className="flex-1 ml-3 text-gray-600 text-base" 
              placeholderTextColor="#9CA3AF" 
            />
          </View>
        </View>

        {/* Categories Grid */}
        <View className="flex-row flex-wrap justify-between px-5 mt-5">
          {categories.map((item, index) => (
            <TouchableOpacity 
              key={index} 
              style={{ backgroundColor: item.color }}
              onPress={() => router.push(item.route as any)}
              className="w-[47%] aspect-square rounded-[40px] items-center justify-center mb-4"
            >
              <View className="bg-white p-3 rounded-2xl mb-2 shadow-sm">
                <item.icon size={29} color={item.iconColor} />
              </View>
              <Text className="font-bold text-gray-800 text-[14px] text-center px-2 leading-[16px]">
                {item.name}
              </Text>
            </TouchableOpacity>
          ))}
        </View>

        {/* Featured Events Header */}
        <View className="px-6 flex-row justify-between items-end mt-8 mb-4">
          <Text className="text-2xl font-bold text-gray-900">Featured Events</Text>
          <TouchableOpacity onPress={() => router.push('/events')}>
            <Text className="text-indigo-600 font-bold text-base">View all</Text>
          </TouchableOpacity>
        </View>

        {/* Horizontal Events Scroll */}
        <ScrollView 
          horizontal 
          showsHorizontalScrollIndicator={false} 
          className="mt-2 pl-6" 
          contentContainerStyle={{ paddingRight: 24 }}
        >
          {loading ? (
            <ActivityIndicator size="large" color="#4338CA" className="py-10" />
          ) : (
            events.slice(0, 5).map((event: any) => (
              <FeaturedEventCard 
                key={event.id} 
                event={event} 
                onPress={() => router.push(`/events/${event.id}`)} 
              />
            ))
          )}
          
          {!loading && events.length === 0 && (
            <View className="w-[300px] h-64 bg-gray-50 rounded-[35px] border border-dashed border-gray-200 items-center justify-center">
              <Calendar size={32} color="#9CA3AF" />
              <Text className="text-gray-400 font-bold mt-2">No featured events</Text>
            </View>
          )}
        </ScrollView>
      </ScrollView>

      <Footer />
      
      <Modal visible={showWelcome} animationType="fade" transparent={false}>
        <View className="flex-1 bg-indigo-600 items-center justify-center px-10">
          <View className="bg-white/20 p-8 rounded-full mb-8">
            <GraduationCap size={80} color="white" strokeWidth={1.5} />
          </View>
          <Text className="text-4xl font-black text-white text-center mb-4">
            Welcome to UniSphere
          </Text>
          <Text className="text-indigo-100 text-center text-lg leading-relaxed font-medium">
            Your all-in-one campus hub for events, marketplace, and community connections.
          </Text>
          <View className="absolute bottom-20">
            <ActivityIndicator color="white" size="large" />
            <Text className="text-indigo-200 mt-4 font-bold uppercase tracking-widest text-xs text-center">
              Getting things ready...
            </Text>
          </View>
        </View>
      </Modal>
    </View>
  );
}