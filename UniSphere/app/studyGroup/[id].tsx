import { useRouter } from 'expo-router';
import { Calendar, CheckCircle2 } from 'lucide-react-native';
import React from 'react';
import { Image, ScrollView, Text, TouchableOpacity, View } from 'react-native';

export default function SessionDetail() {
  const router = useRouter();
  return (
    <ScrollView className="flex-1 bg-white">
      <View className="p-6 pt-12">
        <Text className="text-3xl font-black mb-6">Advanced{"\n"}Algorithms & Complexity</Text>
        <Image source={{ uri: 'https://via.placeholder.com/400x200' }} className="w-full h-52 rounded-[40px] mb-8" />
        
        <View className="bg-gray-50 p-5 rounded-[30px] mb-4 flex-row items-center">
          <Calendar color="#4F46E5" size={20} />
          <Text className="ml-4 font-bold">Friday, Oct 24 • 14:00 PM</Text>
        </View>

        <Text className="text-xl font-bold mt-8 mb-4">Learning Goals</Text>
        {["Master Big O notation", "Implement dynamic patterns"].map((goal, i) => (
          <View key={i} className="flex-row items-center mb-3">
            <CheckCircle2 size={20} color="#4F46E5" />
            <Text className="ml-3 text-gray-600">{goal}</Text>
          </View>
        ))}

        <View className="bg-gray-50 p-6 rounded-[35px] mt-6">
          <Text className="font-bold">Participants</Text>
          <Text className="text-gray-500 mb-2">8/12 spots taken</Text>
          <View className="h-2 bg-gray-200 rounded-full overflow-hidden">
            <View className="h-full bg-indigo-600 w-[66%]" />
          </View>
        </View>

        <TouchableOpacity onPress={() => router.push('/studyGroup/cancel'as any)} className="mt-8">
          <Text className="text-center text-red-500 font-bold">Cancel Session</Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
}