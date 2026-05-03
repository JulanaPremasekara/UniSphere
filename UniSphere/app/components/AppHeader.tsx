import { Link } from 'expo-router';
import { useUser } from "@/hooks/useUser";
import { GraduationCap, User } from "lucide-react-native";
import React from "react";
import { Image, Text, TouchableOpacity, View } from "react-native";

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
    <View className="mb-4 flex-row items-center justify-between">
      <View className="flex-row items-center"><View className="bg-indigo-600 p-2 rounded-xl shadow-md shadow-indigo-200"><GraduationCap size={20} color="white" strokeWidth={2.5} /></View></View>
      <View className="flex-1 items-center px-3">
        <Text className="text-2xl font-extrabold text-indigo-600">{title}</Text>
        {subtitle ? (
          <Text className="mt-0.5 text-xs text-slate-400">{subtitle}</Text>
        ) : null}
      </View>

      <TouchableOpacity onPress={onRightPress} className="min-w-8 items-end">
        {avatarUrl ? (
          <Image source={{ uri: avatarUrl }} className="h-9 w-9 rounded-full" />
        ) : (
          
            <Link href="/login" asChild>
              <TouchableOpacity>
                <User color="black" size={24} />
              </TouchableOpacity>
            </Link>
          
        )}
      </TouchableOpacity>
    </View>
  );
};

export default AppHeader;
