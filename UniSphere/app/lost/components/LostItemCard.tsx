import React from "react";
import { Image, Text, TouchableOpacity, View } from "react-native";
import { LostItem } from "../types/lostItem.types";

type LostItemCardProps = {
  item: LostItem;
  onPress: (itemId: string) => void;
};

const LostItemCard = ({ item, onPress }: LostItemCardProps) => {
  return (
    <TouchableOpacity
      activeOpacity={0.9}
      onPress={() => onPress(item.id)}
      className="mb-6"
    >
      <View className="relative mb-3 overflow-hidden rounded-[30px] bg-slate-50 p-3">
        {item.isMine && (
          <View className="absolute left-3 top-3 z-10 rounded-full bg-indigo-600 px-3 py-1.5">
            <Text className="text-[10px] font-extrabold text-white">
              YOUR POST
            </Text>
          </View>
        )}

        <View
          className={`absolute right-3 top-3 z-10 rounded-full px-3 py-1.5 ${
            item.type === "lost" ? "bg-red-100" : "bg-indigo-100"
          }`}
        >
          <Text
            className={`text-[10px] font-extrabold ${
              item.type === "lost" ? "text-red-600" : "text-indigo-700"
            }`}
          >
            {item.type.toUpperCase()}
          </Text>
        </View>

        <Image
          source={{ uri: item.imageUrl }}
          className="h-[260px] w-full rounded-[24px]"
          resizeMode="cover"
        />
      </View>

      <Text className="mb-2 text-[22px] font-extrabold text-slate-900">
        {item.title}
      </Text>

      <Text className="mb-1 text-[13px] text-slate-500">
        📍 {item.location}
      </Text>

      <Text className="text-[13px] text-slate-500">
        🕒 {item.timeAgo}
      </Text>
    </TouchableOpacity>
  );
};

export default LostItemCard;