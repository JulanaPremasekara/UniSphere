import React, { useEffect, useState, useCallback } from "react";
import { Image, ScrollView, TouchableOpacity, ActivityIndicator, Alert, Linking, Clipboard } from 'react-native';
import { useLocalSearchParams, useRouter, useFocusEffect } from 'expo-router';
import { ChevronLeft, MapPin, PhoneCall, Edit3, Trash2, Phone } from 'lucide-react-native';
import { Box } from '@/components/ui/box';
import { HStack } from '@/components/ui/hstack';
import { Text } from '@/components/ui/text';
import { VStack } from '@/components/ui/vstack';
import { Button, ButtonText } from '@/components/ui/button';
import apiClient from "../services/api";

export default function ProductDetailScreen() {
  const { id } = useLocalSearchParams();
  const router = useRouter();
  const [product, setProduct] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  const fetchProduct = useCallback(async () => {
    try {
      const response = await apiClient.get(`/api/marketplace/${id}`);
      setProduct(response.data.data);
      console.log("Fetched product:", product);

    } catch (error) { console.error(error); } 
    finally { setLoading(false); }
  }, [id]);

  useFocusEffect(useCallback(() => { fetchProduct(); }, [fetchProduct]));

  const handleContact = () => {
    if (product?.contactNumber) {
      Alert.alert(
        "Seller Contact",
        `Phone Number: ${product.contactNumber}`,
        [
          { text: "Cancel", style: "cancel" },
          { text: "Copy Number", onPress: () => {
              Clipboard.setString(product.contactNumber);
              Alert.alert("Success", "Copied to clipboard!");
          }},
          { text: "Call Now", onPress: () => Linking.openURL(`tel:${product.contactNumber}`) }
        ]
      );
    }
  };

  const handleDelete = async () => {
    Alert.alert("Delete", "Remove this item permanently?", [
      { text: "Cancel", style: "cancel" },
      { text: "Delete", style: "destructive", onPress: async () => {
          await apiClient.delete(`/api/marketplace/${id}`);
          router.replace("/marketplace");
      }}
    ]);
  };

  if (loading) return <Box className="flex-1 justify-center items-center bg-white"><ActivityIndicator size="large" color="#4F46E5" /></Box>;
  if (!product) return <Box className="flex-1 justify-center items-center"><Text>Product not found.</Text></Box>;

  return (
    <Box className="flex-1 bg-white">
      <HStack className="absolute top-12 left-0 right-0 z-10 px-6 justify-between items-center">
        <TouchableOpacity onPress={() => router.back()} className="bg-white/80 p-2 rounded-full shadow-sm"><ChevronLeft size={28} color="#1f2937" /></TouchableOpacity>
        <HStack space="md">
          <TouchableOpacity onPress={() => router.push(`/marketplace/edit?id=${id}`)} className="bg-white/80 p-2 rounded-full shadow-sm"><Edit3 size={24} color="#4F46E5" /></TouchableOpacity>
          <TouchableOpacity onPress={handleDelete} className="bg-white/80 p-2 rounded-full shadow-sm"><Trash2 size={24} color="#ef4444" /></TouchableOpacity>
        </HStack>
      </HStack>

      <ScrollView showsVerticalScrollIndicator={false}>
        <Image source={{ uri: product.image }} className="w-full h-[450px]" resizeMode="cover" />
        
        <VStack className="px-8 mt-6 pb-40" space="lg">
          <HStack className="justify-between items-start">
            <VStack className="flex-1">
              <Text className="text-3xl font-black text-gray-900 leading-tight">{product.title}</Text>
              <HStack space="xs" className="mt-1 items-center">
                <MapPin size={16} color="#6366f1" />
                <Text className="text-indigo-600 font-bold">{product.location}</Text>
              </HStack>
            </VStack>
            <Box className="bg-indigo-100 px-3 py-1 rounded-full"><Text className="text-indigo-600 font-bold text-xs uppercase">{product.condition}</Text></Box>
          </HStack>

          <Text className="text-3xl font-black text-indigo-600">${product.price}</Text>

          <HStack className="bg-indigo-50 p-4 rounded-2xl items-center" space="md">
            <Box className="bg-white p-2 rounded-full shadow-sm"><Phone size={20} color="#4F46E5" /></Box>
            <VStack>
              <Text className="text-[10px] font-bold text-indigo-400 uppercase">Seller Contact</Text>
              <Text className="text-indigo-900 font-bold text-lg">{product.contactNumber}</Text>
            </VStack>
          </HStack>

          <VStack className="bg-gray-50 p-5 rounded-3xl border border-gray-100">
            <Text className="text-[11px] font-bold text-gray-400 uppercase mb-2">Description</Text>
            <Text className="text-gray-600 text-base leading-relaxed">{product.description}</Text>
          </VStack>
        </VStack>
      </ScrollView>

      <Box className="absolute bottom-0 w-full p-6 bg-white border-t border-gray-50">
        <Button onPress={handleContact} className="bg-indigo-500 rounded-full h-16 shadow-lg shadow-indigo-100">
          <HStack space="sm" className="items-center"><PhoneCall size={22} color="white" /><ButtonText className="text-white font-bold text-lg">Contact Seller</ButtonText></HStack>
        </Button>
      </Box>
    </Box>
  );
}