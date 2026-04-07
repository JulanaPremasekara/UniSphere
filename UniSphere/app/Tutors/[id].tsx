import React, { useState } from "react";
import { ScrollView, TouchableOpacity, View, Linking } from "react-native";
import { useRouter, useLocalSearchParams } from "expo-router";
import { ChevronLeft, Star, User, Phone, ShieldCheck, ChevronRight } from "lucide-react-native";

import { Box } from "@/components/ui/box";
import { HStack } from "@/components/ui/hstack";
import { VStack } from "@/components/ui/vstack";
import { Text } from "@/components/ui/text";
import { Icon } from "@/components/ui/icon";
import { Avatar } from "@/components/ui/avatar";

export default function TutorProfile() {
  const router = useRouter();
  const { id } = useLocalSearchParams();
  const [showContact, setShowContact] = useState(false);

 
  // tutor list
  const allTutors = [
    { id: "1", name: "Julian Vane", subject: "Introduction to Programming", phone: "0771234567" },
    { id: "2", name: "Ronald Richards", subject: "Nursing Assistant", phone: "0712223334" },
    { id: "3", name: "Kevin James", subject: "Web Designer", phone: "0759998887" }
  ];

  // Find the specific tutor based on the ID passed in the URL
  const tutor = allTutors.find((t) => t.id === id) || allTutors[0];

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
          
          {/* PROFILE ICON */}
          <View className="relative">
            <Avatar size="2xl" className="bg-indigo-600 border-4 border-white shadow-xl">
                <Icon as={User} size="xl" className="text-white" />
            </Avatar>
            <Box className="absolute bottom-1 right-2 w-6 h-6 bg-green-500 border-4 border-white rounded-full" />
          </View>

          {/* Use the dynamic data here */}
          <Text className="text-3xl font-bold text-black mt-4 text-center">{tutor.name}</Text>
          <Text className="text-gray-500 text-center mt-1">{tutor.subject}</Text>

          {/* CONTACT INFO CARD */}
          {showContact && (
            <Box className="w-full mt-6 bg-indigo-50 p-6 rounded-[30px] border border-indigo-100 shadow-sm">
              <Text className="text-center font-bold text-indigo-900 uppercase mb-3 text-[10px] tracking-widest">Tutor Contact Details</Text>
              
              <TouchableOpacity 
                onPress={() => Linking.openURL(`tel:${tutor.phone}`)}
                className="bg-white p-4 rounded-2xl items-center shadow-sm flex-row justify-center"
              >
                <Icon as={Phone} size="sm" className="text-indigo-600 mr-2" />
                <Text className="font-bold text-gray-700">{tutor.phone}</Text>
              </TouchableOpacity>
            </Box>
          )}

          <HStack space="md" className="mt-6">
            <Box className="bg-white px-4 py-2 rounded-full shadow-sm flex-row items-center">
              <Icon as={Star} size="xs" className="text-indigo-600 mr-2" />
              <Text className="font-bold text-black">4.9</Text>
            </Box>
          </HStack>

          <Box className="bg-white rounded-[30px] p-6 mt-8 w-full shadow-sm">
            <Text className="font-bold text-lg text-black mb-2">About Me</Text>
            <Text className="text-gray-600 leading-6">
              I am {tutor.name}, specializing in {tutor.subject}. Contact me to schedule a session.
            </Text>
          </Box>

          <TouchableOpacity 
            onPress={() => router.push('/Tutors/settings' as any)}
            className="bg-white border border-gray-100 p-5 rounded-[25px] shadow-sm w-full mt-6 mb-24"
          >
            <HStack className="justify-between items-center">
              <HStack space="md" className="items-center">
                <Icon as={ShieldCheck} size="sm" className="text-gray-400" />
                <Text className="font-bold text-black text-lg">Settings & Safety</Text>
              </HStack>
              <Icon as={ChevronRight} size="sm" className="text-gray-300" />
            </HStack>
          </TouchableOpacity>
          
        </VStack>
      </ScrollView>

      <View className="p-6 bg-white border-t border-gray-100">
        <TouchableOpacity 
          className="bg-[#4338CA] py-4 rounded-full flex-row justify-center items-center shadow-md"
          onPress={() => setShowContact(true)} 
        >
          <Icon as={Phone} size="sm" className="text-white mr-2" />
          <Text className="text-white font-bold text-lg">Book a Session</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}