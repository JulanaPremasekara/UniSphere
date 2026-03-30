import { View, Text, TouchableOpacity } from 'react-native';
import { Menu, User } from 'lucide-react-native';
import { Link } from 'expo-router'; // 1. Import Link
import React from 'react';

export default function Header({ title }: { title: string }) {
  return (
    <View className="flex-row justify-between items-center px-5 pt-12 pb-4 bg-white border-b border-gray-100">
      
      {/* Menu Button */}
      <TouchableOpacity>
        <Menu color="black" size={24} />
      </TouchableOpacity>
      
      {/* Title */}
      <Text className="text-xl font-bold text-indigo-900 tracking-tight">{title}</Text>
      
      {/* 2. Wrap the Profile icon with Link to navigate to Login */}
      <Link href="/login" asChild>
        <TouchableOpacity>
          <User color="black" size={24} />
        </TouchableOpacity>
      </Link>

    </View>
  );
}