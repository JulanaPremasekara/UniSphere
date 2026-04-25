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
  return (
    <View className="mb-4 flex-row items-center justify-between">
      <TouchableOpacity onPress={onLeftPress} className="min-w-8 p-1">
        {leftIcon ? leftIcon : <Text className="text-xl text-slate-500">☰</Text>}
      </TouchableOpacity>

      <View className="flex-1 items-center px-3">
        <Text className="text-2xl font-extrabold text-indigo-600">{title}</Text>
        {subtitle ? (
          <Text className="mt-0.5 text-xs text-slate-400">{subtitle}</Text>
        ) : null}
      </View>

      <TouchableOpacity onPress={onRightPress} className="min-w-8 items-end">
        {avatarUrl ? (
          <Image
            source={{ uri: avatarUrl }}
            className="h-9 w-9 rounded-full"
          />
        ) : (
          <View className="h-9 w-9 rounded-full bg-slate-200" />
        )}
      </TouchableOpacity>
    </View>
  );
};

export default AppHeader;