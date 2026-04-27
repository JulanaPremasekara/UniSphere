import axios from "axios";
import { useFocusEffect, useLocalSearchParams, useRouter } from "expo-router"; // Added useFocusEffect
import { ChevronLeft, ChevronRight, Phone, ShieldCheck, Star, User } from "lucide-react-native"; // Added User icon
import React, { useState } from "react";
import { ActivityIndicator, Linking, ScrollView, TouchableOpacity, View } from "react-native";

import { Avatar, AvatarImage } from "@/components/ui/avatar";
import { Box } from "@/components/ui/box";
import { HStack } from "@/components/ui/hstack";
import { Icon } from "@/components/ui/icon";
import { Text } from "@/components/ui/text";
import { VStack } from "@/components/ui/vstack";
import Footer from '../components/Footer';
import apiClient from "../services/api";


export default function TutorProfile() {
  const router = useRouter();
  const { id } = useLocalSearchParams();

  // --- STATE MANAGEMENT ---
  const [tutor, setTutor] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [showContact, setShowContact] = useState(false);


  // --- FETCH DATA FROM BACKEND ---
  
  useFocusEffect(
    React.useCallback(() => {
      const fetchTutorDetails = async () => {
        try {
          const response = await apiClient.get(`/tutors/${id}`);
          setTutor(response.data.data || response.data);
        } catch (error) {
          console.error("Backend Fetch Error:", error);
        } finally {
          setLoading(false);
        }
      };

      if (id) fetchTutorDetails();
    }, [id])
  );

  // --- LOADING STATE ---
  if (loading) {
    return (
      <View className="flex-1 justify-center items-center bg-white">
        <ActivityIndicator size="large" color="#4338CA" />
        <Text className="mt-4 text-gray-500">Loading profile...</Text>
      </View>
    );
  }

  // --- ERROR STATE ---
  if (!tutor) {
    return (
      <View className="flex-1 justify-center items-center p-6">
        <Text className="text-xl font-bold">Tutor not found</Text>
        <TouchableOpacity onPress={() => router.back()} className="mt-4 bg-indigo-600 px-6 py-2 rounded-full">
          <Text className="text-white">Go Back</Text>
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <View className="flex-1 bg-gray-50">
      <ScrollView className="flex-1">
        
        {/* HEADER */}
        <HStack className="p-6 mt-10 justify-between items-center">
          <TouchableOpacity onPress={() => router.back()} className="bg-white p-2 rounded-full shadow-sm">
            <Icon as={ChevronLeft} size="lg" className="text-black" />
          </TouchableOpacity>
          <Text className="font-bold text-lg text-black">Tutor Profile</Text>
          <Box className="w-10" /> 
        </HStack>

        <VStack className="items-center px-6">
          
          {/* AVATAR ICON & STATUS DOT */}
          
<View className="relative">
  <Avatar size="2xl" className="bg-indigo-600 border-4 border-white shadow-xl">
    {tutor.image ? (
      <AvatarImage 
        source={{ uri: tutor.image }} 
        className="w-full h-full rounded-full" 
      />
    ) : (
      <Icon as={User} size="xl" className="text-white" />
    )}
  </Avatar>
  
  {/* Status dot logic remains exactly as you had it */}
  <Box 
    className={`absolute bottom-1 right-2 w-6 h-6 border-4 border-white rounded-full ${
      tutor.isOnline !== false ? 'bg-green-500' : 'bg-gray-400'
    }`} 
  />
</View>

          <Text className="text-3xl font-bold text-black mt-4 text-center">{tutor.name}</Text>
          <Text className="text-gray-500 text-center mt-1">{tutor.subject}</Text>

          {/* CONTACT INFO CARD */}
          {showContact && (
            <Box className="w-full mt-6 bg-indigo-50 p-6 rounded-[30px] border border-indigo-100 shadow-sm">
              <Text className="text-center font-bold text-indigo-900 uppercase mb-3 text-[10px] tracking-widest">Tutor Contact Details</Text>
              
              <HStack className="justify-center" space="lg">
                <TouchableOpacity 
                  onPress={() => tutor.phone && Linking.openURL(`tel:${tutor.phone}`)}
                  className="bg-white p-4 rounded-2xl items-center shadow-sm flex-1"
                >
                  <Icon as={Phone} size="md" className="text-indigo-600 mb-1" />
                  <Text className="text-xs font-bold text-gray-700">{tutor.phone || "No Number Provided"}</Text>
                </TouchableOpacity>
              </HStack>
            </Box>
          )}

          <HStack space="md" className="mt-6">
            <Box className="bg-white px-4 py-2 rounded-full shadow-sm flex-row items-center">
              <Icon as={Star} size="xs" className="text-indigo-600 mr-2" />
              <Text className="font-bold text-black">4.9</Text>
            </Box>
            <Box className="bg-white px-4 py-2 rounded-full shadow-sm">
              <Text className="font-bold text-indigo-600">{tutor.price}</Text>
            </Box>
          </HStack>

          {/* ABOUT SECTION */}
          <Box className="bg-white rounded-[30px] p-6 mt-8 w-full shadow-sm">
            <Text className="font-bold text-lg text-black mb-2">About Me</Text>
            <Text className="text-gray-600 leading-6">
              {tutor.bio || `I am ${tutor.name}, specializing in ${tutor.subject}. Contact me to schedule a session or discuss your university assignments.`}
            </Text>
          </Box>

          {/* SETTINGS & SAFETY BUTTON */}
          <TouchableOpacity 
            onPress={() => router.push({
              pathname: '/Tutors/settings',
              params: { id: tutor._id || id } 
            })}
            className="bg-white border border-gray-100 p-5 rounded-[25px] shadow-sm w-full mt-6 mb-24"
          >
            <HStack className="justify-between items-center">
              <HStack space="md" className="items-center">
                <View className="bg-gray-100 p-2 rounded-lg">
                  <Icon as={ShieldCheck} size="sm" className="text-gray-500" />
                </View>
                <Text className="font-bold text-black text-lg">Settings & Safety</Text>
              </HStack>
              <Icon as={ChevronRight} size="sm" className="text-gray-300" />
            </HStack>
          </TouchableOpacity>
          
        </VStack>
      </ScrollView>

      {/* BOOKING BUTTON */}
      <View className="p-6 bg-white border-t border-gray-100">
        <TouchableOpacity 
          className="bg-[#4338CA] py-4 rounded-full flex-row justify-center items-center shadow-md"
          onPress={() => setShowContact(true)} 
        >
          <Icon as={Phone} size="sm" className="text-white mr-2" />
          <Text className="text-white font-bold text-lg">Book a Session</Text>
        </TouchableOpacity>
      </View>
    <Footer />
    </View>
  );
}