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

import apiClient from "@/services/api";
import Footer from "@/components/Footer";
import { useUser } from "@/hooks/useUser";
import { useTheme } from "@/context/ThemeContext";
import axios from "axios";

export default function StudyGroupDetailScreen() {
  const { id } = useLocalSearchParams();
  const router = useRouter();

  const { userId } = useUser();
  const { colors, isDark } = useTheme();

  const [group, setGroup] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  const fetchGroup = useCallback(async () => {
    try {
      setLoading(true);

      const response = await apiClient.get(`/studyGroups/${id}`);

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

      const response = res.data;

      if (!response.success) {
        Alert.alert("Notice", response.message || "Something went wrong");
        return;
      }

      setGroup(response.data);
      Alert.alert("Success", response.message || "Joined successfully!");
    } catch (error) {
      console.error("Join failed:", error);

      let message = "Something went wrong";

      if (axios.isAxiosError(error)) {
        message = error.response?.data?.message || error.message;
      } else if (error instanceof Error) {
        message = error.message;
      }

      Alert.alert("Error", message);
    }
  };

  const handleLeave = async () => {
    try {
      const res = await apiClient.delete(`/studyGroups/${group._id}/leave`);

      const response = res.data;

      if (!response.success) {
        Alert.alert("Notice", response.message || "Something went wrong");
        return;
      }

      setGroup(response.data);
      Alert.alert("Success", "You have left the study group.");
    } catch (error) {
      console.error("Leave failed:", error);
      Alert.alert("Error", "Failed to leave the study group.");
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
      <SafeAreaView style={{ backgroundColor: colors.bg }} className="flex-1 items-center justify-center">
        <ActivityIndicator size="large" color={colors.primary} />
      </SafeAreaView>
    );
  }

  if (!group) {
    return (
      <SafeAreaView style={{ backgroundColor: colors.bg }} className="flex-1 items-center justify-center px-6">
        <Text style={{ color: colors.text }} className="text-lg font-bold">
          Study group not found.
        </Text>

        <TouchableOpacity
          onPress={() => router.back()}
          style={{ backgroundColor: colors.primary }}
          className="mt-5 px-6 py-3 rounded-2xl"
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

  const isJoined = group.joinedUsers?.includes(userId);

  return (
    <SafeAreaView edges={["left", "right"]} style={{ backgroundColor: colors.bg }} className="flex-1">
      <View className="flex-1">
        <ScrollView
          showsVerticalScrollIndicator={false}
          style={{ backgroundColor: colors.bg }}
          contentContainerStyle={{ paddingBottom: 120 }}
        >
          <View style={{ backgroundColor: colors.bg }} className="flex-row justify-between items-center px-5 pt-14 pb-4">
            <View className="flex-row items-center gap-4">
              <TouchableOpacity onPress={() => router.back()}>
                <ChevronLeft size={28} color={colors.text} />
              </TouchableOpacity>

              <Text style={{ color: colors.primary }} className="text-lg font-bold">
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

              <View style={{ backgroundColor: isDark ? "rgba(30, 27, 75, 0.9)" : "rgba(255, 255, 255, 0.9)" }} className="absolute top-4 left-4 px-3 py-1.5 rounded-full">
                <Text style={{ color: colors.primary }} className="text-[10px] font-black uppercase">
                  {group.tag || "GENERAL"}
                </Text>
              </View>
            </View>

            <View className="flex-row items-center mt-4 mb-2 gap-2">
              <View style={{ backgroundColor: colors.primary }} className="w-2 h-2 rounded-full" />
              <Text style={{ color: colors.primary }} className="text-xs font-bold uppercase">
                Status: Open
              </Text>
            </View>

            <Text style={{ color: colors.text }} className="text-3xl font-extrabold leading-tight">
              {group.subject || "Untitled Study Group"}
            </Text>

            <View className="mt-4 gap-y-2">
              <View style={{ backgroundColor: colors.bgCard }} className="flex-row items-center p-3 rounded-2xl self-start">
                <Text className="mr-2">📍</Text>
                <Text style={{ color: colors.textSecondary }} className="text-sm font-medium">
                  {group.location || "No location added"}
                </Text>
              </View>

              <View style={{ backgroundColor: colors.bgCard }} className="flex-row items-center p-3 rounded-2xl self-start">
                <Text className="mr-2">⏰</Text>
                <Text style={{ color: colors.textSecondary }} className="text-sm font-medium">
                  {group.time || "No time added"}
                </Text>
              </View>

              <View style={{ backgroundColor: colors.bgCard }} className="flex-row items-center p-3 rounded-2xl self-start">
                <Text className="mr-2">👥</Text>
                <Text style={{ color: colors.textSecondary }} className="text-sm font-medium">
                  {group.participants || 0} / {group.maxParticipants || 0}{" "}
                  Participants
                </Text>
              </View>
            </View>

            {learningGoals.length > 0 && (
              <View className="mt-6">
                <Text style={{ color: colors.text }} className="text-base font-bold mb-2">
                  Learning Goals
                </Text>

                {learningGoals.map((goal, index) => (
                  <Text key={index} style={{ color: colors.textSecondary }} className="text-sm leading-6">
                    • {goal}
                  </Text>
                ))}
              </View>
            )}

            {isOwner ? (
              <View style={{ backgroundColor: colors.bgCard }} className="mx-1 my-8 p-6 rounded-[40px]">
                <Text style={{ color: colors.textMuted }} className="text-[10px] font-bold text-center tracking-[2px] mb-5 uppercase">
                  Admin Controls
                </Text>

                <TouchableOpacity
                  onPress={handleEdit}
                  style={{ backgroundColor: colors.white, borderColor: colors.border, borderWidth: 1 }}
                  className="w-full p-5 rounded-3xl items-center mb-3"
                >
                  <Text style={{ color: colors.text }} className="font-bold">Edit Session</Text>
                </TouchableOpacity>

                <TouchableOpacity
                  onPress={handleDelete}
                  style={{ backgroundColor: colors.white, borderColor: colors.border, borderWidth: 1 }}
                  className="w-full p-5 rounded-3xl items-center"
                >
                  <Text className="font-bold text-red-500">Remove Session</Text>
                </TouchableOpacity>
              </View>
            ) : (
              <View className="mt-8 mb-10">
                {isJoined ? (
                  <Button
                    onPress={handleLeave}
                    style={{ backgroundColor: colors.bgInput, borderColor: colors.border }}
                    className="rounded-3xl h-16 border"
                  >
                    <HStack space="sm" className="items-center">
                      <Users size={22} color="#EF4444" />
                      <ButtonText className="text-red-500 font-bold text-lg">
                        Leave Study Group
                      </ButtonText>
                    </HStack>
                  </Button>
                ) : (
                  <Button
                    onPress={handleJoin}
                    style={{ backgroundColor: colors.primary }}
                    className="rounded-3xl h-16 shadow-lg"
                  >
                    <HStack space="sm" className="items-center">
                      <Users size={22} color="white" />
                      <ButtonText className="text-white font-bold text-lg">
                        Join Study Group
                      </ButtonText>
                    </HStack>
                  </Button>
                )}
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
