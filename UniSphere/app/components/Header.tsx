import { View, Text, TouchableOpacity } from 'react-native';
import { GraduationCap, User } from 'lucide-react-native';
import { Link } from 'expo-router';
import React from 'react';

export default function Header({ title }: { title: string }) {
  return (
    <View className="flex-row justify-between items-center px-5 pt-12 pb-4 bg-white border-b border-gray-100">
      <View className="flex-row items-center"><View className="bg-indigo-600 p-2 rounded-xl shadow-md shadow-indigo-200"><GraduationCap size={20} color="white" strokeWidth={2.5} /></View></View>
      <Text className="text-xl font-bold text-indigo-900 tracking-tight">{title}</Text>
      <Link href="/login" asChild><TouchableOpacity><User color="black" size={24} /></TouchableOpacity></Link>
    </View>
  );
}