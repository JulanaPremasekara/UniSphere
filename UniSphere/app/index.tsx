import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, ScrollView, TouchableOpacity, Image } from 'react-native';
import { Search, ShoppingBasket, Users, Calendar, GraduationCap, UtensilsCrossed, Map as MapIcon, Bookmark, BookOpen, HomeIcon, HelpCircle } from 'lucide-react-native';
import { useRouter } from 'expo-router';

import Header from './components/Header';
import Footer from './components/Footer';
import apiClient from './services/api';

const categories = [
  { name: 'Marketplace', icon: ShoppingBasket, color: '#EEF2FF', iconColor: '#4338CA' },
  { name: 'Study Groups', icon: Users, color: '#F5F3FF', iconColor: '#5B21B6' },
  { name: 'Events', icon: Calendar, color: '#F0F9FF', iconColor: '#0369A1' },
  { name: 'Lost &\n Found', icon: HelpCircle, color: '#FFF7ED', iconColor: '#C2410C' },
  { name: 'Housing', icon: HomeIcon, color: '#ECFDF5', iconColor: '#047857' },
  { name: 'Tutor Profile', icon: BookOpen, color: '#FEF2F2', iconColor: '#B91C1C' },
];

export default function Home() {
  const router = useRouter();


  const [events, setEvents] = useState([]);
  const [currentUserId, setCurrentUserId] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        // 1. Get current user to check "isMine"
        const userRes = await apiClient.get('/users/me');
        setCurrentUserId(userRes.data.user._id);

        // 2. Get Events
        const eventRes = await apiClient.get('/events');
        
        // Transform backend data to frontend format
        const formattedEvents = eventRes.data.events.map((ev: any) => ({
          id: ev._id,
          title: ev.title,
          location: ev.location,
          organizer: ev.organizerName,
          // Extract month and day from Date string
          month: new Date(ev.startDate).toLocaleString('default', { month: 'short' }).toUpperCase(),
          day: new Date(ev.startDate).getDate().toString(),
          image: ev.image,
          isMine: ev.organizer === userRes.data.user._id
        }));

        setEvents(formattedEvents);
      } catch (err) {
        console.error(err);
      }
    };
    fetchData();
  }, []);

  return (
    
    <View className="flex-1 bg-white">
      <Header title="UniSphere" />
      <ScrollView 
        showsVerticalScrollIndicator={false} 
        contentContainerStyle={{ paddingTop: 8, paddingBottom: 30 }}
      >
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
        <View className="flex-row flex-wrap justify-between px-5 mt-5 -mb-5">
          {categories.map((item, index) => (
            <TouchableOpacity 
              key={index} 
              style={{ backgroundColor: item.color }}
              onPress={() => {
                if (item.name === 'Events') {
                  router.push('/events');
                }else if (item.name === 'Marketplace') {
                  router.push('/marketplace' as any)
                };
                // Navigation for other categories can be added when their index files are created
              }}
              className="w-[47%] aspect-square rounded-[40px] items-center justify-center mb-5"
            >

              <View className="bg-white p-3 rounded-2xl mb-2 shadow-sm">
                <item.icon size={29} color={item.iconColor} />
              </View>
              <Text 
                className="font-bold text-gray-800 text-[14px] text-center px-2 leading-[16px]"
              >
                {item.name}
              </Text>
            </TouchableOpacity>
          ))}
        </View>

        {/* Featured Header */}
        <View className="px-6 -mt-0 flex-row justify-between items-end">{/*mt6 */}
          <Text className="text-2xl font-bold text-gray-900">Featured Events</Text>
          <TouchableOpacity onPress={() => router.push('/events')}>
            <Text className="text-indigo-600 font-bold text-base">View all</Text>
          </TouchableOpacity>
        </View>

        {/* Featured Card - Horizontal Scroll for Top 5 Events */}
        <ScrollView horizontal showsHorizontalScrollIndicator={false} className="mt-3 pl-6" contentContainerStyle={{ paddingRight: 24 }}>
          {events.slice(0, 5).map((event: any) => (
            <TouchableOpacity 
              key={event.id}
              onPress={() => router.push(`/events/${event.id}`)}
              activeOpacity={0.9}
              className="w-[300px] bg-white rounded-[35px] border border-gray-100 shadow-sm mr-5 overflow-hidden"
            >
              <Image 
                source={{ uri: event.image || 'https://images.unsplash.com/photo-1501281668745-f7f57925c3b4?q=80&w=1000&auto=format&fit=crop' }} 
                className="w-full h-48"
              />
              <View className="p-5">
                <View className="flex-row justify-between items-center mb-2">
                  <View className="bg-indigo-100 px-3 py-1 rounded-full">
                    <Text className="text-indigo-600 text-[10px] font-bold uppercase tracking-wider">{event.month} {event.day}</Text>
                  </View>
                  <Bookmark size={18} color="#4338CA" />
                </View>
                <Text className="text-lg font-bold text-gray-900 mb-1" numberOfLines={1}>{event.title}</Text>
                <Text className="text-gray-500 text-xs leading-4" numberOfLines={2}>
                  Hosted by {event.organizer} • {event.location}
                </Text>
              </View>
            </TouchableOpacity>
          ))}
          {events.length === 0 && (
            <View className="w-[300px] h-64 bg-gray-50 rounded-[35px] border border-dashed border-gray-200 items-center justify-center">
              <Calendar size={32} color="#9CA3AF" />
              <Text className="text-gray-400 font-bold mt-2">No featured events</Text>
            </View>
          )}
        </ScrollView>
      </ScrollView>
      <Footer />
    </View>
  );
}

