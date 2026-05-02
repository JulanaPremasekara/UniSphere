import React from "react";
import {
  ActivityIndicator,
  Image,
  ScrollView,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { router, useLocalSearchParams } from "expo-router";
import { SafeAreaView } from "react-native-safe-area-context";

import LostAdminActions from "./components/LostAdminActions";
import LostUserActions from "./components/LostUserActions";
import { useLostItemDetailQuery } from "./hooks/useLostItems";

import { useUser } from "@/hooks/useUser";
import Footer from "../components/Footer";

export default function LostDetailScreen() {
  const { itemId } = useLocalSearchParams<{ itemId: string }>();
  const { userId, user } = useUser();

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

  const isOwner = userId === item.reporter;
  const isResolved = item.status?.toLowerCase() === "resolved";

  return (
    <SafeAreaView edges={["left", "right"]} className="flex-1 bg-white">
      <View className="flex-1">
        <ScrollView showsVerticalScrollIndicator={false} className="bg-white" contentContainerStyle={{ paddingBottom: 120 }}>
          <View className="flex-row justify-between items-center px-5 pt-14 pb-4 bg-white">
            <View className="flex-row items-center gap-4">
              <TouchableOpacity onPress={() => router.back()}>
                <Text className="text-2xl text-gray-600">←</Text>
              </TouchableOpacity>
              <Text className="text-lg font-bold text-indigo-600">
                Lost & Found
              </Text>
            </View>
            <View className="flex-row gap-5">
              <TouchableOpacity>
                <Text className="text-xl text-gray-400">🔗</Text>
              </TouchableOpacity>
              {/*<TouchableOpacity>
                <Text className="text-xl text-gray-400">⋮</Text>
              </TouchableOpacity>*/}
            </View>
          </View>
          <View className="p-5">
            <View className="relative rounded-[30px] overflow-hidden">
              <Image
                source={{ uri: item.image }}
                className="w-full h-64"
                resizeMode="cover"
              />
              <View className="absolute top-4 left-4 bg-white/90 px-3 py-1.5 rounded-full">
                <Text className="text-[10px] font-black text-indigo-900 uppercase">
                  {item.category}
                </Text>
              </View>
            </View>

            <View className="flex-row items-center mt-4 mb-2 gap-2">
              <View className="w-2 h-2 rounded-full bg-emerald-500" />
              <Text className="text-xs font-bold text-emerald-500 uppercase tracking-tighter">
                Status: Active
              </Text>
            </View>

            <Text className="text-3xl font-extrabold text-gray-800 leading-tight">
              {item.title}
            </Text>

            <View className="mt-4 gap-y-2">
              <View className="flex-row items-center bg-gray-50 p-3 rounded-2xl self-start">
                <Text className="mr-2">📍</Text>
                <Text className="text-sm text-gray-600 font-medium">
                  {item.location}
                </Text>
              </View>
              <View className="flex-row items-center bg-gray-50 p-3 rounded-2xl self-start">
                <Text className="mr-2">📅</Text>
                <Text className="text-sm text-gray-600 font-medium">
                  {new Date(item.createdAt).toLocaleDateString()}
                </Text>
              </View>
            </View>

            <View className="mt-6">
              <Text className="text-base font-bold text-gray-800 mb-2">
                Description
              </Text>
              <Text className="text-sm text-gray-500 leading-5">
                {item.features || item.description}
              </Text>
            </View>
            {!isResolved &&
              (isOwner ? (
                <LostAdminActions itemId={itemId} />
              ) : (
                <LostUserActions
                  itemId={item.title}
                  category={item.category || "General"}
                  ownerid={item.reporter}
                />
              ))}
          </View>
        </ScrollView>
        <View className="absolute bottom-0 left-0 right-0">
          <Footer />
        </View>
      </View>
    </SafeAreaView>
  );
}
