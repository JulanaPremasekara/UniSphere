import React, { useState } from "react";
import { ScrollView, TouchableOpacity, View, Alert, ActivityIndicator } from "react-native";
import { useRouter, useLocalSearchParams } from "expo-router";
import { ShieldOff, Trash2, User, ChevronLeft } from "lucide-react-native";

import { Box } from "@/components/ui/box";
import { HStack } from "@/components/ui/hstack";
import { VStack } from "@/components/ui/vstack";
import { Text } from "@/components/ui/text";
import { Icon } from "@/components/ui/icon";
import { Avatar } from "@/components/ui/avatar";
import Footer from "@/components/Footer";
import apiClient from "@/services/api";
import { useTheme } from "@/context/ThemeContext";

export default function SettingsScreen() {
  const router = useRouter();
  const { id } = useLocalSearchParams();
  const { colors } = useTheme();
  const [loading, setLoading] = useState(false);

  const handleToggleStatus = async () => {
    if (!id) return Alert.alert("Error", "Tutor ID missing");

    setLoading(true);
    try {
      await apiClient.patch(`/tutors/${id}/status`, { isOnline: false });
      Alert.alert("Success", "Status updated successfully.");
      router.replace("/tutors");
    } catch (error: any) {
      console.log("Error Detail:", error.response?.data || error.message);
      Alert.alert("Error", "Failed to update status.");
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteAccount = async () => {
    if (!id) return Alert.alert("Error", "Tutor ID missing");

    Alert.alert("Delete Profile", "Are you sure? This action cannot be undone.", [
      { text: "Cancel", style: "cancel" },
      {
        text: "Delete",
        style: "destructive",
        onPress: async () => {
          setLoading(true);
          try {
            await apiClient.delete(`/tutors/${id}`);
            Alert.alert("Deleted", "Your profile has been removed.");
            router.replace("/tutors");
          } catch (error) {
            console.error("Delete Error:", error);
            Alert.alert("Error", "Failed to delete account.");
          } finally {
            setLoading(false);
          }
        },
      },
    ]);
  };

  return (
    <ScrollView style={{ backgroundColor: colors.bg }} className="flex-1">
      <HStack style={{ backgroundColor: colors.bg }} className="p-6 mt-10 justify-between items-center">
        <TouchableOpacity
          onPress={() => router.back()}
          style={{ backgroundColor: colors.bgCard }}
          className="p-2 rounded-full"
        >
          <Icon as={ChevronLeft} size="lg" style={{ color: colors.text }} />
        </TouchableOpacity>

        <Text style={{ color: colors.text }} className="text-xl font-bold">Settings</Text>

        <Avatar size="sm" style={{ backgroundColor: colors.bgCard }}>
          <Icon as={User} style={{ color: colors.textMuted }} size="sm" />
        </Avatar>
      </HStack>

      <VStack className="px-6 mt-4" space="xl">
        <VStack className="items-center">
          <Text style={{ color: colors.primary }} className="font-bold text-xs uppercase tracking-widest">
            Account Management
          </Text>
          <Text style={{ color: colors.text }} className="text-4xl font-bold mt-2 text-center">
            Settings &amp; Safety.
          </Text>
        </VStack>

        {/* GO OFFLINE CARD */}
        <Box style={{ backgroundColor: colors.bgCard, borderColor: colors.border, borderWidth: 1 }} className="p-6 rounded-[40px] shadow-sm">
          <HStack className="justify-between items-start">
            <Box style={{ backgroundColor: colors.primaryLight }} className="p-3 rounded-full">
              <Icon as={ShieldOff} size="md" style={{ color: colors.primary }} />
            </Box>
            <HStack style={{ backgroundColor: colors.bgInput, borderColor: colors.border, borderWidth: 1 }} className="items-center px-3 py-1 rounded-full">
              <View className="w-2 h-2 bg-green-500 rounded-full mr-2" />
              <Text className="text-green-600 text-[10px] font-bold uppercase">Status Ready</Text>
            </HStack>
          </HStack>

          <Text style={{ color: colors.text }} className="text-2xl font-bold mt-4">Switch Status?</Text>
          <Text style={{ color: colors.textSecondary }} className="mt-2">
            Toggling this will change your visibility in search results.
          </Text>

          <VStack className="mt-6" space="sm">
            <TouchableOpacity
              onPress={() => router.back()}
              style={{ backgroundColor: colors.bgInput }}
              className="p-4 rounded-full"
              disabled={loading}
            >
              <Text style={{ color: colors.textSecondary }} className="text-center font-bold">Cancel</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={{ backgroundColor: colors.primary }}
              className="p-4 rounded-full"
              onPress={handleToggleStatus}
              disabled={loading}
            >
              {loading ? (
                <ActivityIndicator color="white" />
              ) : (
                <Text className="text-center font-bold text-white">Switch Status</Text>
              )}
            </TouchableOpacity>
          </VStack>
        </Box>

        {/* DELETE ACCOUNT CARD */}
        <Box style={{ backgroundColor: colors.bgCard, borderColor: colors.border, borderWidth: 1 }} className="p-6 rounded-[40px] shadow-sm mb-10">
          <Box className="bg-red-100 p-3 rounded-full w-12">
            <Icon as={Trash2} size="md" className="text-red-600" />
          </Box>
          <Text style={{ color: colors.text }} className="text-2xl font-bold mt-4">Close account?</Text>

          <VStack className="mt-6" space="sm">
            <TouchableOpacity
              onPress={() => router.back()}
              style={{ borderColor: colors.border, borderWidth: 1 }}
              className="p-4 rounded-full"
              disabled={loading}
            >
              <Text style={{ color: colors.textSecondary }} className="text-center font-bold">Keep Profile</Text>
            </TouchableOpacity>

            <TouchableOpacity
              className="bg-red-600 p-4 rounded-full"
              onPress={handleDeleteAccount}
              disabled={loading}
            >
              <Text className="text-center font-bold text-white">Delete Account</Text>
            </TouchableOpacity>
          </VStack>
        </Box>
        <Footer />
      </VStack>
    </ScrollView>
  );
}