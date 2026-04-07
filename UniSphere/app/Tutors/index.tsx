import { useRouter } from "expo-router";
import React from "react";
import { ScrollView, TouchableOpacity } from "react-native"; 
import { ChevronLeft, Plus, User } from 'lucide-react-native';

import { Box } from "@/components/ui/box";
import { HStack } from "@/components/ui/hstack";
import { Icon } from "@/components/ui/icon";
import { Input, InputField } from "@/components/ui/input";
import { Text } from "@/components/ui/text";
import { VStack } from "@/components/ui/vstack";
import { Avatar } from "@/components/ui/avatar"; 

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
            <TouchableOpacity onPress={() => router.back()}>
              <Icon as={ChevronLeft} size="xl" className="text-black" />
            </TouchableOpacity>
            <Text className="text-3xl font-bold text-indigo-800">Find a Tutor</Text>
          </HStack>

          <TouchableOpacity 
            onPress={() => router.push('/Tutors/setup' as any)}
            className="bg-[#4338CA] p-2 rounded-full"
          >
            <Icon as={Plus} size="sm" className="text-white" />
          </TouchableOpacity>
        </HStack>

        <Input variant="rounded" className="bg-gray-100 border-0 h-12">
          <InputField placeholder="Search subjects..." />
        </Input>

        {/* Categories */}
        <HStack space="sm" className="mt-2">
          <Box className="bg-[#4338CA] px-4 py-1.5 rounded-full"><Text className="text-white font-bold text-xs">All</Text></Box>
          <Box className="bg-gray-100 px-4 py-1.5 rounded-full"><Text className="text-gray-500 text-xs">Computing</Text></Box>
          <Box className="bg-gray-100 px-4 py-1.5 rounded-full"><Text className="text-gray-500 text-xs">Business</Text></Box>
        </HStack>

        {/* List of Tutors */}
        <VStack space="md" className="mt-4">
          {tutorList.map((tutor) => (
            <TouchableOpacity 
              key={tutor.id} 
              onPress={() => router.push(`/Tutors/${tutor.id}` as any)}
              className="bg-white rounded-2xl p-4 shadow-sm border border-gray-100"
            >
              <HStack space="md" className="items-center justify-between">
                <HStack space="md" className="items-center">
                  <Avatar size="lg" className="bg-indigo-500 rounded-full">
                    <Icon as={User} className="text-white" size="md" />
                  </Avatar>

                  <VStack>
                    <Text className="font-bold text-lg text-black">{tutor.name}</Text>
                    <Text className="text-gray-400 text-sm">{tutor.subject}</Text>
                  </VStack>
                </HStack>

                <Text className="font-bold text-indigo-700">
                   {tutor.price}<Text className="text-gray-400 text-[10px] font-normal">/hr</Text>
                </Text>
              </HStack>
            </TouchableOpacity>
          ))}
        </VStack>

      </VStack>
    </ScrollView>
  );
}