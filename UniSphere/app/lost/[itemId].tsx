import React from "react";
import {
  ActivityIndicator,
  Image,
  ScrollView,
  Text,
  View,
} from "react-native";
import { useLocalSearchParams } from "expo-router";
import { SafeAreaView } from "react-native-safe-area-context";

import LostAdminActions from "./components/LostAdminActions";
import LostUserActions from "./components/LostUserActions";
import { useLostItemDetailQuery } from "./hooks/useLostItems";

const currentUser = {
  id: "user123",
};

export default function LostDetailScreen() {
  const { itemId } = useLocalSearchParams<{ itemId: string }>();

  const {
    data: item,
    isLoading,
    isError,
    error,
  } = useLostItemDetailQuery(itemId as string);

  if (isLoading) {
    return (
      <SafeAreaView className="flex-1 items-center justify-center bg-white">
        <ActivityIndicator size="large" color="#4F46E5" />
      </SafeAreaView>
    );
  }

  if (isError || !item) {
    return (
      <SafeAreaView className="flex-1 items-center justify-center bg-white px-6">
        <Text className="mb-2 text-lg font-bold text-slate-900">
          Failed to load item details
        </Text>
        <Text className="text-center text-sm text-slate-500">
          {error instanceof Error ? error.message : "Something went wrong"}
        </Text>
      </SafeAreaView>
    );
  }

  const isOwner = currentUser.id === item.createdBy;

  return (
    <SafeAreaView className="flex-1 bg-white">
      <ScrollView>
        <Image
          source={{ uri: item.image }}
          className="h-72 w-full"
          resizeMode="cover"
        />

        <View className="p-5">
          <Text className="mb-2 text-3xl font-extrabold text-slate-900">
            {item.title}
          </Text>

          <Text className="mb-4 text-sm text-slate-500">
            📍 {item.location}
          </Text>

          <Text className="mb-6 text-base leading-6 text-slate-600">
            {item.features || item.description}
          </Text>

          {isOwner ? (
            <LostAdminActions itemId={item.id} />
          ) : (
            <LostUserActions
              itemId={item.id}
              phoneNumber={item.reporterPhone}
            />
          )}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}