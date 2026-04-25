import { Avatar, AvatarFallbackText, AvatarImage } from '@/components/ui/avatar';
import { Box } from '@/components/ui/box';
import { HStack } from '@/components/ui/hstack';
import { Text } from '@/components/ui/text';
import { VStack } from '@/components/ui/vstack';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { ChevronLeft, Clock, Heart, MapPin, MessageCircle, MoreVertical, ShieldCheck } from 'lucide-react-native';
import React, { useState } from "react";
import { Image, ScrollView, TouchableOpacity } from 'react-native';
import { Trash2 } from 'lucide-react-native'; // Or your preferred icon library
import {
  AlertDialog,
  AlertDialogBackdrop,
  AlertDialogContent,
  AlertDialogHeader,
  AlertDialogBody,
  AlertDialogFooter,
} from '@/components/ui/alert-dialog'; // Update this path based on your project structure
import { Button, ButtonText } from '@/components/ui/button';

export default function ProductDetailScreen() {
  const { id } = useLocalSearchParams();
  const router = useRouter();
  const [showDeleteModal, setShowDeleteModal] = useState(false);

  // 1. Define your data array
  const PRODUCTS = [
    { 
      id: "1", 
      title: "Modern Physics: Third Edition", 
      price: "$45.00", 
      image: "https://images.unsplash.com/photo-1544947950-fa07a98d237f?q=80&w=1000", 
      description: "Lightly used book. Perfect for studying.",
      location: "Main Library, North Campus",
      condition: "Like New",
      listed: "2 hours ago",
      seller: { name: "Alex Rivera", joined: "2 years ago", sales: 14, image: "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde" }
    },
    { 
      id: "2", 
      title: "MacBook Air M2 (8GB/256GB)", 
      price: "$850.00", 
      image: "https://images.unsplash.com/photo-1517336714731-489689fd1ca8?q=80&w=1000", 
      description: "Space Gray, excellent condition. Battery health 98%. Comes with original charger.",
      location: "Engineering Faculty",
      condition: "Used - Excellent",
      listed: "45 mins ago",
      seller: { name: "Sarah Chen", joined: "1 year ago", sales: 8, image: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80" }
    },
  ];

  // 2. FIND the product based on the ID from the URL
  const product = PRODUCTS.find((p) => p.id === id);

  // 3. Handle cases where the ID doesn't match anything
  if (!product) {
    return (
      <Box className="flex-1 justify-center items-center">
        <Text>Product not found</Text>
        <Button onPress={() => router.back()}><ButtonText>Go Back</ButtonText></Button>
      </Box>
    );
  }

  return (
    <Box className="flex-1 bg-white">
      {/* Header */}
      <HStack className="px-6 pt-12 pb-4 items-center justify-between border-b border-gray-50">
  <TouchableOpacity onPress={() => router.back()}>
    <ChevronLeft size={28} color="#1f2937" />
  </TouchableOpacity>

  <Text className="text-xl font-bold text-indigo-700">UniSphere</Text>

  <HStack space="lg" className="items-center">
    {/* Delete Icon (Trash Bin) */}
    <TouchableOpacity onPress={() => setShowDeleteModal(true)}>
      <Trash2 size={24} color="#ef4444" /> {/* Red color for delete */}
    </TouchableOpacity>

    {/* Edit Icon (Three Dots) */}
    <TouchableOpacity onPress={() => router.push(`/marketplace/edit?id=${id}` as any)}>
      <MoreVertical size={24} color="#1f2937" />
    </TouchableOpacity>
  </HStack>
</HStack>


      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingBottom: 120 }}>
        <Box className="px-4 mt-4">
          <Box className="h-[420px] w-full rounded-[45px] overflow-hidden bg-gray-100">
            {/* DYNAMIC IMAGE SOURCE */}
            <Image 
              source={{ uri: product.image }} 
              className="w-full h-full"
              resizeMode="cover"
            />
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
              <Text className="text-2xl font-black text-indigo-600">{product.price}</Text>
              <Text className="text-[10px] font-bold text-gray-400">NEGOTIABLE</Text>
            </VStack>
          </HStack>

          <VStack space="xs">
            <Text className="text-[11px] font-bold text-gray-400 uppercase tracking-widest">Description</Text>
            <Text className="text-gray-600 leading-6 text-base">{product.description}</Text>
          </VStack>

          {/* Seller Profile Card (Dynamic) */}
          <HStack className="bg-gray-50 p-5 rounded-[35px] items-center justify-between">
            <HStack space="md" className="items-center">
              <Avatar size="md">
                <AvatarFallbackText>{product.seller.name}</AvatarFallbackText>
                <AvatarImage source={{ uri: product.seller.image }} />
              </Avatar>
              <VStack>
                <Text className="font-bold text-gray-900">{product.seller.name}</Text>
                <Text className="text-[11px] text-gray-500">Joined {product.seller.joined} • {product.seller.sales} sales</Text>
              </VStack>
            </HStack>
            <TouchableOpacity><Text className="text-indigo-600 font-bold text-sm">View Shop</Text></TouchableOpacity>
          </HStack>

          {/* Condition & Time Grid (Dynamic) */}
          <HStack space="md">
            <Box className="flex-1 bg-gray-50 p-5 rounded-[30px] items-center">
              <ShieldCheck size={22} color="#4F46E5" />
              <Text className="text-[10px] font-bold text-gray-400 uppercase mt-2">Condition</Text>
              <Text className="font-bold text-gray-900">{product.condition}</Text>
            </Box>
            <Box className="flex-1 bg-gray-50 p-5 rounded-[30px] items-center">
              <Clock size={22} color="#4F46E5" />
              <Text className="text-[10px] font-bold text-gray-400 uppercase mt-2">Listed</Text>
              <Text className="font-bold text-gray-900">{product.listed}</Text>
            </Box>
          </HStack>
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
          onPress={() => {
            console.log("Deleted ID:", id); // Replace with your delete logic
            setShowDeleteModal(false);
            router.replace("/marketPlace"); // Redirect after delete
          }}
        >
          <ButtonText className="font-bold text-lg">Yes, Delete</ButtonText>
        </Button>

        <Button
          variant="outline"
          className="border-none h-12"
          onPress={() => setShowDeleteModal(false)}
        >
          <ButtonText className="text-gray-900 font-bold">No</ButtonText>
        </Button>
      </VStack>

    </VStack>
  </AlertDialogContent>
</AlertDialog>
    </Box>
  );
}