import React from 'react';
import { View, Text, TouchableOpacity, ScrollView, Platform } from 'react-native';
import { useRouter } from 'expo-router';
import { 
  Settings, 
  ChevronRight, 
  Bell, 
  ShieldCheck, 
  LogOut, 
  GraduationCap,
  Mail,
  CircleUserRound,
  ChevronLeft
} from 'lucide-react-native';
import { VStack } from '@/components/ui/vstack';
import { Box } from '@/components/ui/box';
import Footer from './components/Footer';

export default function Profile() {
  const router = useRouter();

  // Robust back function
  const handleBack = () => {
    if (router.canGoBack()) {
      router.back();
    } else {
      router.replace('/'); // Fallback to home if no history
    }
  };

  return (
    <View className="flex-1 bg-white">
      {/* 1. Header - Moved down significantly with pt-24 */}
      <View 
        className="flex-row justify-between items-center px-6 pb-4 bg-white"
        style={{ paddingTop: Platform.OS === 'ios' ? 70 : 60 }} // Extra safety for OS status bars
      >
        <TouchableOpacity 
          onPress={handleBack} 
          className="p-2 -ml-2 w-12 h-12 justify-center items-start"
          activeOpacity={0.7}
        >
          <ChevronLeft size={28} color="#1E1B4B" />
        </TouchableOpacity>
        
        <Text className="text-xl font-bold text-indigo-900">My Profile</Text>
        
        <TouchableOpacity className="bg-gray-100 p-2 rounded-full">
          <Settings size={22} color="#1E1B4B" />
        </TouchableOpacity>
      </View>

      <ScrollView 
        showsVerticalScrollIndicator={false} 
        contentContainerStyle={{ paddingBottom: 140 }}
      >
        {/* 2. Profile Identity Section */}
        <View className="items-center mt-6">
          <View className="bg-indigo-50 p-1 rounded-[45px] border-2 border-indigo-100">
            <View className="bg-white w-32 h-32 rounded-[40px] items-center justify-center shadow-sm">
              <CircleUserRound size={80} color="#4F46E5" strokeWidth={1.5} />
            </View>
          </View>
          
          <Text className="text-3xl font-extrabold text-gray-900 mt-5">Alex Johnson</Text>
          <View className="flex-row items-center mt-2 bg-gray-50 px-4 py-1.5 rounded-full border border-gray-100">
            <GraduationCap size={16} color="#6366F1" />
            <Text className="text-gray-500 font-bold ml-2 text-[12px] uppercase tracking-widest">
              Computer Science • Year 3
            </Text>
          </View>
        </View>

        {/* 3. Stats Card - Floating & Centered */}
        <View className="px-6 mt-10">
          <Box className="flex-row justify-between items-center bg-white p-6 rounded-[32px] shadow-xl shadow-indigo-100/50 border border-indigo-50">
            <View className="items-center flex-1">
              <Text className="text-2xl font-black text-indigo-600">12</Text>
              <Text className="text-gray-400 text-[10px] font-bold tracking-widest uppercase mt-1">Groups</Text>
            </View>
            <View className="w-[1px] h-10 bg-gray-100" />
            <View className="items-center flex-1">
              <Text className="text-2xl font-black text-indigo-600">48</Text>
              <Text className="text-gray-400 text-[10px] font-bold tracking-widest uppercase mt-1">Events</Text>
            </View>
            <View className="w-[1px] h-10 bg-gray-100" />
            <View className="items-center flex-1">
              <Text className="text-2xl font-black text-indigo-600">1.2k</Text>
              <Text className="text-gray-400 text-[10px] font-bold tracking-widest uppercase mt-1">Points</Text>
            </View>
          </Box>
        </View>

        {/* 4. Account Settings */}
        <View className="px-6 mt-12">
          <Text className="text-gray-400 font-bold text-[11px] uppercase tracking-[2px] ml-4 mb-5">
            Account Settings
          </Text>
          
          <VStack space="md">
            <ProfileMenuItem icon={Mail} label="Email Address" value="alex.j@uni.edu" />
            <ProfileMenuItem icon={Bell} label="Notifications" />
            <ProfileMenuItem icon={ShieldCheck} label="Privacy & Security" />

            <TouchableOpacity 
              onPress={() => router.replace('/login')}
              className="flex-row items-center bg-red-50 p-5 rounded-[28px] mt-8 border border-red-100"
            >
              <LogOut size={22} color="#EF4444" />
              <Text className="ml-4 font-bold text-red-600 text-lg">Log Out</Text>
            </TouchableOpacity>
          </VStack>
        </View>
      </ScrollView>

      <Footer />
    </View>
  );
}

// Menu Item Sub-component
function ProfileMenuItem({ icon: IconComp, label, value }: { icon: any, label: string, value?: string }) {
  return (
    <TouchableOpacity className="flex-row items-center bg-gray-50/50 p-5 rounded-[28px] border border-gray-100 mb-2">
      <View className="bg-white p-3 rounded-2xl shadow-sm">
        <IconComp size={22} color="#4F46E5" />
      </View>
      <View className="flex-1 ml-4">
        <Text className="font-bold text-gray-800 text-base">{label}</Text>
        {value && <Text className="text-gray-400 text-xs mt-1 font-medium">{value}</Text>}
      </View>
      <ChevronRight size={20} color="#D1D5DB" />
    </TouchableOpacity>
  );
}