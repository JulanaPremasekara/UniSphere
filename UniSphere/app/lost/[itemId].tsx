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
import Footer from "@/components/Footer";
import { useTheme } from "@/context/ThemeContext";

export default function LostDetailScreen() {
  const { itemId } = useLocalSearchParams<{ itemId: string }>();
  const { userId } = useUser();
  const { colors, isDark } = useTheme();

  const {
    data: item,
    isLoading,
    isError,
    error,
  } = useLostItemDetailQuery(itemId as string);

  if (isLoading) {
    return (
      <SafeAreaView style={{ backgroundColor: colors.bg }} className="flex-1 items-center justify-center">
        <ActivityIndicator size="large" color={colors.primary} />
      </SafeAreaView>
    );
  }

  if (isError || !item) {
    return (
      <SafeAreaView style={{ backgroundColor: colors.bg }} className="flex-1 items-center justify-center px-6">
        <Text style={{ color: colors.text }} className="mb-2 text-lg font-bold">
          Failed to load item details
        </Text>
        <Text style={{ color: colors.textSecondary }} className="text-center text-sm">
          {error instanceof Error ? error.message : "Something went wrong"}
        </Text>
      </SafeAreaView>
    );
  }

  const isOwner = userId === item.reporter;
  const isResolved = item.status?.toLowerCase() === "resolved";

  return (
    <SafeAreaView edges={["left", "right"]} style={{ backgroundColor: colors.bg }} className="flex-1">
      <View className="flex-1">
        <ScrollView showsVerticalScrollIndicator={false} style={{ backgroundColor: colors.bg }} contentContainerStyle={{ paddingBottom: 120 }}>
          <View style={{ backgroundColor: colors.bg }} className="flex-row justify-between items-center px-5 pt-14 pb-4">
            <View className="flex-row items-center gap-4">
              <TouchableOpacity onPress={() => router.back()}>
                <Text style={{ color: colors.text }} className="text-2xl">←</Text>
              </TouchableOpacity>
              <Text style={{ color: colors.primary }} className="text-lg font-bold">
                Lost & Found
              </Text>
            </View>
          </View>
          <View className="p-5">
            <View className="relative rounded-[30px] overflow-hidden">
              <Image
                source={{ uri: item.image }}
                className="w-full h-64"
                resizeMode="cover"
              />
              <View style={{ backgroundColor: isDark ? "rgba(30, 27, 75, 0.9)" : "rgba(255, 255, 255, 0.9)" }} className="absolute top-4 left-4 px-3 py-1.5 rounded-full">
                <Text style={{ color: colors.primary }} className="text-[10px] font-black uppercase">
                  {item.category}
                </Text>
              </View>
            </View>

            <View className="flex-row items-center mt-4 mb-2 gap-2">
              <View style={{ backgroundColor: colors.primary }} className="w-2 h-2 rounded-full" />
              <Text style={{ color: colors.primary }} className="text-xs font-bold uppercase tracking-tighter">
                Status: {item.status || "Active"}
              </Text>
            </View>

            <Text style={{ color: colors.text }} className="text-3xl font-extrabold leading-tight">
              {item.title}
            </Text>

            <View className="mt-4 gap-y-2">
              <View style={{ backgroundColor: colors.bgCard }} className="flex-row items-center p-3 rounded-2xl self-start">
                <Text className="mr-2">📍</Text>
                <Text style={{ color: colors.textSecondary }} className="text-sm font-medium">
                  {item.location}
                </Text>
              </View>
              <View style={{ backgroundColor: colors.bgCard }} className="flex-row items-center p-3 rounded-2xl self-start">
                <Text className="mr-2">📅</Text>
                <Text style={{ color: colors.textSecondary }} className="text-sm font-medium">
                  {new Date(item.createdAt).toLocaleDateString()}
                </Text>
              </View>
            </View>

            <View className="mt-6">
              <Text style={{ color: colors.text }} className="text-base font-bold mb-2">
                Description
              </Text>
              <Text style={{ color: colors.textSecondary }} className="text-sm leading-5">
                {item.features || item.description}
              </Text>
            </View>
            {!isResolved &&
              (isOwner ? (
                <LostAdminActions itemId={itemId as string} />
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
