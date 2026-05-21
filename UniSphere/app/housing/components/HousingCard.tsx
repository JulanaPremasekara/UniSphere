/// <reference types="nativewind/types" />
import React from "react";
import { View, Text, TouchableOpacity, Image } from "react-native";
import { MapPin } from "lucide-react-native";
import { useTheme } from "@/context/ThemeContext";

interface HousingCardProps {
  item: {
    id: string;
    title: string;
    location: string;
    rentPrice: number;
    roomType: string;
    images?: string[];
    isMine: boolean;
  };
  onPress: () => void;
}

export default function HousingCard({ item, onPress }: HousingCardProps) {
  const { colors, isDark } = useTheme();

  return (
    <TouchableOpacity
      activeOpacity={0.9}
      onPress={onPress}
      style={{
        backgroundColor: colors.bgCard,
        borderRadius: 30,
        borderWidth: 1,
        borderColor: colors.border,
        marginBottom: 24,
        overflow: "hidden",
      }}
      className="shadow-sm"
    >
      {/* Image */}
      <View className="relative">
        {item.images && item.images.length > 0 ? (
          <Image
            source={{ uri: item.images[0] }}
            className="w-full h-48"
            resizeMode="cover"
          />
        ) : (
          <View style={{ backgroundColor: colors.bgInput }} className="w-full h-48 justify-center items-center">
            <Text style={{ color: colors.textMuted }}>No image</Text>
          </View>
        )}

        {/* Room Type Badge (indigo style like Lost) */}
        <View style={{ backgroundColor: isDark ? "rgba(30, 27, 75, 0.9)" : "rgba(255, 255, 255, 0.9)" }} className="absolute top-4 left-4 px-3 py-1.5 rounded-full">
          <Text style={{ color: colors.primary }} className="text-[10px] font-black uppercase">
            {item.roomType}
          </Text>
        </View>
      </View>

      {/* Content */}
      <View className="p-5">
        {/* Title */}
        <Text
          style={{ color: colors.text }}
          className="text-xl font-extrabold mb-2"
          numberOfLines={1}
        >
          {item.title}
        </Text>

        {/* Location */}
        <View style={{ backgroundColor: colors.bgInput }} className="flex-row items-center px-3 py-2 rounded-2xl self-start mb-4">
          <MapPin size={14} color={colors.primary} />
          <Text style={{ color: colors.textSecondary }} className="text-xs font-medium ml-2">
            {item.location}
          </Text>
        </View>

        {/* Price */}
        <View className="flex-row justify-between items-center">
          <Text style={{ color: colors.primary }} className="font-black text-lg">
            LKR {item.rentPrice}
            <Text style={{ color: colors.textMuted }} className="text-sm font-medium"> /month</Text>
          </Text>
        </View>
      </View>
    </TouchableOpacity>
  );
}