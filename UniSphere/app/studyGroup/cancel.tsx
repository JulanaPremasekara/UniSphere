import { useLocalSearchParams, useRouter } from "expo-router";
import { X } from "lucide-react-native";
import React, { useState } from "react";
import { ActivityIndicator, Alert, Image, Text, TouchableOpacity, View } from "react-native";
import apiClient from "../services/api";

export default function CancelSession() {
  const router = useRouter();
  const { id } = useLocalSearchParams<{ id: string }>();
  const [cancelling, setCancelling] = useState(false);

  const handleCancelSession = async () => {
    if (!id) {
      Alert.alert("Error", "Session ID is missing.");
      return;
    }

    try {
      setCancelling(true);
      const response = await apiClient.delete(`/studyGroups/${id}`);

      if (!response.data?.success) {
        throw new Error(response.data?.message || "Failed to cancel session");
      }

      Alert.alert("Session Cancelled", "The session has been cancelled.", [
        {
          text: "OK",
          onPress: () => router.replace('/studyGroup' as any),
        },
      ]);
    } catch (error: any) {
      const message = error?.response?.data?.message || error?.message || "Could not cancel session";
      Alert.alert("Cancel Failed", message);
    } finally {
      setCancelling(false);
    }
  };

  const handleKeepSession = () => {
    console.log("Keep clicked");
    router.back();
  };

  return (
    <View className="flex-1 bg-gray-100 justify-center px-6">
      <View className="bg-white rounded-[50px] p-10 items-center shadow-xl">
        <View className="bg-red-50 p-5 rounded-full mb-8">
          <X size={32} color="#EF4444" strokeWidth={3} />
        </View>

        <Text className="text-2xl font-black text-gray-900 mb-4">
          Cancel this Session?
        </Text>

        <Text className="text-gray-500 text-center text-base leading-6 mb-8 px-4">
          This action cannot be undone. All 12 members currently enrolled will
          be notified via email immediately.
        </Text>

        <View className="bg-gray-50 p-4 rounded-3xl flex-row items-center w-full mb-10">
          <Image
            source={{ uri: "https://via.placeholder.com/50" }}
            className="w-12 h-12 rounded-full"
          />

          <View className="ml-4">
            <Text className="text-[10px] text-indigo-600 font-bold uppercase">
              Upcoming Session
            </Text>
            <Text className="font-bold text-gray-900">
              Advanced Algorithms Workshop
            </Text>
            <Text className="text-[10px] text-gray-400">
              Tomorrow, 4:00 PM • Room 402
            </Text>
          </View>
        </View>

        <TouchableOpacity
          onPress={handleCancelSession}
          disabled={cancelling}
          activeOpacity={0.8}
          className={`w-full py-5 rounded-[25px] mb-4 ${cancelling ? "bg-red-400" : "bg-red-600"}`}
        >
          {cancelling ? (
            <ActivityIndicator color="white" />
          ) : (
            <Text className="text-white text-center font-bold text-lg">
              Cancel Session
            </Text>
          )}
        </TouchableOpacity>

        <TouchableOpacity
          onPress={handleKeepSession}
          activeOpacity={0.8}
          className="border border-gray-200 w-full py-5 rounded-[25px]"
        >
          <Text className="text-gray-900 text-center font-bold text-lg">
            Keep
          </Text>
        </TouchableOpacity>

        <Text className="text-[10px] text-gray-300 mt-10 uppercase tracking-[2px]">
          UNISPHERE SECURITY PROTOCOL • SESSION ID #88241
        </Text>
      </View>
    </View>
  );
}