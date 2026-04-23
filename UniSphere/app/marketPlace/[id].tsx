import React, { useState, useEffect } from "react";
import axios from 'axios';
import { Avatar, AvatarFallbackText, AvatarImage } from '@/components/ui/avatar';
import { Box } from '@/components/ui/box';
import { HStack } from '@/components/ui/hstack';
import { Text } from '@/components/ui/text';
import { VStack } from '@/components/ui/vstack';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { ChevronLeft, Clock, Heart, MapPin, MessageCircle, MoreVertical, ShieldCheck, Trash2 } from 'lucide-react-native';
import { Image, ScrollView, TouchableOpacity, ActivityIndicator,Alert } from 'react-native';
import { AlertDialog, AlertDialogBackdrop, AlertDialogContent } from '@/components/ui/alert-dialog';
import { Button, ButtonText } from '@/components/ui/button';

export default function ProductDetailScreen() {
  const { id } = useLocalSearchParams();
  const router = useRouter();
  
  // --- STATE MANAGEMENT ---
  const [product, setProduct] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [showDeleteModal, setShowDeleteModal] = useState(false);

  // REPLACE THIS WITH YOUR IP (e.g., 192.168.1.7)
  const API_URL = `http://192.168.1.7:5000/api/marketplace/${id}`;

  // --- FETCH DATA FROM BACKEND ---
  useEffect(() => {
    const fetchProductDetails = async () => {
      try {
        const response = await axios.get(API_URL);
        setProduct(response.data);
      } catch (error) {
        console.error("Backend Fetch Error:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchProductDetails();
  }, [id]);

  // --- DELETE FUNCTION ---
 
const handleDelete = async () => {
  try {
    // 1. Send the request
    const response = await axios.delete(API_URL);
    
    if (response.status === 200) {
      console.log("Deleted successfully");
      setShowDeleteModal(false); // Close the modal
      
      // 2. Use router.replace to go back and force a refresh of the list
      router.replace('/marketplace'); 
    }
  } catch (error) {
    console.error("Delete Error:", error);
    alert("Error deleting item. Please check if your server is running.");
  }
};

  if (loading) return (
    <Box className="flex-1 justify-center items-center bg-white">
      <ActivityIndicator size="large" color="#4F46E5" />
      <Text className="mt-4 text-gray-500">Loading UniSphere Listing...</Text>
    </Box>
  );

  if (!product) return (
    <Box className="flex-1 justify-center items-center bg-white">
      <Text className="text-lg font-bold">Listing not found</Text>
      <Button className="mt-4" onPress={() => router.back()}><ButtonText>Go Back</ButtonText></Button>
    </Box>
  );

  const confirmDelete = () => {
  Alert.alert(
    "Delete Item", // Title
    "Are you sure you want to delete this listing?", // Message
    [
      {
        text: "Cancel",
        style: "cancel"
      },
      { 
        text: "Yes, Delete", 
        style: "destructive", 
        onPress: handleDelete // Runs your actual delete code
      }
    ]
  );
};

  return (
    <Box className="flex-1 bg-white">
      {/* Header */}
      <HStack className="px-6 pt-12 pb-4 items-center justify-between border-b border-gray-50">
        <TouchableOpacity onPress={() => router.back()}><ChevronLeft size={28} color="#1f2937" /></TouchableOpacity>
        <Text className="text-xl font-bold text-indigo-700">UniSphere</Text>
        {/* Simplified Header Actions */}
        <HStack space="lg" className="items-center">
          <TouchableOpacity onPress={confirmDelete}>
            <Trash2 size={24} color="#ef4444" />
          </TouchableOpacity>
          
          <TouchableOpacity onPress={() => router.push(`/marketplace/edit?id=${id}` as any)}>
            <MoreVertical size={24} color="#1f2937" />
          </TouchableOpacity>
        </HStack>
      </HStack>

      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingBottom: 120 }}>
        <Box className="px-4 mt-4">
          <Box className="h-[420px] w-full rounded-[45px] overflow-hidden bg-gray-100">
            <Image source={{ uri: product.image || "https://via.placeholder.com/400" }} className="w-full h-full" resizeMode="cover" />
            <Box className="absolute top-6 left-6 bg-white/90 px-3 py-1 rounded-lg">
              <Text className="text-[10px] font-bold text-indigo-600 uppercase">Verified Seller</Text>
            </Box>
          </Box>
        </Box>

        <VStack className="px-8 mt-6" space="xl">
          <HStack className="justify-between items-start">
            <VStack className="flex-1">
              <Text className="text-3xl font-black text-gray-900 leading-tight">{product.title}</Text>
              <HStack space="xs" className="items-center mt-2">
                <MapPin size={16} color="#6B7280" />
                <Text className="text-gray-500 font-medium">{product.location}</Text>
              </HStack>
            </VStack>
            <VStack className="items-end">
              <Text className="text-2xl font-black text-indigo-600">${product.price}</Text>
              <Text className="text-[10px] font-bold text-gray-400">NEGOTIABLE</Text>
            </VStack>
          </HStack>

          <VStack space="xs">
            <Text className="text-[11px] font-bold text-gray-400 uppercase tracking-widest">Description</Text>
            <Text className="text-gray-600 leading-6 text-base">{product.description}</Text>
          </VStack>

          {/* Seller Card */}
          <HStack className="bg-gray-50 p-5 rounded-[35px] items-center justify-between">
            <HStack space="md" className="items-center">
              <Avatar size="md">
                <AvatarFallbackText>{product.seller?.name || "U"}</AvatarFallbackText>
                <AvatarImage source={{ uri: product.seller?.image }} />
              </Avatar>
              <VStack>
                <Text className="font-bold text-gray-900">{product.seller?.name || "UniSphere User"}</Text>
                <Text className="text-[11px] text-gray-500">Student Seller</Text>
              </VStack>
            </HStack>
            <TouchableOpacity><Text className="text-indigo-600 font-bold text-sm">View Shop</Text></TouchableOpacity>
          </HStack>
        </VStack>
      </ScrollView>

    </Box>
  );
}