import React from 'react';
import { View, Text, TextInput, ScrollView, TouchableOpacity, Image } from 'react-native';
import { Search, Bell, ShoppingBasket, Users, Calendar, GraduationCap, UtensilsCrossed, Map as MapIcon, Bookmark } from 'lucide-react-native';
import Header from './components/Header';
import Footer from './components/Footer';

const categories = [
  { name: 'Marketplace', icon: ShoppingBasket, color: '#EEF2FF', iconColor: '#4338CA' },
  { name: 'Study Groups', icon: Users, color: '#F5F3FF', iconColor: '#5B21B6' },
  { name: 'Events', icon: Calendar, color: '#F0F9FF', iconColor: '#0369A1' },
  { name: 'Courses', icon: GraduationCap, color: '#F5F3FF', iconColor: '#4338CA' },
  { name: 'Dining', icon: UtensilsCrossed, color: '#F0F9FF', iconColor: '#0369A1' },
  { name: 'Map', icon: MapIcon, color: '#EEF2FF', iconColor: '#4338CA' },
];

export default function Home() {
  return (
    <View className="flex-1 bg-white">
      {/* Header is handled by your component, but ensure it has the profile/search icons */}
      <Header title="UniSphere" />

      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingBottom: 100 }}>
        
        {/* Search Bar - Exactly like UI */}
        <View className="px-6 mt-4">
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
        <View className="flex-row flex-wrap justify-between px-6 mt-8">
          {categories.map((item, index) => (
            <TouchableOpacity 
              key={index} 
              style={{ backgroundColor: item.color }}
              className="w-[47%] aspect-square rounded-[45px] items-center justify-center mb-5"
            >
              <View className="bg-white p-3 rounded-2xl mb-3 shadow-sm">
                <item.icon size={24} color={item.iconColor} />
              </View>
              <Text className="font-bold text-gray-800 text-[15px]">{item.name}</Text>
            </TouchableOpacity>
          ))}
        </View>

        {/* Featured Section */}
        <View className="px-6 mt-6 flex-row justify-between items-end">
          <Text className="text-2xl font-bold text-gray-900">Featured</Text>
          <TouchableOpacity>
            <Text className="text-indigo-600 font-bold text-base">View all</Text>
          </TouchableOpacity>
        </View>

        {/* Featured Card */}
        <ScrollView horizontal showsHorizontalScrollIndicator={false} className="mt-4 pl-6">
          <View className="w-[320px] bg-white rounded-[40px] border border-gray-100 shadow-sm mr-5 overflow-hidden mb-5">
            <Image 
              source={{ uri: 'https://images.unsplash.com/photo-1501281668745-f7f57925c3b4?q=80&w=1000&auto=format&fit=crop' }} 
              className="w-full h-52"
            />
            <View className="p-6">
              <View className="flex-row justify-between items-center mb-3">
                <View className="bg-indigo-100 px-4 py-1.5 rounded-full">
                  <Text className="text-indigo-600 text-xs font-bold uppercase tracking-wider">Community</Text>
                </View>
                <Bookmark size={20} color="#4338CA" fill="#4338CA" />
              </View>
              <Text className="text-xl font-bold text-gray-900 mb-2">Annual Spring Gala 2024</Text>
              <Text className="text-gray-500 text-sm leading-5">
                Join us for a night of celebration at the University Grand Hall.
              </Text>
            </View>
          </View>
        </ScrollView>
      </ScrollView>

      <Footer />
    </View>
  );
}