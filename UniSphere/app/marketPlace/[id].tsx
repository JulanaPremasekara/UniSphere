import React, { useEffect, useState, useCallback } from "react";
import { Image, ScrollView, TouchableOpacity, ActivityIndicator, Alert, Linking, Clipboard } from 'react-native';
import { useLocalSearchParams, useRouter, useFocusEffect } from 'expo-router';
import { ChevronLeft, MapPin, PhoneCall, Edit3, Trash2, Phone, MessageCircle, Heart } from 'lucide-react-native';
import { Box } from '@/components/ui/box';
import { HStack } from '@/components/ui/hstack';
import { Text } from '@/components/ui/text';
import { VStack } from '@/components/ui/vstack';
import { Button, ButtonText } from '@/components/ui/button';
import apiClient from "../services/api";
import { AlertDialog, AlertDialogBackdrop, AlertDialogContent } from "@/components/ui/alert-dialog";

export default function ProductDetailScreen() {
  const { id } = useLocalSearchParams();
  const router = useRouter();
  const [product, setProduct] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [showDeleteModal, setShowDeleteModal] = useState(false);

  const fetchProduct = useCallback(async () => {
    try {
      const response = await apiClient.get(`/api/marketplace/${id}`);
      setProduct(response.data);
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

  const handleDelete = () => {
    setShowDeleteModal(true);
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

      {/* Footer Buttons */}
      <Box className="absolute bottom-6 left-6 right-6 flex-row" style={{ height: 70 }}>
        <TouchableOpacity className="flex-1 bg-indigo-600 rounded-full flex-row items-center justify-center shadow-lg shadow-indigo-300">
          <MessageCircle size={22} color="white" />
          <Text className="text-white font-bold text-lg ml-2">Message Seller</Text>
        </TouchableOpacity>
        <TouchableOpacity className="ml-4 w-[70px] h-[70px] bg-white rounded-full items-center justify-center border border-gray-100 shadow-sm">
          <Heart size={26} color="#1f2937" />
        </TouchableOpacity>
      </Box>
      <AlertDialog
  isOpen={showDeleteModal}
  onClose={() => setShowDeleteModal(false)}
  size="md"
>
  <AlertDialogBackdrop />
  <AlertDialogContent className="rounded-[40px] p-8">
    <VStack space="lg" className="items-center">
      
      {/* Icon Circle */}
      <Box className="bg-red-100 w-16 h-16 rounded-full items-center justify-center">
         <Trash2 size={28} color="#991b1b" />
      </Box>

      {/* Text Content */}
      <VStack space="xs" className="items-center">
        <Text className="text-2xl font-bold text-gray-900 text-center">
          Delete this item?
        </Text>
        <Text className="text-gray-500 text-center px-4">
          This action cannot be undone. The listing will be permanently removed from UniSphere.
        </Text>
      </VStack>

      {/* Action Buttons */}
      <VStack space="sm" className="w-full mt-4">
        <Button
          className="bg-red-800 rounded-full h-14"
          onPress={async () => {
            try {
              await apiClient.delete(`/api/marketplace/${id}`);
              setShowDeleteModal(false);
              router.replace("/marketplace");
            } catch (error) {
              console.error("Delete failed:", error);
              Alert.alert("Error", "Failed to delete item.");
            }
          }}
        >
          <ButtonText className="font-bold text-lg">Yes, Delete</ButtonText>
        </Button>
      </VStack>
    </VStack>
  </AlertDialogContent>
</AlertDialog>
    </Box>
  );
}