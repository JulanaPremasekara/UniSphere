import { useRouter } from 'expo-router';
import { Book, MapPin, X } from 'lucide-react-native';
import React from 'react';
import { ScrollView, Text, TextInput, TouchableOpacity, View } from 'react-native';

export default function CreateSession() {
  const router = useRouter();
  return (
    <ScrollView className="flex-1 bg-white p-6 pt-12">
      <View className="flex-row justify-between items-center mb-2">
        <Text className="text-3xl font-bold">Post Session</Text>
        <TouchableOpacity onPress={() => router.back()}><X color="black" /></TouchableOpacity>
      </View>
      <Text className="text-gray-500 mb-8">Coordinate a study group in the Academic Gallery.</Text>

      <Text className="font-bold mb-2">Subject Title</Text>
      <View className="bg-gray-50 flex-row items-center p-4 rounded-3xl mb-6">
        <Book size={20} color="#9CA3AF" />
        <TextInput className="ml-3 flex-1" placeholder="e.g. Advanced Macroeconomics" />
      </View>

      <Text className="font-bold mb-2">Location</Text>
      <View className="bg-gray-50 flex-row items-center p-4 rounded-3xl mb-6">
        <MapPin size={20} color="#9CA3AF" />
        <TextInput className="ml-3 flex-1" placeholder="Level 4, North Library" />
      </View>

      <TouchableOpacity className="bg-indigo-600 p-5 rounded-[25px] mt-10">
        <Text className="text-white text-center font-bold">Post Session</Text>
      </TouchableOpacity>
    </ScrollView>
  );
}