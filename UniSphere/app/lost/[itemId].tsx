import React from "react";
import {
  Image,
  SafeAreaView,
  ScrollView,
  Text,
  View,
} from "react-native";
import { useLocalSearchParams } from "expo-router";

import LostAdminActions from "./components/LostAdminActions";
import LostUserActions from "./components/LostUserActions";

// TEMP: simulate logged user
const currentUser = {
  id: "user123",
};

export default function LostDetailScreen() {
  const { itemId } = useLocalSearchParams<{ itemId: string }>();

  // TEMP: fake item (replace with API)
  const item = {
    id: itemId,
    title: "Vintage Leica Camera",
    location: "Library 3rd Floor",
    description: "Found camera in library...",
    type: "FOUND",
    createdBy: "user123", // 👈 change this to test
    image:
      "https://images.unsplash.com/photo-1519183071298-a2962be96e4b",
  };

  const isOwner = currentUser.id === item.createdBy;

  return (
    <SafeAreaView className="flex-1 bg-white">
      <ScrollView>
        {/* Image */}
        <Image
          source={{ uri: item.image }}
          className="h-72 w-full"
          resizeMode="cover"
        />

        <View className="p-5">
          {/* Title */}
          <Text className="text-3xl font-extrabold text-slate-900 mb-2">
            {item.title}
          </Text>

          {/* Location */}
          <Text className="text-sm text-slate-500 mb-4">
            📍 {item.location}
          </Text>

          {/* Description */}
          <Text className="text-base text-slate-600 leading-6 mb-6">
            {item.description}
          </Text>

          {/* CONDITIONAL COMPONENT */}
          {isOwner ? (
            <LostAdminActions itemId={item.id} />
          ) : (
            <LostUserActions itemId={item.id} />
          )}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}