import React from "react";
import { ScrollView, TouchableOpacity, View } from "react-native";
import { useRouter } from "expo-router";
import { X } from "lucide-react-native";

// UI Components
import { VStack } from "@/components/ui/vstack";
import { HStack } from "@/components/ui/hstack";
import { Text } from "@/components/ui/text";
import { Input, InputField, InputSlot, InputIcon } from "@/components/ui/input";
import { Textarea, TextareaInput } from "@/components/ui/textarea";
import { Icon } from "@/components/ui/icon";

export default function ProfileSetup() {
  const router = useRouter();

  return (
    <ScrollView className="flex-1 bg-gray-50">
      {/* Header Section (The "X" button and Title) */}
      <View className="bg-white rounded-t-[40px] mt-20 p-8 flex-1">
        <HStack className="justify-between items-center mb-2">
          <Text className="text-3xl font-bold text-black">Profile Setup</Text>
          <TouchableOpacity onPress={() => router.back()}>
            <Icon as={X} size="xl" className="text-gray-400" />
          </TouchableOpacity>
        </HStack>
        
        <Text className="text-gray-500 mb-8">Tell us about your academic expertise.</Text>

        <VStack space="xl">
          {/* Full Name Input */}
          <VStack space="xs">
            <Text className="text-xs font-bold uppercase tracking-wider text-black">Full Name</Text>
            <Input variant="rounded" className="bg-gray-100 border-0 h-14 px-2">
              <InputField placeholder="Dr. Julian Sterling" />
            </Input>
          </VStack>

          {/* Hourly Rate Input */}
          <VStack space="xs">
            <Text className="text-xs font-bold uppercase tracking-wider text-black">Hourly Rate (USD)</Text>
            <Input variant="rounded" className="bg-gray-100 border-0 h-14 px-4">
               <Text className="text-gray-400 mr-2">$</Text>
               <InputField placeholder="50.00" keyboardType="numeric" />
            </Input>
          </VStack>

          {/* Subjects Input */}
          <VStack space="xs">
            <Text className="text-xs font-bold uppercase tracking-wider text-black">Subjects</Text>
            <Input variant="rounded" className="bg-gray-100 border-0 h-14 px-2">
              <InputField placeholder="Physics, Calculus, Ethics" />
            </Input>
          </VStack>

          {/* Bio Textarea */}
          <VStack space="xs">
            <Text className="text-xs font-bold uppercase tracking-wider text-black">Bio & Experience</Text>
            <Textarea className="bg-gray-100 border-0 rounded-[30px] p-4">
              <TextareaInput 
                placeholder="Share your academic background..." 
                className="text-sm"
              />
            </Textarea>
          </VStack>

          {/* Save Button */}
          <TouchableOpacity className="bg-[#4338CA] p-4 rounded-full mt-4">
             <Text className="text-white text-center font-bold text-lg">Save Profile</Text>
          </TouchableOpacity>
        </VStack>
      </View>
    </ScrollView>
  );
}