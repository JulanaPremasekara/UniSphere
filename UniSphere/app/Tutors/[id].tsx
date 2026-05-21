import React, { useState } from "react";
import {
  ActivityIndicator,
  Linking,
  ScrollView,
  TouchableOpacity,
  View,
  Alert,
} from "react-native";
import {
  useFocusEffect,
  useLocalSearchParams,
  useRouter,
} from "expo-router";
import {
  ChevronLeft,
  Phone,
  User,
} from "lucide-react-native";

import { Avatar, AvatarImage } from "@/components/ui/avatar";
import { Box } from "@/components/ui/box";
import { HStack } from "@/components/ui/hstack";
import { Icon } from "@/components/ui/icon";
import { Text } from "@/components/ui/text";
import Footer from "@/components/Footer";
import apiClient from "@/services/api";
import { SafeAreaView } from "react-native-safe-area-context";
import { useUser } from "@/hooks/useUser";
import { useTheme } from "@/context/ThemeContext";

export default function TutorProfile() {
  const router = useRouter();
  const { id } = useLocalSearchParams();

  const { userId } = useUser();
  const { colors, isDark } = useTheme();

  const [tutor, setTutor] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [showContact, setShowContact] = useState(false);

  useFocusEffect(
    React.useCallback(() => {
      const fetchTutorDetails = async () => {
        try {
          const response = await apiClient.get(`/tutors/${id}`);
          setTutor(response.data.data || response.data);
        } catch (error) {
          console.error("Backend Fetch Error:", error);
        } finally {
          setLoading(false);
        }
      };

      if (id) fetchTutorDetails();
    }, [id])
  );

  const handleToggleStatus = async () => {
    if (!id || !tutor) return Alert.alert("Error", "Tutor ID missing");

    const newStatus = !tutor.isOnline;
    setLoading(true);
    try {
      await apiClient.patch(`/tutors/${id}/status`, { isOnline: newStatus });

      const response = await apiClient.get(`/tutors/${id}`);
      setTutor(response.data.data || response.data);

      Alert.alert("Success", `Status updated to ${newStatus ? "Online" : "Offline"}`);
    } catch (error: any) {
      console.log("Error Detail:", error.response?.data || error.message);
      Alert.alert("Error", "Failed to update status.");
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = () => {
    Alert.alert("Delete Profile", "This action cannot be undone!", [
      { text: "Cancel", style: "cancel" },
      {
        text: "Delete",
        style: "destructive",
        onPress: async () => {
          try {
            setLoading(true);

            const response = await apiClient.delete(`/tutors/${id}`);

            console.log("Delete success:", response.data);

            Alert.alert("Success", "Tutor profile deleted successfully.", [
              {
                text: "OK",
                onPress: () => router.replace("/tutors"),
              },
            ]);
          } catch (error: any) {
            console.log("Delete error:", error.response?.data || error.message);

            const backendMessage =
              error.response?.data?.message ||
              "Failed to delete profile. Please try again.";

            Alert.alert("Error", backendMessage);
          } finally {
            setLoading(false);
          }
        },
      },
    ]);
  };

  if (loading) {
    return (
      <SafeAreaView style={{ backgroundColor: colors.bg }} className="flex-1 items-center justify-center">
        <ActivityIndicator size="large" color={colors.primary} />
      </SafeAreaView>
    );
  }

  if (!tutor) {
    return (
      <SafeAreaView style={{ backgroundColor: colors.bg }} className="flex-1 items-center justify-center px-6">
        <Text style={{ color: colors.text }} className="text-lg font-bold">Tutor not found</Text>
      </SafeAreaView>
    );
  }

  const isOwner =
    tutor.userId === userId ||
    tutor.ownerId === userId ||
    tutor.createdBy === userId ||
    tutor._id === userId;

  return (
    <SafeAreaView edges={["left", "right"]} style={{ backgroundColor: colors.bg }} className="flex-1">
      <ScrollView showsVerticalScrollIndicator={false} style={{ backgroundColor: colors.bg }}>
        <View style={{ backgroundColor: colors.bg }} className="flex-row justify-between items-center px-5 pt-14 pb-4">
          <View className="flex-row items-center gap-4">
            <TouchableOpacity onPress={() => router.back()}>
              <ChevronLeft size={28} color={colors.text} />
            </TouchableOpacity>

            <Text style={{ color: colors.primary }} className="text-lg font-bold">Tutors</Text>
          </View>
        </View>

        <View className="p-5">
          <View style={{ backgroundColor: colors.bgCard }} className="relative rounded-[30px] overflow-hidden items-center py-10">
            <Avatar
              size="2xl"
              style={{ borderColor: colors.white }}
              className="bg-indigo-600 border-4 shadow-xl"
            >
              {tutor.image ? (
                <AvatarImage
                  source={{ uri: tutor.image }}
                  className="w-full h-full rounded-full"
                />
              ) : (
                <Icon as={User} size="xl" className="text-white" />
              )}
            </Avatar>

            <Box
              style={{ borderColor: colors.white, backgroundColor: tutor.isOnline !== false ? "#22C55E" : "#9CA3AF" }}
              className="absolute bottom-8 right-[40%] w-4 h-4 border-2 rounded-full"
            />
          </View>

          <View className="flex-row items-center mt-4 mb-2 gap-2">
            <View className="w-2 h-2 rounded-full bg-emerald-500" />
            <Text className="text-xs font-bold text-emerald-500 uppercase">
              Available
            </Text>
          </View>

          <View className="flex-row justify-between items-start">
            <Text style={{ color: colors.text }} className="text-3xl font-extrabold flex-1">
              {tutor.name}
            </Text>

            <Text style={{ color: colors.primary }} className="text-2xl font-black">
              {tutor.price}/hr
            </Text>
          </View>

          <View style={{ backgroundColor: colors.bgCard }} className="mt-3 p-3 rounded-2xl self-start">
            <Text style={{ color: colors.textSecondary }} className="text-sm font-medium">
              📘 {tutor.subject}
            </Text>
          </View>

          <View className="mt-6">
            <Text style={{ color: colors.text }} className="text-base font-bold mb-2">
              About
            </Text>
            <Text style={{ color: colors.textSecondary }} className="text-sm leading-5">
              {tutor.bio ||
                `I am ${tutor.name}, specializing in ${tutor.subject}.`}
            </Text>
          </View>

          {showContact && (
            <Box style={{ backgroundColor: colors.primaryLight }} className="mt-6 p-5 rounded-[25px]">
              <Text style={{ color: colors.primary }} className="text-[10px] font-bold uppercase mb-2">
                Contact
              </Text>

              <TouchableOpacity
                onPress={() =>
                  tutor.phone && Linking.openURL(`tel:${tutor.phone}`)
                }
                style={{ backgroundColor: colors.white }}
                className="p-4 rounded-2xl"
              >
                <Text style={{ color: colors.text }} className="font-bold text-lg">
                  {tutor.phone || "No Number"}
                </Text>
              </TouchableOpacity>
            </Box>
          )}

          {isOwner ? (
            <View style={{ backgroundColor: colors.bgCard }} className="mx-5 my-4 p-6 rounded-[40px]">
              <Text style={{ color: colors.textMuted }} className="text-[10px] font-bold text-center tracking-[2px] mb-5 uppercase">
                Admin Controls
              </Text>

              <TouchableOpacity
                onPress={handleToggleStatus}
                style={{ backgroundColor: colors.white, borderColor: colors.border, borderWidth: 1 }}
                className="w-full p-5 rounded-3xl items-center mb-3"
              >
                <Text style={{ color: colors.text }} className="font-bold">
                  {tutor.isOnline ? "Set Offline" : "Set Online"}
                </Text>
              </TouchableOpacity>

              <TouchableOpacity
                onPress={handleDelete}
                style={{ backgroundColor: colors.white, borderColor: colors.border, borderWidth: 1 }}
                className="w-full p-5 rounded-3xl items-center"
              >
                <Text className="font-bold text-red-500">Remove Profile</Text>
              </TouchableOpacity>
            </View>
          ) : (
            <View className="mt-8 mb-10">
              <TouchableOpacity
                style={{ backgroundColor: colors.primary }}
                className="py-5 rounded-3xl items-center"
                onPress={() => setShowContact(true)}
              >
                <HStack className="items-center">
                  <Icon as={Phone} size="sm" className="text-white mr-2" />
                  <Text className="text-white font-bold text-lg">
                    Book a Session
                  </Text>
                </HStack>
              </TouchableOpacity>
            </View>
          )}
        </View>
      </ScrollView>

      <Footer />
    </SafeAreaView>
  );
}