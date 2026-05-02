import { Link } from 'expo-router';
import { useUser } from "@/hooks/useUser";
import { GraduationCap, User } from "lucide-react-native";
import React from "react";
import { Text, TouchableOpacity, View, Platform } from "react-native";
import { Avatar, AvatarImage } from "@/components/ui/avatar";
import { Box } from "@/components/ui/box";
import { Icon } from "@/components/ui/icon";

type AppHeaderProps = {
  title: string;
  subtitle?: string;
  avatarUrl?: string;
  onLeftPress?: () => void;
  onRightPress?: () => void;
  leftIcon?: React.ReactNode;
};

const AppHeader = ({
  title,
  subtitle,
  avatarUrl,
  onLeftPress,
  onRightPress,
  leftIcon,
}: AppHeaderProps) => {
  const { user } = useUser();

  return (
    <View 
      className="flex-row items-center justify-between px-5 pb-4 bg-white border-b border-gray-100"
      style={{ paddingTop: Platform.OS === 'ios' ? 60 : 50 }}
    >
      <View className="flex-row items-center">
        <View className="bg-indigo-600 p-2 rounded-xl shadow-md shadow-indigo-200">
          <GraduationCap size={20} color="white" strokeWidth={2.5} />
        </View>
      </View>
      
      <View className="flex-row items-start pb-4">
        <Text className="text-2xl font-extrabold text-indigo-900 tracking-tight">
          {title}
        </Text>
      </View>

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
};

export default AppHeader;
