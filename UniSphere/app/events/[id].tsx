import { useLocalSearchParams, useRouter } from "expo-router";
import {
  ChevronLeft,
  Calendar,
  Clock,
  MapPin,
  Verified,
  CheckCheck,
  CheckCircle2,
} from "lucide-react-native";
import {
  Modal,
  Image,
  ScrollView,
  Text,
  TouchableOpacity,
  View,
  ActivityIndicator,
  Alert,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import React, { useState } from "react";

import Footer from "../components/Footer";
import { useEventDetail } from "../../hooks/useEventDetail";
import { useUser } from "@/hooks/useUser";
import apiClient from "../services/api";

export default function EventDetail() {
  const { id } = useLocalSearchParams();
  const router = useRouter();

  const { userId } = useUser();

  const { event, loading, isRegistered, registering, register } =
    useEventDetail(id);

  const [confirmModalVisible, setConfirmModalVisible] = useState(false);

  if (loading) {
    return (
      <SafeAreaView className="flex-1 items-center justify-center bg-white">
        <ActivityIndicator size="large" color="#4F46E5" />
      </SafeAreaView>
    );
  }

  if (!event) {
    return (
      <SafeAreaView className="flex-1 items-center justify-center bg-white px-6">
        <Text className="text-lg font-bold text-slate-900">
          Event not found.
        </Text>

        <TouchableOpacity
          onPress={() => router.back()}
          className="mt-4 bg-indigo-600 px-6 py-3 rounded-full"
        >
          <Text className="text-white font-bold">Go Back</Text>
        </TouchableOpacity>
      </SafeAreaView>
    );
  }

  const start = new Date(event.startDate);
  const end = new Date(event.endDate);

  const isOwner =
    userId === event.userId ||
    userId === event.createdBy ||
    userId === event.organizerId;

  const handleEdit = () => {
    router.push({
      pathname: "/events/create",
      params: { editId: event.id || id },
    });
  };

  const handleDelete = () => {
    Alert.alert("Delete Event", "This action cannot be undone!", [
      { text: "Cancel", style: "cancel" },
      {
        text: "Delete",
        style: "destructive",
        onPress: async () => {
          try {
            await apiClient.delete(`/events/${event.id || id}`);
            router.replace("/events");
          } catch {
            Alert.alert("Error", "Failed to delete event.");
          }
        },
      },
    ]);
  };

  return (
    <SafeAreaView edges={["left", "right"]} className="flex-1 bg-white">
      <ScrollView showsVerticalScrollIndicator={false} className="bg-white">
        <View className="flex-row justify-between items-center px-5 pt-14 pb-4 bg-white">
          <View className="flex-row items-center gap-4">
            <TouchableOpacity onPress={() => router.back()}>
              <ChevronLeft size={28} color="#4B5563" />
            </TouchableOpacity>

            <Text className="text-lg font-bold text-indigo-600">Events</Text>
          </View>
        </View>

        <View className="p-5">
          <View className="relative rounded-[30px] overflow-hidden">
            <Image
              source={{
                uri:
                  event.image ||
                  "https://images.unsplash.com/photo-1635070041078-e363dbe005cb",
              }}
              className="w-full h-64"
              resizeMode="cover"
            />

            <View className="absolute top-4 left-4 bg-white/90 px-3 py-1.5 rounded-full">
              <Text className="text-[10px] font-black text-indigo-900 uppercase">
                {start.getDate()}{" "}
                {start
                  .toLocaleString("en-US", { month: "short" })
                  .toUpperCase()}
              </Text>
            </View>
          </View>

          <View className="flex-row items-center mt-4 mb-2 gap-2">
            <View className="w-2 h-2 rounded-full bg-indigo-500" />
            <Text className="text-xs font-bold text-indigo-500 uppercase tracking-tighter">
              Status: Open for Registration
            </Text>
          </View>

          <Text className="text-3xl font-extrabold text-gray-800 leading-tight">
            {event.title}
          </Text>

          <View className="flex-row items-center mt-3">
            <Verified color="#4F46E5" size={18} />
            <Text className="text-gray-600 font-medium ml-2">
              Hosted by {event.organizerName}
            </Text>
          </View>

          <View className="mt-4 gap-y-2">
            <View className="flex-row items-center bg-gray-50 p-3 rounded-2xl self-start">
              <Calendar size={17} color="#4F46E5" />
              <Text className="ml-2 text-sm text-gray-600 font-medium">
                {start.toLocaleString()}
              </Text>
            </View>

            <View className="flex-row items-center bg-gray-50 p-3 rounded-2xl self-start">
              <Clock size={17} color="#4F46E5" />
              <Text className="ml-2 text-sm text-gray-600 font-medium">
                {end.toLocaleString()}
              </Text>
            </View>

            <View className="flex-row items-center bg-gray-50 p-3 rounded-2xl self-start">
              <MapPin size={17} color="#4F46E5" />
              <Text className="ml-2 text-sm text-gray-600 font-medium">
                {event.location}
              </Text>
            </View>
          </View>

          <View className="mt-6">
            <Text className="text-base font-bold text-gray-800 mb-2">
              About the Event
            </Text>

            <Text className="text-sm text-gray-500 leading-5">
              {event.description}
            </Text>
          </View>

          {event.tags?.length > 0 && (
            <View className="flex-row flex-wrap mt-6">
              {event.tags.map((tag: any, index: any) => (
                <View
                  key={index}
                  className="bg-indigo-100 px-5 py-2 rounded-full mr-2 mb-2"
                >
                  <Text className="text-indigo-700 text-xs font-bold">
                    {tag}
                  </Text>
                </View>
              ))}
            </View>
          )}
        </View>

        <View className="mt-8 mb-10 px-5">
              <TouchableOpacity
                onPress={() =>
                  !isRegistered && !registering && setConfirmModalVisible(true)
                }
                disabled={isRegistered || registering}
                className={`${
                  isRegistered ? "bg-indigo-400" : "bg-indigo-600"
                } py-5 rounded-3xl flex-row items-center justify-center`}
              >
                {isRegistered && <CheckCheck color="white" size={20} />}

                <Text className="text-white font-bold text-lg ml-2">
                  {registering
                    ? "Registering..."
                    : isRegistered
                    ? "Registered"
                    : "RSVP / Register"}
                </Text>
              </TouchableOpacity>
      </View>
      </ScrollView>

      <Footer />

      <Modal
        animationType="fade"
        transparent={true}
        visible={confirmModalVisible}
        onRequestClose={() => setConfirmModalVisible(false)}
      >
        <TouchableOpacity
          activeOpacity={1}
          onPress={() => setConfirmModalVisible(false)}
          className="flex-1 bg-black/60 justify-center items-center px-6"
        >
          <View className="bg-white rounded-[40px] w-full max-w-sm p-8 shadow-2xl items-center">
            <View className="bg-indigo-50 p-6 rounded-full mb-6">
              <CheckCircle2 size={40} color="#4F46E5" />
            </View>

            <Text className="text-2xl font-black text-gray-900 mb-2">
              Confirm Attendance?
            </Text>

            <Text className="text-gray-500 text-center text-lg mb-8 leading-relaxed">
              Are you sure you want to register for "{event.title}"? Your
              attendance will be confirmed.
            </Text>

            <View className="flex-row gap-4 w-full">
              <TouchableOpacity
                onPress={() => setConfirmModalVisible(false)}
                className="flex-1 bg-gray-50 p-5 rounded-3xl"
              >
                <Text className="text-gray-900 font-bold text-center text-lg">
                  Cancel
                </Text>
              </TouchableOpacity>

              <TouchableOpacity
                onPress={async () => {
                  setConfirmModalVisible(false);
                  await register();
                }}
                className="flex-1 bg-indigo-600 p-5 rounded-3xl shadow-lg shadow-indigo-200"
              >
                <Text className="text-white font-bold text-center text-lg">
                  Register
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        </TouchableOpacity>
      </Modal>
    </SafeAreaView>
  );
}