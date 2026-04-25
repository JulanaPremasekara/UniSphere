import React, { useEffect } from "react";
import { Image, ScrollView, TouchableOpacity, ActivityIndicator, Alert } from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { ChevronLeft, MapPin, Trash2, MoreVertical } from 'lucide-react-native';
import { Avatar, AvatarFallbackText, AvatarImage } from '@/components/ui/avatar';
import { Box } from '@/components/ui/box';
import { HStack } from '@/components/ui/hstack';
import { Text } from '@/components/ui/text';
import { VStack } from '@/components/ui/vstack';
import { Button, ButtonText } from '@/components/ui/button';
import { useMarketplace } from "@/hooks/useMarketplace";

export default function ProductDetailScreen() {
  const { id } = useLocalSearchParams();
  const router = useRouter();
  const { product, loading, fetchProductById, deleteProduct } = useMarketplace();

  useEffect(() => {
    if (id) fetchProductById(id as string);
  }, [id, fetchProductById]);

  const confirmDelete = () => {
    Alert.alert("Delete Item", "Are you sure?", [
      { text: "Cancel", style: "cancel" },
      { text: "Yes, Delete", style: "destructive", onPress: async () => {
          try {
            await deleteProduct(id as string);
            router.replace('/marketplace');
          } catch (e) {
            alert("Error deleting item.");
          }
        }
      }
    ]);
  };

  if (loading) return (
    <Box className="flex-1 justify-center items-center bg-white">
      <ActivityIndicator size="large" color="#4F46E5" />
    </Box>
  );

  if (!product) return (
    <Box className="flex-1 justify-center items-center bg-white">
      <Text>Listing not found</Text>
      <Button onPress={() => router.back()}><ButtonText>Go Back</ButtonText></Button>
    </Box>
  );

  return (
    <Box className="flex-1 bg-white">
      <HStack className="px-6 pt-12 pb-4 items-center justify-between border-b border-gray-50">
        <TouchableOpacity onPress={() => router.back()}><ChevronLeft size={28} color="#1f2937" /></TouchableOpacity>
        <Text className="text-xl font-bold text-indigo-700">UniSphere</Text>
        <HStack space="lg" className="items-center">
          <TouchableOpacity onPress={confirmDelete}><Trash2 size={24} color="#ef4444" /></TouchableOpacity>
          <TouchableOpacity onPress={() => router.push(`/marketplace/edit?id=${id}` as any)}><MoreVertical size={24} color="#1f2937" /></TouchableOpacity>
        </HStack>
      </HStack>
      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingBottom: 120 }}>
        <Box className="px-4 mt-4">
          <Box className="h-[420px] w-full rounded-[45px] overflow-hidden bg-gray-100">
            <Image source={{ uri: product.image || "https://via.placeholder.com/400" }} className="w-full h-full" resizeMode="cover" />
          </Box>
        </Box>
        <VStack className="px-8 mt-6" space="xl">
          <HStack className="justify-between items-start">
            <VStack className="flex-1">
              <Text className="text-3xl font-black text-gray-900 leading-tight">{product.title}</Text>
              <HStack space="xs" className="items-center mt-2">
                <MapPin size={16} color="#6B7280" /><Text className="text-gray-500">{product.location}</Text>
              </HStack>
            </VStack>
            <VStack className="items-end">
              <Text className="text-2xl font-black text-indigo-600">${product.price}</Text>
            </VStack>
          </HStack>
          <VStack space="xs">
            <Text className="text-[11px] font-bold text-gray-400 uppercase">Description</Text>
            <Text className="text-gray-600 text-base">{product.description}</Text>
          </VStack>
        </VStack>
      </ScrollView>
    </Box>
  );
}