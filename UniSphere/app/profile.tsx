import { Box } from '@/components/ui/box';
import { VStack } from '@/components/ui/vstack';
import { useFocusEffect, useRouter } from 'expo-router';
import { Camera, Bell, Calendar, ChevronLeft, ChevronRight, CircleUserRound, GraduationCap, LogOut, Mail, Settings, ShieldCheck, Users } from 'lucide-react-native';
import React, { useState } from 'react';
import { ActivityIndicator, Platform, ScrollView, Text, TouchableOpacity, View, Image, Alert } from 'react-native';
import * as ImagePicker from 'expo-image-picker';

import Footer from './components/Footer';
import { useProfile } from '../hooks/useProfile';

export default function Profile() {
  const router = useRouter();
  const { user, loading, isUpdating, logout, refreshProfile, updateProfile, deleteProfileImage } = useProfile();

  const handleImagePick = async () => {
    const permission = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (!permission.granted) {
      Alert.alert("Permission Required", "Please allow access to your photo library to update your profile picture.");
      return;
    }

    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [1, 1],
      quality: 0.7,
    });

    if (!result.canceled && result.assets[0]) {
      const success = await updateProfile({
        name: user.name,
        phone: user.phone,
        year: user.year,
        major: user.major
      }, result.assets[0], false); // Pass false to stay on the page
      
      if (success) {
        refreshProfile();
      }
    }
  };

  const handleDeleteImage = async () => {
    Alert.alert("Remove Photo", "Are you sure you want to remove your profile photo?", [
      { text: "Cancel", style: "cancel" },
      { text: "Remove", style: "destructive", onPress: async () => {
        await deleteProfileImage();
        refreshProfile();
      }}
    ]);
  };

  useFocusEffect(React.useCallback(() => { refreshProfile(); }, [refreshProfile]));

  if (loading) return <View className="flex-1 justify-center items-center bg-white"><ActivityIndicator size="large" color="#4F46E5" /></View>;

  if (!user) return (
    <View style={{ flex: 1, backgroundColor: 'white' }}>
      <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center', paddingHorizontal: 40 }}>
        <View className="bg-indigo-50 p-10 rounded-[50px] mb-8"><CircleUserRound size={100} color="#4F46E5" strokeWidth={1} /></View>
        <Text className="text-3xl font-black text-gray-900 text-center mb-3">Hello there!</Text>
        <Text className="text-gray-500 text-center text-lg leading-6 mb-10">Please sign in to your UniSphere account to view and manage your profile details.</Text>
        <TouchableOpacity onPress={() => router.push('/login')} className="bg-indigo-600 w-full h-16 rounded-[25px] items-center justify-center shadow-lg shadow-indigo-200">
          <Text className="text-white font-bold text-lg">Sign In Now</Text>
        </TouchableOpacity>
      </View>
      <Footer />
    </View>
  );

  return (
    <View className="flex-1 bg-white">
      <View className="flex-row justify-between items-center px-6 pb-4 bg-white" style={{ paddingTop: Platform.OS === 'ios' ? 70 : 60 }}>
        <TouchableOpacity onPress={() => router.back()} className="p-2 -ml-2 w-12 h-12 justify-center items-start"><ChevronLeft size={28} color="#1E1B4B" /></TouchableOpacity>
        <Text className="text-xl font-bold text-indigo-900">My Profile</Text>
        <TouchableOpacity onPress={() => router.push('/update-profile')} className="bg-gray-100 p-2 rounded-full"><Settings size={22} color="#1E1B4B" /></TouchableOpacity>
      </View>

      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingBottom: 140 }}>
        <View className="items-center mt-6">
          <View className="relative">
            <TouchableOpacity onPress={handleImagePick} onLongPress={user.image ? handleDeleteImage : undefined} activeOpacity={0.9}>
              <View className="bg-indigo-50 p-1 rounded-[45px] border-2 border-indigo-100">
                <View className="bg-white w-32 h-32 rounded-[40px] items-center justify-center shadow-sm overflow-hidden">
                  {user.image ? (
                    <Image 
                      source={{ 
                        uri: user.image.startsWith('http') 
                          ? `${user.image}?t=${new Date().getTime()}` 
                          : `${process.env.EXPO_PUBLIC_API_URL}${user.image}?t=${new Date().getTime()}` 
                      }} 
                      className="w-full h-full" 
                    />
                  ) : (
                    <CircleUserRound size={80} color="#4F46E5" strokeWidth={1.5} />
                  )}
                  {isUpdating && (
                    <View className="absolute inset-0 bg-black/30 items-center justify-center">
                      <ActivityIndicator color="white" />
                    </View>
                  )}
                </View>
              </View>
              <View className="absolute bottom-2 right-2 bg-indigo-600 p-2.5 rounded-2xl border-2 border-white shadow-md">
                <Camera size={18} color="white" />
              </View>
            </TouchableOpacity>
          </View>
          <Text className="text-3xl font-extrabold text-gray-900 mt-5">{user?.name || 'User'}</Text>
          <View className="flex-row items-center mt-2 bg-gray-50 px-4 py-1.5 rounded-full border border-gray-100">
            <GraduationCap size={16} color="#6366F1" />
            <Text className="text-gray-500 font-bold ml-2 text-[12px] uppercase tracking-widest">{user?.major || 'Student'} • Year {user?.year || 'N/A'}</Text>
          </View>
        </View>

        <View className="px-6 mt-10">
          <Box className="flex-row justify-between items-center bg-white p-6 rounded-[32px] shadow-xl shadow-indigo-100/50 border border-indigo-50">
            <View className="items-center flex-1">
              <Text className="text-2xl font-black text-indigo-600">
                {user?.groupCount || 0}
              </Text>
              <Text className="text-gray-400 text-[10px] font-bold tracking-widest uppercase mt-1">
                Groups
              </Text>
            </View>
            <View className="w-[1px] h-10 bg-gray-100" />
            <View className="items-center flex-1">
              <Text className="text-2xl font-black text-indigo-600">
                {user?.eventCount || 0}
              </Text>
              <Text className="text-gray-400 text-[10px] font-bold tracking-widest uppercase mt-1">
                Events
              </Text>
            </View>
            <View className="w-[1px] h-10 bg-gray-100" />
            <View className="items-center flex-1">
              <Text className="text-2xl font-black text-indigo-600">
                {user?.year ? new Date().getFullYear() + (4 - parseInt(user.year)) : "N/A"}
              </Text>
              <Text className="text-gray-400 text-[10px] font-bold tracking-widest uppercase mt-1">
                Graduation
              </Text>
            </View>
          </Box>
        </View>

        <View className="px-6 mt-12">
          <Text className="text-gray-400 font-bold text-[11px] uppercase tracking-[2px] ml-4 mb-5">
            Activity & Security
          </Text>
          <VStack space="md">
            <ProfileMenuItem
              icon={Users}
              label="Joined Study Groups"
              onPress={() => router.push("/studyGroup/joined")}
            />
            <ProfileMenuItem
              icon={Calendar}
              label="Registered Events"
              onPress={() => router.push("/events/registrations")}
            />
            <ProfileMenuItem
              icon={ShieldCheck}
              label="Privacy & Security"
              onPress={() => router.push("./privacy")}
            />
            <ProfileMenuItem
              icon={Mail}
              label="Email Address"
              value={user?.email || "No email provided"}
            />
            <TouchableOpacity
              onPress={logout}
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

function ProfileMenuItem({ icon: IconComp, label, value, onPress }: { icon: any, label: string, value?: string, onPress?: () => void }) {
  return (
    <TouchableOpacity onPress={onPress} className="flex-row items-center bg-gray-50/50 p-5 rounded-[28px] border border-gray-100 mb-2">
      <View className="bg-white p-3 rounded-2xl shadow-sm"><IconComp size={22} color="#4F46E5" /></View>
      <View className="flex-1 ml-4">
        <Text className="font-bold text-gray-800 text-base">{label}</Text>
        {value && <Text className="text-gray-400 text-xs mt-1 font-medium">{value}</Text>}
      </View>
      {label !== "Email Address" && <ChevronRight size={20} color="#9CA3AF" />}
    </TouchableOpacity>
  );
}
