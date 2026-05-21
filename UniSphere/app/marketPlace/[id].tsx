import React, { useState, useCallback } from "react";
import {
  Image,
  ScrollView,
  TouchableOpacity,
  ActivityIndicator,
  Alert,
  Linking,
  Clipboard,
  View,
} from "react-native";
import { useLocalSearchParams, useRouter, useFocusEffect } from "expo-router";
import { ChevronLeft, PhoneCall } from "lucide-react-native";
import { SafeAreaView } from "react-native-safe-area-context";

import { Box } from "@/components/ui/box";
import { Text } from "@/components/ui/text";
import { Button, ButtonText } from "@/components/ui/button";
import { HStack } from "@/components/ui/hstack";

import apiClient from "@/services/api";
import Footer from "@/components/Footer";
import { useUser } from "@/hooks/useUser";
import { useTheme } from "@/context/ThemeContext";

export default function ProductDetailScreen() {
  const { id } = useLocalSearchParams();
  const router = useRouter();

  const { userId } = useUser();
  const { colors, isDark } = useTheme();

  const [product, setProduct] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  const fetchProduct = useCallback(async () => {
    try {
      const response = await apiClient.get(`/api/marketplace/${id}`);
      setProduct(response.data.data);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  }, [id]);

  useFocusEffect(
    useCallback(() => {
      fetchProduct();
    }, [fetchProduct])
  );

  const handleContact = () => {
    if (product?.contactNumber) {
      Alert.alert("Seller Contact", `Phone Number: ${product.contactNumber}`, [
        { text: "Cancel", style: "cancel" },
        {
          text: "Copy Number",
          onPress: () => {
            Clipboard.setString(product.contactNumber);
            Alert.alert("Success", "Copied to clipboard!");
          },
        },
        {
          text: "Call Now",
          onPress: () => Linking.openURL(`tel:${product.contactNumber}`),
        },
      ]);
    }
  };

  const handleEdit = () => {
    router.push(`/marketplace/edit?id=${id}` as any);
  };

  const handleDelete = () => {
    Alert.alert("Delete Item", "This action cannot be undone!", [
      { text: "Cancel", style: "cancel" },
      {
        text: "Delete",
        style: "destructive",
        onPress: async () => {
          try {
            await apiClient.delete(`/api/marketplace/${id}`);
            router.replace("/marketplace");
          } catch (error) {
            Alert.alert("Error", "Failed to delete item.");
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

  if (!product) {
    return (
      <SafeAreaView style={{ backgroundColor: colors.bg }} className="flex-1 items-center justify-center px-6">
        <Text style={{ color: colors.text }} className="text-lg font-bold">
          Product not found.
        </Text>
      </SafeAreaView>
    );
  }

  const isOwner = product.seller === userId;

  return (
    <SafeAreaView edges={["left", "right"]} style={{ backgroundColor: colors.bg }} className="flex-1">
      <ScrollView showsVerticalScrollIndicator={false} style={{ backgroundColor: colors.bg }}>
        <View style={{ backgroundColor: colors.bg }} className="flex-row justify-between items-center px-5 pt-14 pb-4">
          <View className="flex-row items-center gap-4">
            <TouchableOpacity onPress={() => router.back()}>
              <ChevronLeft size={28} color={colors.text} />
            </TouchableOpacity>

            <Text style={{ color: colors.primary }} className="text-lg font-bold">
              Marketplace
            </Text>
          </View>
        </View>

        <View className="p-5">
          <View className="relative rounded-[30px] overflow-hidden">
            <Image
              source={{ uri: product.image }}
              className="w-full h-64"
              resizeMode="cover"
            />

            <View style={{ backgroundColor: isDark ? "rgba(30, 27, 75, 0.9)" : "rgba(255, 255, 255, 0.9)" }} className="absolute top-4 left-4 px-3 py-1.5 rounded-full">
              <Text style={{ color: colors.primary }} className="text-[10px] font-black uppercase">
                {product.condition || "Item"}
              </Text>
            </View>
          </View>

          <View className="flex-row items-center mt-4 mb-2 gap-2">
            <View style={{ backgroundColor: colors.primary }} className="w-2 h-2 rounded-full" />
            <Text style={{ color: colors.primary }} className="text-xs font-bold uppercase">
              Status: Available
            </Text>
          </View>

          <View className="flex-row justify-between items-start gap-4">
            <Text style={{ color: colors.text }} className="text-3xl font-extrabold leading-tight flex-1">
              {product.title}
            </Text>

            <Text style={{ color: colors.primary }} className="text-3xl font-black">
              ${product.price}
            </Text>
          </View>

          <View className="mt-4 gap-y-2">
            <View style={{ backgroundColor: colors.bgCard }} className="flex-row items-center p-3 rounded-2xl self-start">
              <Text className="mr-2">📍</Text>
              <Text style={{ color: colors.textSecondary }} className="text-sm font-medium">
                {product.location}
              </Text>
            </View>

            <View style={{ backgroundColor: colors.bgCard }} className="flex-row items-center p-3 rounded-2xl self-start">
              <Text className="mr-2">📞</Text>
              <Text style={{ color: colors.textSecondary }} className="text-sm font-medium">
                {product.contactNumber}
              </Text>
            </View>
          </View>

          <View className="mt-6">
            <Text style={{ color: colors.text }} className="text-base font-bold mb-2">
              Description
            </Text>
            <Text style={{ color: colors.textSecondary }} className="text-sm leading-5">
              {product.description}
            </Text>
          </View>

          {isOwner ? (
            <View style={{ backgroundColor: colors.bgCard }} className="mx-5 my-4 p-6 rounded-[40px]">
              <Text style={{ color: colors.textMuted }} className="text-[10px] font-bold text-center tracking-[2px] mb-5 uppercase">
                Admin Controls
              </Text>

              <TouchableOpacity
                onPress={handleEdit}
                style={{ backgroundColor: colors.white, borderColor: colors.border, borderWidth: 1 }}
                className="w-full p-5 rounded-3xl items-center mb-3"
              >
                <Text style={{ color: colors.text }} className="font-bold">Edit Details</Text>
              </TouchableOpacity>

              <TouchableOpacity
                onPress={handleDelete}
                style={{ backgroundColor: colors.white, borderColor: colors.border, borderWidth: 1 }}
                className="w-full p-5 rounded-3xl items-center"
              >
                <Text className="font-bold text-red-500">Remove Listing</Text>
              </TouchableOpacity>
            </View>
          ) : (
            <View className="mt-8 mb-10">
              <Button
                onPress={handleContact}
                style={{ backgroundColor: colors.primary }}
                className="rounded-3xl h-16 shadow-lg"
              >
                <HStack space="sm" className="items-center">
                  <PhoneCall size={22} color="white" />
                  <ButtonText className="text-white font-bold text-lg">
                    Contact Seller
                  </ButtonText>
                </HStack>
              </Button>
            </View>
          )}
        </View>
      </ScrollView>
      <Footer />
    </SafeAreaView>
  );
}