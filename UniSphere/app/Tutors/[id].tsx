import React from "react";
import { ScrollView, TouchableOpacity, View } from "react-native";
import { useRouter, useLocalSearchParams } from "expo-router";
import { ChevronLeft, Star, Clock, Calendar, User, ShieldCheck, ChevronRight } from "lucide-react-native";

import { Box } from "@/components/ui/box";
import { HStack } from "@/components/ui/hstack";
import { VStack } from "@/components/ui/vstack";
import { Text } from "@/components/ui/text";
import { Icon } from "@/components/ui/icon";
import { Avatar } from "@/components/ui/avatar";

export default function TutorProfile() {
  const router = useRouter();
  const { id } = useLocalSearchParams();

  // 1. DATA LOGIC
  let name = "Julian Vane";
  let subject = "Introduction to Programming";
  let price = "Rs.1000";

  if (id === "2") {
    name = "Ronald Richards";
    subject = "Nursing Assistant";
    price = "Rs.1000";
  } else if (id === "3") {
    name = "Kevin James";
    subject = "Web Designer";
    price = "Rs.1000";
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
          <Avatar size="2xl" className="bg-indigo-600 border-4 border-white shadow-xl">
             <Icon as={User} size="xl" className="stroke-white" />
          </Avatar>

          <Text className="text-3xl font-bold text-black mt-4">{name}</Text>
          <Text className="text-gray-500 text-center mt-1">{subject}</Text>

          <HStack space="md" className="mt-6">
            <Box className="bg-white px-4 py-2 rounded-full shadow-sm flex-row items-center">
              <Icon as={Star} size="xs" className="text-indigo-600 mr-2" />
              <Text className="font-bold text-black">4.9</Text>
            </Box>
            <Box className="bg-white px-4 py-2 rounded-full shadow-sm flex-row items-center">
              <Icon as={Clock} size="xs" className="text-indigo-600 mr-2" />
              <Text className="font-bold text-black">{price}/hr</Text>
            </Box>
          </HStack>

          {/* ABOUT */}
          <Box className="bg-white rounded-[30px] p-6 mt-8 w-full shadow-sm">
            <HStack space="sm" className="items-center mb-3">
              <Icon as={User} size="sm" className="text-indigo-600" />
              <Text className="font-bold text-lg text-black">About Me</Text>
            </HStack>
            <Text className="text-gray-600 leading-6">
              I am {name}, specializing in {subject}. I help students master their university labs and assignments.
            </Text>
          </Box>

          {/* EXPERTISE */}
          <VStack className="w-full mt-8" space="md">
            <Text className="font-bold text-xl text-black">Expertise</Text>
            <HStack className="flex-wrap" space="sm">
              {["Exam Prep", "Assignments", "SLIIT Labs"].map((skill) => (
                <Box key={skill} className="bg-gray-200 px-4 py-2 rounded-full border border-gray-300 mb-2">
                  <Text className="text-gray-800 font-medium">{skill}</Text>
                </Box>
              ))}
            </HStack>
          </VStack>

          {/* SETTINGS BUTTON */}
          <TouchableOpacity 
            onPress={() => router.push('/Tutors/settings' as any)}
            className="bg-white border border-gray-100 p-5 rounded-[25px] shadow-sm w-full mt-8 mb-10"
          >
            <HStack className="justify-between items-center">
              <HStack space="md" className="items-center">
                <Box className="bg-indigo-50 p-2 rounded-xl">
                  <Icon as={ShieldCheck} size="md" className="text-[#4338CA]" />
                </Box>
                <Text className="font-bold text-black text-lg">Settings & Safety</Text>
              </HStack>
              <Icon as={ChevronRight} size="sm" className="text-gray-300" />
            </HStack>
          </TouchableOpacity>
        </VStack>
      </ScrollView>

      {/* 2. ADDED BACK: THE BOOK SESSION BUTTON */}
      {/* We put this OUTSIDE the ScrollView so it stays fixed at the bottom */}
      <View className="p-6 bg-white border-t border-gray-100">
        <TouchableOpacity 
          className="bg-[#4338CA] py-4 rounded-full flex-row justify-center items-center shadow-md"
          onPress={() => alert("Booking System coming soon!")}
        >
          <Icon as={Calendar} size="sm" className="text-white mr-2" />
          <Text className="text-white font-bold text-lg">Book a Session</Text>
        </TouchableOpacity>
      </View>

    </View>
  );
}