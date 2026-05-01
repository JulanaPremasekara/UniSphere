import React, { useCallback, useState } from "react";
import {
  Image,
  ScrollView,
  TouchableOpacity,
  ActivityIndicator,
  Alert,
  View,
} from "react-native";
import { useLocalSearchParams, useRouter, useFocusEffect } from "expo-router";
import { ChevronLeft, Users } from "lucide-react-native";
import { SafeAreaView } from "react-native-safe-area-context";

import { Text } from "@/components/ui/text";
import { Button, ButtonText } from "@/components/ui/button";
import { HStack } from "@/components/ui/hstack";

import apiClient from "../services/api";
import Footer from "../components/Footer";
import { useUser } from "@/hooks/useUser";

export default function StudyGroupDetailScreen() {
  const { id } = useLocalSearchParams();
  const router = useRouter();

  const { userId } = useUser();

  const [group, setGroup] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  const fetchGroup = useCallback(async () => {
    try {
      setLoading(true);

      const response = await apiClient.get(`/studyGroups/${id}`);

      console.log("Study group response:", response.data);

      const groupData =
        response.data?.data?.data || response.data?.data || response.data;

      setGroup(groupData);
    } catch (error) {
      console.error("Failed to fetch study group:", error);
      setGroup(null);
    } finally {
      setLoading(false);
    }
  }, [id]);

  useFocusEffect(
    useCallback(() => {
      if (id) {
        fetchGroup();
      }
    }, [id, fetchGroup]),
  );

  const handleEdit = () => {
    router.push({
      pathname: "/studyGroup/create",
      params: { editId: String(id) },
    });
  };

  const handleJoin = async () => {
    try {
      const res = await apiClient.patch(`/studyGroups/${group._id}/join`);

      const updatedGroup = res.data?.data?.data || res.data?.data || res.data;

      setGroup(updatedGroup);
    } catch (error) {
      console.error("Join failed:", error);
      Alert.alert("Error", "Could not join study group.");
    }
  };

  const handleDelete = () => {
    Alert.alert("Delete Session", "This action cannot be undone!", [
      { text: "Cancel", style: "cancel" },
      {
        text: "Delete",
        style: "destructive",
        onPress: async () => {
          try {
            await apiClient.delete(`/studyGroups/${id}`);
            router.replace("/studyGroup");
          } catch (error) {
            console.error("Failed to delete study group:", error);
            Alert.alert("Error", "Failed to delete session.");
          }
        },
      },
    ]);
  };

  const parseLearningGoals = (goals: any): string[] => {
    if (!goals) return [];

    try {
      let parsed = goals;

      while (typeof parsed === "string") {
        parsed = JSON.parse(parsed);
      }

      if (Array.isArray(parsed)) {
        return parsed.map((goal) =>
          String(goal)
            .replace(/^\[+|\]+$/g, "")
            .replace(/^"+|"+$/g, "")
            .trim(),
        );
      }

      return [];
    } catch {
      return String(goals)
        .replace(/^\[+|\]+$/g, "")
        .replace(/"+/g, "")
        .split(",")
        .map((goal) => goal.trim())
        .filter(Boolean);
    }
  };

  if (loading) {
    return (
      <SafeAreaView className="flex-1 items-center justify-center bg-white">
        <ActivityIndicator size="large" color="#4F46E5" />
      </SafeAreaView>
    );
  }

  if (!group) {
    return (
      <SafeAreaView className="flex-1 items-center justify-center bg-white px-6">
        <Text className="text-lg font-bold text-slate-900">
          Study group not found.
        </Text>

        <TouchableOpacity
          onPress={() => router.back()}
          className="mt-5 bg-indigo-600 px-6 py-3 rounded-2xl"
        >
          <Text className="text-white font-bold">Go Back</Text>
        </TouchableOpacity>
      </SafeAreaView>
    );
  }

  const learningGoals = parseLearningGoals(group.learningGoals);

  const isOwner =
    String(group.createdBy) === String(userId) ||
    String(group.userId) === String(userId) ||
    String(group.createdBy?._id) === String(userId);

  return (
    <SafeAreaView edges={["left", "right"]} className="flex-1 bg-white">
      <View className="flex-1">
      <ScrollView showsVerticalScrollIndicator={false} className="bg-white" contentContainerStyle={{ paddingBottom: 120 }}>
        <View className="flex-row justify-between items-center px-5 pt-14 pb-4 bg-white">
          <View className="flex-row items-center gap-4">
            <TouchableOpacity onPress={() => router.back()}>
              <ChevronLeft size={28} color="#4B5563" />
            </TouchableOpacity>

            <Text className="text-lg font-bold text-indigo-600">
              Study Group
            </Text>
          </View>
        </View>

        <View className="p-5">
          <View className="relative rounded-[30px] overflow-hidden">
            <Image
              source={{
                uri:
                  group.image ||
                  "https://images.unsplash.com/photo-1519389950473-47ba0277781c",
              }}
              className="w-full h-64"
              resizeMode="cover"
            />

            <View className="absolute top-4 left-4 bg-white/90 px-3 py-1.5 rounded-full">
              <Text className="text-[10px] font-black text-indigo-900 uppercase">
                {group.tag || "GENERAL"}
              </Text>
            </View>
          </View>

          <View className="flex-row items-center mt-4 mb-2 gap-2">
            <View className="w-2 h-2 rounded-full bg-emerald-500" />
            <Text className="text-xs font-bold text-emerald-500 uppercase">
              Status: Open
            </Text>
          </View>

          <Text className="text-3xl font-extrabold text-gray-800 leading-tight">
            {group.subject || "Untitled Study Group"}
          </Text>

          <View className="mt-4 gap-y-2">
            <View className="flex-row items-center bg-gray-50 p-3 rounded-2xl self-start">
              <Text className="mr-2">📍</Text>
              <Text className="text-sm text-gray-600 font-medium">
                {group.location || "No location added"}
              </Text>
            </View>

            <View className="flex-row items-center bg-gray-50 p-3 rounded-2xl self-start">
              <Text className="mr-2">⏰</Text>
              <Text className="text-sm text-gray-600 font-medium">
                {group.time || "No time added"}
              </Text>
            </View>

            <View className="flex-row items-center bg-gray-50 p-3 rounded-2xl self-start">
              <Text className="mr-2">👥</Text>
              <Text className="text-sm text-gray-600 font-medium">
                {group.participants || 0} / {group.maxParticipants || 0}{" "}
                Participants
              </Text>
            </View>
          </View>

          {learningGoals.length > 0 && (
            <View className="mt-6">
              <Text className="text-base font-bold text-gray-800 mb-2">
                Learning Goals
              </Text>

              {learningGoals.map((goal, index) => (
                <Text key={index} className="text-sm text-gray-500 leading-6">
                  • {goal}
                </Text>
              ))}
            </View>
          )}

          {isOwner ? (
            <View className="mx-1 my-8 p-6 bg-gray-100 rounded-[40px]">
              <Text className="text-[10px] font-bold text-gray-400 text-center tracking-[2px] mb-5 uppercase">
                Admin Controls
              </Text>

              <TouchableOpacity
                onPress={handleEdit}
                className="w-full bg-white p-5 rounded-3xl shadow-sm items-center mb-3"
              >
                <Text className="font-bold text-gray-800">Edit Session</Text>
              </TouchableOpacity>

              <TouchableOpacity
                onPress={handleDelete}
                className="w-full bg-white p-5 rounded-3xl shadow-sm items-center"
              >
                <Text className="font-bold text-red-500">Remove Session</Text>
              </TouchableOpacity>
            </View>
          ) : (
            <View className="mt-8 mb-10">
              <Button
                onPress={handleJoin}
                className="bg-indigo-600 rounded-3xl h-16 shadow-lg shadow-indigo-100"
              >
                <HStack space="sm" className="items-center">
                  <Users size={22} color="white" />
                  <ButtonText className="text-white font-bold text-lg">
                    Join Study Group
                  </ButtonText>
                </HStack>
              </Button>
            </View>
          )}
        </View> 
      </ScrollView>
          <View className="absolute bottom-0 left-0 right-0">
                    <Footer />
                  </View>
      </View>
    </SafeAreaView>
  );
}
