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
  ShieldCheck,
  Star,
  User,
} from "lucide-react-native";

import { Avatar, AvatarImage } from "@/components/ui/avatar";
import { Box } from "@/components/ui/box";
import { HStack } from "@/components/ui/hstack";
import { Icon } from "@/components/ui/icon";
import { Text } from "@/components/ui/text";
import Footer from "../components/Footer";
import apiClient from "../services/api";
import { SafeAreaView } from "react-native-safe-area-context";
import { useUser } from "@/hooks/useUser";

export default function TutorProfile() {
  const router = useRouter();
  const { id } = useLocalSearchParams();

  const { userId } = useUser();

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

  // const handleEdit = () => {
  //   router.push(`/Tutors/setup?id=${id}` as any);
  // };
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
      <SafeAreaView className="flex-1 items-center justify-center bg-white">
        <ActivityIndicator size="large" color="#4338CA" />
      </SafeAreaView>
    );
  }

  if (!tutor) {
    return (
      <SafeAreaView className="flex-1 items-center justify-center bg-white px-6">
        <Text className="text-lg font-bold">Tutor not found</Text>
      </SafeAreaView>
    );
  }

  const isOwner =
    tutor.userId === userId ||
    tutor.ownerId === userId ||
    tutor.createdBy === userId ||
    tutor._id === userId;

  return (
    <SafeAreaView edges={["left", "right"]} className="flex-1 bg-white">
      <ScrollView showsVerticalScrollIndicator={false} className="bg-white">
        <View className="flex-row justify-between items-center px-5 pt-14 pb-4 bg-white">
          <View className="flex-row items-center gap-4">
            <TouchableOpacity onPress={() => router.back()}>
              <ChevronLeft size={28} color="#4B5563" />
            </TouchableOpacity>

            <Text className="text-lg font-bold text-indigo-600">Tutors</Text>
          </View>
        </View>

        <View className="p-5">
          <View className="relative rounded-[30px] overflow-hidden items-center bg-gray-50 py-10">
            <Avatar
              size="2xl"
              className="bg-indigo-600 border-4 border-white shadow-xl"
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
              className={`absolute bottom-8 right-[40%] w-4 h-4 border-2 border-white rounded-full ${
                tutor.isOnline !== false ? "bg-green-500" : "bg-gray-400"
              }`}
            />
          </View>

          <View className="flex-row items-center mt-4 mb-2 gap-2">
            <View className="w-2 h-2 rounded-full bg-emerald-500" />
            <Text className="text-xs font-bold text-emerald-500 uppercase">
              Available
            </Text>
          </View>

          <View className="flex-row justify-between items-start">
            <Text className="text-3xl font-extrabold text-gray-800 flex-1">
              {tutor.name}
            </Text>

            <Text className="text-2xl font-black text-indigo-600">
              {tutor.price}/hr
            </Text>
          </View>

          <View className="mt-3 bg-gray-50 p-3 rounded-2xl self-start">
            <Text className="text-sm text-gray-600 font-medium">
              📘 {tutor.subject}
            </Text>
          </View>

          <View className="mt-3 bg-gray-50 p-3 rounded-2xl self-start flex-row items-center">
            <Star size={16} color="#6366f1" />
            <Text className="ml-2 text-sm text-gray-600 font-medium">
              4.9 Rating
            </Text>
          </View>

          <View className="mt-6">
            <Text className="text-base font-bold text-gray-800 mb-2">
              About
            </Text>
            <Text className="text-sm text-gray-500 leading-5">
              {tutor.bio ||
                `I am ${tutor.name}, specializing in ${tutor.subject}.`}
            </Text>
          </View>

          {showContact && (
            <Box className="mt-6 bg-indigo-50 p-5 rounded-[25px]">
              <Text className="text-[10px] font-bold text-indigo-400 uppercase mb-2">
                Contact
              </Text>

              <TouchableOpacity
                onPress={() =>
                  tutor.phone && Linking.openURL(`tel:${tutor.phone}`)
                }
                className="bg-white p-4 rounded-2xl"
              >
                <Text className="text-indigo-900 font-bold text-lg">
                  {tutor.phone || "No Number"}
                </Text>
              </TouchableOpacity>
            </Box>
          )}

          {isOwner ? (
            <View className="mx-5 my-4 p-6 bg-gray-100 rounded-[40px]">
              <Text className="text-[10px] font-bold text-gray-400 text-center tracking-[2px] mb-5 uppercase">
                Admin Controls
              </Text>

              <TouchableOpacity 
              onPress={handleToggleStatus}
              className="w-full bg-white p-5 rounded-3xl shadow-sm items-center mb-3"
              >
                <Text className="font-bold text-gray-800">
                  {tutor.isOnline ? "Set Offline" : "Set Online"}
                </Text>
              </TouchableOpacity>

              {/* <TouchableOpacity
                className="w-full bg-white p-5 rounded-3xl shadow-sm items-center mb-3"
              >
                <Text className="font-bold text-gray-800">Edit Profile</Text>
              </TouchableOpacity> */}

              <TouchableOpacity
                onPress={handleDelete}
                className="w-full bg-white p-5 rounded-3xl shadow-sm items-center"
              >
                <Text className="font-bold text-red-500">Remove Profile</Text>
              </TouchableOpacity>
            </View>
          ) : (
            <View className="mt-8 mb-10">
              <TouchableOpacity
                className="bg-indigo-600 py-5 rounded-3xl items-center"
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

          {/* {isOwner && (
            <TouchableOpacity
              onPress={() =>
                router.push({
                  pathname: "/Tutors/settings",
                  params: { id: tutor._id || id },
                })
              }
              className="bg-white border border-gray-100 p-5 rounded-[25px] shadow-sm w-full mt-4 mb-10"
            >
              <HStack className="justify-between items-center">
                <HStack space="md" className="items-center">
                  <Icon as={ShieldCheck} size="sm" className="text-gray-500" />
                  <Text className="font-bold text-black text-lg">
                    Settings & Safety
                  </Text>
                </HStack>
              </HStack>
            </TouchableOpacity>
          )} */}
        </View>
      </ScrollView>

      <Footer />
    </SafeAreaView>
  );
}