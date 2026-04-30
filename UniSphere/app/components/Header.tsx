import React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import { GraduationCap, User } from 'lucide-react-native';
import { Link } from 'expo-router';
import { Avatar, AvatarImage } from "@/components/ui/avatar";
import { Box } from "@/components/ui/box";
import { Icon } from "@/components/ui/icon";
import { useUser } from '@/hooks/useUser';

export default function Header({ title }: { title: string }) {
  const { user } = useUser();

  return (
    <View className="flex-row justify-between items-center px-5 pt-12 pb-4 bg-white border-b border-gray-100">
      <View className="flex-row items-center">
        <View className="bg-indigo-600 p-2 rounded-xl shadow-md shadow-indigo-200">
          <GraduationCap size={20} color="white" strokeWidth={2.5} />
        </View>
      </View>
      <Text className="text-xl font-bold text-indigo-900 tracking-tight">{title}</Text>
      
      {user ? (
        <Link href="/profile" asChild>
          <TouchableOpacity>
            <View className="relative">
              <Avatar className="bg-indigo-600 w-12 h-12">
                {user.image ? (
                  <AvatarImage 
                    source={{ 
                      uri: user.image.startsWith('http') 
                        ? `${user.image}?t=${new Date().getTime()}` 
                        : `${process.env.EXPO_PUBLIC_API_URL}${user.image}?t=${new Date().getTime()}` 
                    }} 
                    className="w-full h-full rounded-full" 
                  />
                ) : (
                  <Icon as={User} size="lg" className="text-white" />
                )}
              </Avatar>
              <Box 
                className="absolute bottom-0 right-0 w-3.5 h-3.5 rounded-full border-2 border-white bg-green-500" 
              />
            </View>
          </TouchableOpacity>
        </Link>
      ) : (
        <Link href="/login" asChild>
          <TouchableOpacity>
            <User color="black" size={24} />
          </TouchableOpacity>
        </Link>
      )}
    </View>
  );
}