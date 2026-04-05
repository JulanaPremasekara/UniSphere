import { useRouter } from "expo-router";
import React from "react";
import { ScrollView, TouchableOpacity } from "react-native";
// 1. Added Plus icon
import { ChevronLeft, Plus, User } from 'lucide-react-native';

import { Avatar } from "@/components/ui/avatar";
import { Box } from "@/components/ui/box";
import { HStack } from "@/components/ui/hstack";
import { Icon } from "@/components/ui/icon";
import { Input, InputField } from "@/components/ui/input";
import { Text } from "@/components/ui/text";
import { VStack } from "@/components/ui/vstack";

export default function FindTutor() {
  const router = useRouter();

  const tutorList = [
    { id: "1", name: "Julian Vane", subject: "Introduction to Programming", price: "Rs.1000" },
    { id: "2", name: "Ronald Richards", subject: "Nursing Assistant", price: "Rs.1000" },
    { id: "3", name: "Kevin James", subject: "Web Designer", price: "Rs.1000" },
  ];

  return (
    <ScrollView className="flex-1 bg-white">
      <VStack space="md" className="p-6 mt-10">
        
        {/* Header Section */}
        <HStack className="items-center justify-between mb-2">
          <HStack space="md" className="items-center">
            <TouchableOpacity onPress={() => router.back()} className="p-2 -ml-2">
              <Icon as={ChevronLeft} size="xl" className="text-black" />
            </TouchableOpacity>
            <Text className="text-3xl font-bold text-[#4338CA]">Find a Tutor</Text>
          </HStack>

          {/* 2. ADD TUTOR BUTTON: Opens the setup profile */}
          <TouchableOpacity 
            onPress={() => router.push('/Tutors/setup' as any)}
            className="bg-[#4338CA] p-2 rounded-full"
          >
            <Icon as={Plus} size="sm" className="text-white" />
          </TouchableOpacity>
        </HStack>

        {/* Search Bar */}
        <Input variant="rounded" className="bg-gray-100 border-0">
          <InputField placeholder="Search subjects..." />
        </Input>

        {/* Categories */}
        <HStack space="sm" className="mt-2">
          <Box className="bg-[#4338CA] px-4 py-2 rounded-full">
            <Text className="text-white font-bold">All</Text>
          </Box>
          <Box className="bg-gray-200 px-4 py-2 rounded-full">
            <Text className="text-gray-700">Computing</Text>
          </Box>
        </HStack>

        {/* List of Tutors */}
        {tutorList.map((tutor) => (
          <TouchableOpacity 
            key={tutor.id} 
            className="mt-2" 
            onPress={() => router.push(`/Tutors/${tutor.id}` as any)}
          >
            <Box className="p-4 border border-gray-100 rounded-2xl bg-white shadow-sm">
              <HStack space="md" className="items-center">
                <Avatar className="bg-indigo-500 w-12 h-12">
                  <Icon as={User} size="lg" className="stroke-white" />
                </Avatar>
                <VStack className="flex-1">
                  <Text className="font-bold text-lg text-black">{tutor.name}</Text>
                  <Text className="text-gray-500 text-sm">{tutor.subject}</Text>
                </VStack>
                <Text className="font-bold text-[#4338CA]">{tutor.price}/hr</Text>
              </HStack>
            </Box>
          </TouchableOpacity>
        ))}

      </VStack>
    </ScrollView>
  );
}