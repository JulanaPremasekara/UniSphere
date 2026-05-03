import React, { useState } from "react";
import { ScrollView, TouchableOpacity, View, Alert, ActivityIndicator } from "react-native";
import { useRouter, useLocalSearchParams } from "expo-router";
import axios from "axios";
import { ShieldOff, Trash2, User, ChevronLeft } from "lucide-react-native";

import { Box } from "@/components/ui/box";
import { HStack } from "@/components/ui/hstack";
import { VStack } from "@/components/ui/vstack";
import { Text } from "@/components/ui/text";
import { Icon } from "@/components/ui/icon";
import { Avatar } from "@/components/ui/avatar";
import Footer from '../components/Footer';
import apiClient from "../services/api";

export default function SettingsScreen() {
  const router = useRouter();
  const { id } = useLocalSearchParams(); 
  const [loading, setLoading] = useState(false);

  
  // --- SWITCH STATUS (TOGGLE ONLINE/OFFLINE) ---
  const handleToggleStatus = async () => {
  if (!id) return Alert.alert("Error", "Tutor ID missing");

  setLoading(true);
  try {
    await apiClient.patch(`/tutors/${id}/status`, { isOnline: false }); // Using apiClient for consistency
    
    Alert.alert("Success", "Status updated successfully.");
    router.replace("/tutors"); 
  } catch (error: any) {
    console.log("Error Detail:", error.response?.data || error.message);
    Alert.alert("Error", "Validation still failing. See console.");
  } finally {
    setLoading(false);
  }
};

  // --- DELETE ACCOUNT ---
  const handleDeleteAccount = async () => {
    if (!id) return Alert.alert("Error", "Tutor ID missing");

    Alert.alert(
      "Delete Profile",
      "Are you sure? This action cannot be undone.",
      [
        { text: "Cancel", style: "cancel" },
        { 
          text: "Delete", 
          style: "destructive", 
          onPress: async () => {
            setLoading(true);
            try {
              await apiClient.delete(`/tutors/${id}`); // Using apiClient for consistency
              
              Alert.alert("Deleted", "Your profile has been removed.");
              router.replace("/tutors");
            } catch (error) {
              console.error("Delete Error:", error);
              Alert.alert("Error", "Failed to delete account.");
            } finally {
              setLoading(false);
            }
          }
        }
      ]
    );
  };

  return (
    <ScrollView className="flex-1 bg-white">
      
      {/* TOP HEADER */}
      <HStack className="p-6 mt-10 justify-between items-center">
        <TouchableOpacity 
          onPress={() => router.back()} 
          className="bg-gray-100 p-2 rounded-full"
        >
          <Icon as={ChevronLeft} size="lg" className="text-black" />
        </TouchableOpacity>

        <Text className="text-xl font-bold text-black">Settings</Text>
        
        <Avatar size="sm" className="bg-gray-200">
          <Icon as={User} className="text-gray-600" size="sm" />
        </Avatar>
      </HStack>

      <VStack className="px-6 mt-4" space="xl">
        
        {/* TITLE SECTION */}
        <VStack className="items-center">
          <Text className="text-[#4338CA] font-bold text-xs uppercase tracking-widest">
            Account Management
          </Text>
          <Text className="text-4xl font-bold text-black mt-2 text-center">
            Settings & Safety.
          </Text>
        </VStack>

        {/* GO OFFLINE CARD */}
        <Box className="bg-white p-6 rounded-[40px] shadow-sm border border-gray-100">
          <HStack className="justify-between items-start">
            <Box className="bg-indigo-100 p-3 rounded-full">
              <Icon as={ShieldOff} size="md" className="text-[#4338CA]" />
            </Box>
            {/* Status indicator - visual only here */}
            <HStack className="items-center bg-green-50 px-3 py-1 rounded-full border border-green-100">
              <View className="w-2 h-2 bg-green-500 rounded-full mr-2" />
              <Text className="text-green-600 text-[10px] font-bold uppercase">Status Ready</Text>
            </HStack>
          </HStack>

          <Text className="text-2xl font-bold text-black mt-4">Switch Status?</Text>
          <Text className="text-gray-500 mt-2">
            Toggling this will change your visibility in search results.
          </Text>

          <VStack className="mt-6" space="sm">
            <TouchableOpacity 
              onPress={() => router.back()} 
              className="bg-gray-100 p-4 rounded-full"
              disabled={loading}
            >
              <Text className="text-center font-bold text-gray-700">Cancel</Text>
            </TouchableOpacity>
            
            <TouchableOpacity 
              className="bg-[#4338CA] p-4 rounded-full"
              onPress={handleToggleStatus}
              disabled={loading}
            >
              {loading ? (
                <ActivityIndicator color="white" />
              ) : (
                <Text className="text-center font-bold text-white">Switch Status</Text>
              )}
            </TouchableOpacity>
          </VStack>
        </Box>

        {/* DELETE ACCOUNT CARD */}
        <Box className="bg-white p-6 rounded-[40px] shadow-sm border border-gray-100 mb-10">
          <Box className="bg-red-100 p-3 rounded-full w-12">
            <Icon as={Trash2} size="md" className="text-red-600" />
          </Box>
          <Text className="text-2xl font-bold text-black mt-4">Close account?</Text>
          
          <VStack className="mt-6" space="sm">
            <TouchableOpacity 
              onPress={() => router.back()} 
              className="border border-gray-200 p-4 rounded-full"
              disabled={loading}
            >
              <Text className="text-center font-bold text-gray-700">Keep Profile</Text>
            </TouchableOpacity>
            
            <TouchableOpacity 
              className="bg-red-600 p-4 rounded-full"
              onPress={handleDeleteAccount}
              disabled={loading}
            >
              <Text className="text-center font-bold text-white">Delete Account</Text>
            </TouchableOpacity>
          </VStack>
        </Box>
      <Footer />
      </VStack>
    </ScrollView>
  );
}