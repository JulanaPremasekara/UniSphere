import React from "react";
import { View, Text, TouchableOpacity, Image } from "react-native";
import { MapPin } from "lucide-react-native";

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
  return (
    <TouchableOpacity
      activeOpacity={0.9}
      onPress={onPress}
      className="bg-white rounded-[30px] border border-gray-100 shadow-sm mb-6 overflow-hidden"
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
          <View className="w-full h-48 bg-gray-200 justify-center items-center">
            <Text className="text-gray-400">No image</Text>
          </View>
        )}

        {/* Room Type Badge (indigo style like Lost) */}
        <View className="absolute top-4 left-4 bg-white/90 px-3 py-1.5 rounded-full">
          <Text className="text-[10px] font-black text-indigo-900 uppercase">
            {item.roomType}
          </Text>
        </View>
      </View>

      {/* Content */}
      <View className="p-5">
        {/* Title */}
        <Text
          className="text-xl font-extrabold text-gray-900 mb-2"
          numberOfLines={1}
        >
          {item.title}
        </Text>

        {/* Location */}
        <View className="flex-row items-center bg-gray-50 px-3 py-2 rounded-2xl self-start mb-4">
          <MapPin size={14} color="#6B7280" />
          <Text className="text-gray-600 text-xs font-medium ml-2">
            {item.location}
          </Text>
        </View>

        {/* Price */}
        <View className="flex-row justify-between items-center">
          <Text className="text-indigo-600 font-black text-lg">
            LKR {item.rentPrice}
            <Text className="text-gray-400 text-sm font-medium"> /month</Text>
          </Text>
        </View>
      </View>
    </TouchableOpacity>
  );
}