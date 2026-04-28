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

import apiClient from "../services/api";
import Footer from "../components/Footer";
import { useUser } from "@/hooks/useUser";

export default function ProductDetailScreen() {
  const { id } = useLocalSearchParams();
  const router = useRouter();

  const { userId } = useUser();

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
      <SafeAreaView className="flex-1 items-center justify-center bg-white">
        <ActivityIndicator size="large" color="#4F46E5" />
      </SafeAreaView>
    );
  }

  if (!product) {
    return (
      <SafeAreaView className="flex-1 items-center justify-center bg-white px-6">
        <Text className="text-lg font-bold text-slate-900">
          Product not found.
        </Text>
      </SafeAreaView>
    );
  }

  const isOwner =product.seller === userId;
    
  return (
    <SafeAreaView edges={["left", "right"]} className="flex-1 bg-white">
      <ScrollView showsVerticalScrollIndicator={false} className="bg-white">
        <View className="flex-row justify-between items-center px-5 pt-14 pb-4 bg-white">
          <View className="flex-row items-center gap-4">
            <TouchableOpacity onPress={() => router.back()}>
              <ChevronLeft size={28} color="#4B5563" />
            </TouchableOpacity>

            <Text className="text-lg font-bold text-indigo-600">
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

            <View className="absolute top-4 left-4 bg-white/90 px-3 py-1.5 rounded-full">
              <Text className="text-[10px] font-black text-indigo-900 uppercase">
                {product.condition || "Item"}
              </Text>
            </View>
          </View>

          <View className="flex-row items-center mt-4 mb-2 gap-2">
            <View className="w-2 h-2 rounded-full bg-emerald-500" />
            <Text className="text-xs font-bold text-emerald-500 uppercase">
              Status: Available
            </Text>
          </View>

          <View className="flex-row justify-between items-start gap-4">
            <Text className="text-3xl font-extrabold text-gray-800 leading-tight flex-1">
              {product.title}
            </Text>

            <Text className="text-3xl font-black text-indigo-600">
              ${product.price}
            </Text>
          </View>

          <View className="mt-4 gap-y-2">
            <View className="flex-row items-center bg-gray-50 p-3 rounded-2xl self-start">
              <Text className="mr-2">📍</Text>
              <Text className="text-sm text-gray-600 font-medium">
                {product.location}
              </Text>
            </View>

            <View className="flex-row items-center bg-gray-50 p-3 rounded-2xl self-start">
              <Text className="mr-2">📞</Text>
              <Text className="text-sm text-gray-600 font-medium">
                {product.contactNumber}
              </Text>
            </View>
          </View>

          <View className="mt-6">
            <Text className="text-base font-bold text-gray-800 mb-2">
              Description
            </Text>
            <Text className="text-sm text-gray-500 leading-5">
              {product.description}
            </Text>
          </View>

          {isOwner ? (
            <View className="mx-5 my-4 p-6 bg-gray-100 rounded-[40px]">
              <Text className="text-[10px] font-bold text-gray-400 text-center tracking-[2px] mb-5 uppercase">
                Admin Controls
              </Text>

              {/* <TouchableOpacity className="w-full bg-white p-5 rounded-3xl shadow-sm items-center mb-3">
                <Text className="font-bold text-gray-800">Mark Sold</Text>
              </TouchableOpacity> */}

              <TouchableOpacity
                onPress={handleEdit}
                className="w-full bg-white p-5 rounded-3xl shadow-sm items-center mb-3"
              >
                <Text className="font-bold text-gray-800">Edit Details</Text>
              </TouchableOpacity>

              <TouchableOpacity
                onPress={handleDelete}
                className="w-full bg-white p-5 rounded-3xl shadow-sm items-center"
              >
                <Text className="font-bold text-red-500">Remove Listing</Text>
              </TouchableOpacity>
            </View>
          ) : (
            <View className="mt-8 mb-10">
              <Button
                onPress={handleContact}
                className="bg-indigo-600 rounded-3xl h-16 shadow-lg shadow-indigo-100"
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

        <Footer />
      </ScrollView>
    </SafeAreaView>
  );
}