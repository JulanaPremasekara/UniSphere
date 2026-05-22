import { useLocalSearchParams, useRouter } from "expo-router";
import {
  ChevronLeft,
  Calendar,
  Clock,
  MapPin,
  Verified,
  CheckCheck,
  CheckCircle2,
  UserCheck,
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

import Footer from "@/components/Footer";
import { useEventDetail } from "./hooks/useEventDetail";
import { useUser } from "@/hooks/useUser";
import apiClient from "@/services/api";
import { useTheme } from "@/context/ThemeContext";
import { useSafeAreaInsets } from "react-native-safe-area-context";

export default function EventDetail() {
  const insets = useSafeAreaInsets();
  const { id } = useLocalSearchParams();
  const router = useRouter();

  const { userId } = useUser();
  const { colors, isDark } = useTheme();
  const paddingBottomCalculated = Math.max(insets.bottom, 16);
  const totalFooterHeight = 70 + paddingBottomCalculated;

  const { event, loading, isRegistered, registering, register } =
    useEventDetail(id);

  const [confirmModalVisible, setConfirmModalVisible] = useState(false);
  const [loginModalVisible, setLoginModalVisible] = useState(false);

  if (loading) {
    return (
      <SafeAreaView style={{ backgroundColor: colors.bg }} className="flex-1 items-center justify-center">
        <ActivityIndicator size="large" color={colors.primary} />
      </SafeAreaView>
    );
  }

  if (!event) {
    return (
      <SafeAreaView style={{ backgroundColor: colors.bg }} className="flex-1 items-center justify-center px-6">
        <Text style={{ color: colors.text }} className="text-lg font-bold">
          Event not found.
        </Text>

        <TouchableOpacity
          onPress={() => router.back()}
          style={{ backgroundColor: colors.primary }}
          className="mt-4 px-6 py-3 rounded-full"
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

  // Logic gate to check authentication credentials
  const handleRegisterPress = () => {
    if (!userId) {
      setLoginModalVisible(true);
      return;
    }
    if (!isRegistered && !registering) {
      setConfirmModalVisible(true);
    }
  };

  return (
    <SafeAreaView edges={["left", "right"]} style={{ backgroundColor: colors.bg }} className="flex-1">
      <ScrollView 
        showsVerticalScrollIndicator={false} 
        style={{ backgroundColor: colors.bg }}
        contentContainerStyle={{ flexGrow: 1, paddingBottom: totalFooterHeight + 24 }}
      >
        <View style={{ backgroundColor: colors.bg }} className="flex-row justify-between items-center px-5 pt-14 pb-4">
          <View className="flex-row items-center gap-4">
            <TouchableOpacity onPress={() => router.back()}>
              <ChevronLeft size={28} color={colors.text} />
            </TouchableOpacity>

            <Text style={{ color: colors.primary }} className="text-lg font-bold">Events</Text>
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

            <View style={{ backgroundColor: isDark ? "rgba(30, 27, 75, 0.9)" : "rgba(255, 255, 255, 0.9)" }} className="absolute top-4 left-4 px-3 py-1.5 rounded-full">
              <Text style={{ color: colors.primary }} className="text-[10px] font-black uppercase">
                {start.getDate()}{" "}
                {start
                  .toLocaleString("en-US", { month: "short" })
                  .toUpperCase()}
              </Text>
            </View>
          </View>

          <View className="flex-row items-center mt-4 mb-2 gap-2">
            <View style={{ backgroundColor: colors.primary }} className="w-2 h-2 rounded-full" />
            <Text style={{ color: colors.primary }} className="text-xs font-bold uppercase tracking-tighter">
              Status: Open for Registration
            </Text>
          </View>

          <Text style={{ color: colors.text }} className="text-3xl font-extrabold leading-tight">
            {event.title}
          </Text>

          <View className="flex-row items-center mt-3">
            <Verified color={colors.primary} size={18} />
            <Text style={{ color: colors.textSecondary }} className="font-medium ml-2">
              Hosted by {event.organizerName}
            </Text>
          </View>

          <View className="mt-4 gap-y-2">
            <View style={{ backgroundColor: colors.bgCard }} className="flex-row items-center p-3 rounded-2xl self-start">
              <Calendar size={17} color={colors.primary} />
              <Text style={{ color: colors.textSecondary }} className="ml-2 text-sm font-medium">
                {start.toLocaleString()}
              </Text>
            </View>

            <View style={{ backgroundColor: colors.bgCard }} className="flex-row items-center p-3 rounded-2xl self-start">
              <Clock size={17} color={colors.primary} />
              <Text style={{ color: colors.textSecondary }} className="ml-2 text-sm font-medium">
                {end.toLocaleString()}
              </Text>
            </View>

            <View style={{ backgroundColor: colors.bgCard }} className="flex-row items-center p-3 rounded-2xl self-start">
              <MapPin size={17} color={colors.primary} />
              <Text style={{ color: colors.textSecondary }} className="ml-2 text-sm font-medium">
                {event.location}
              </Text>
            </View>
          </View>

          <View className="mt-6">
            <Text style={{ color: colors.text }} className="text-base font-bold mb-2">
              About the Event
            </Text>

            <Text style={{ color: colors.textSecondary }} className="text-sm leading-5">
              {event.description}
            </Text>
          </View>

          {event.tags?.length > 0 && (
            <View className="flex-row flex-wrap mt-6">
              {event.tags.map((tag: any, index: any) => (
                <View
                  key={index}
                  style={{ backgroundColor: colors.primaryLight }}
                  className="px-5 py-2 rounded-full mr-2 mb-2"
                >
                  <Text style={{ color: isDark ? colors.textSecondary : colors.primary }} className="text-xs font-bold">
                    {tag}
                  </Text>
                </View>
              ))}
            </View>
          )}
        </View>

        <View className="flex-1" />

        <View className="mt-10 mb-4 px-5">
          <TouchableOpacity
            onPress={handleRegisterPress} // FIXED: Attached the validation handler here
            disabled={isRegistered || registering}
            style={{ backgroundColor: isRegistered ? colors.primaryLight : colors.primary }}
            className="py-5 rounded-3xl flex-row items-center justify-center"
          >
            {isRegistered && <CheckCheck color={!isDark ? colors.primary : "white"} size={20} />}

            <Text style={{ color: !isDark && isRegistered ? colors.primary : "white" }} className="font-bold text-lg ml-2">
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

      {/* Confirmation Modal */}
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
          <View style={{ backgroundColor: colors.white }} className="rounded-[40px] w-full max-w-sm p-8 shadow-2xl items-center">
            <View style={{ backgroundColor: colors.primaryLight }} className="p-6 rounded-full mb-6">
              <CheckCircle2 size={40} color={colors.primary} />
            </View>

            <Text style={{ color: colors.text }} className="text-2xl font-black mb-2">
              Confirm Attendance?
            </Text>

            <Text style={{ color: colors.textSecondary }} className="text-center text-lg mb-8 leading-relaxed">
              Are you sure you want to register for "{event.title}"? Your
              attendance will be confirmed.
            </Text>

            <View className="flex-row gap-4 w-full">
              <TouchableOpacity
                onPress={() => setConfirmModalVisible(false)}
                style={{ backgroundColor: colors.bgInput }}
                className="flex-1 p-5 rounded-3xl"
              >
                <Text style={{ color: colors.text }} className="font-bold text-center text-lg">
                  Cancel
                </Text>
              </TouchableOpacity>

              <TouchableOpacity
                onPress={async () => {
                  setConfirmModalVisible(false);
                  await register();
                }}
                style={{ backgroundColor: colors.primary }}
                className="flex-1 p-5 rounded-3xl shadow-lg"
              >
                <Text className="text-white font-bold text-center text-lg">
                  Register
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        </TouchableOpacity>
      </Modal>

      {/* Login Requirement Gate Modal */}
      <Modal
        animationType="fade"
        transparent={true}
        visible={loginModalVisible}
        onRequestClose={() => setLoginModalVisible(false)}
      >
        <TouchableOpacity
          activeOpacity={1}
          onPress={() => setLoginModalVisible(false)}
          className="flex-1 bg-black/60 justify-center items-center px-6"
        >
          <View style={{ backgroundColor: colors.white }} className="rounded-[40px] w-full max-w-sm p-8 shadow-2xl items-center">
            <View style={{ backgroundColor: colors.primaryLight }} className="p-6 rounded-full mb-6">
              <UserCheck size={40} color={colors.primary} />
            </View>

            <Text style={{ color: colors.text }} className="text-2xl font-black mb-2">
              Login Required
            </Text>

            <Text style={{ color: colors.textSecondary }} className="text-center text-lg mb-8 leading-relaxed">
              Please sign in to register for events and manage your event schedule.
            </Text>

            <View className="flex-row gap-4 w-full">
              <TouchableOpacity
                onPress={() => setLoginModalVisible(false)}
                style={{ backgroundColor: colors.bgInput }}
                className="flex-1 p-5 rounded-3xl"
              >
                <Text style={{ color: colors.text }} className="font-bold text-center text-lg">
                  Cancel
                </Text>
              </TouchableOpacity>

              <TouchableOpacity
                onPress={() => {
                  setLoginModalVisible(false);
                  router.push("/login" as any);
                }}
                style={{ backgroundColor: colors.primary }}
                className="flex-1 p-5 rounded-3xl shadow-lg"
              >
                <Text className="text-white font-bold text-center text-lg">
                  Sign In
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        </TouchableOpacity>
      </Modal>
    </SafeAreaView>
  );
}