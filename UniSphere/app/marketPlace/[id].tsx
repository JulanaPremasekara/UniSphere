import React from 'react';
import { ScrollView, Image, TouchableOpacity } from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { Box } from '@/components/ui/box';
import { VStack } from '@/components/ui/vstack';
import { HStack } from '@/components/ui/hstack';
import { Text } from '@/components/ui/text';
import { Avatar, AvatarFallbackText, AvatarImage } from '@/components/ui/avatar';
import { Button, ButtonText } from '@/components/ui/button';
import { ChevronLeft, MoreVertical, MapPin, MessageCircle, Heart, Clock, ShieldCheck } from 'lucide-react-native';

export default function ProductDetailScreen() {
  const { id } = useLocalSearchParams();
  const router = useRouter();

  // Mock data - in production, fetch based on 'id'
  const product = {
    title: "Premium ANC Headphones",
    price: "$185.00",
    location: "Main Library, North Campus",
    description: "Lightly used noise-canceling headphones. Perfect for studying in high-traffic areas. Battery life is still at 98% health. Comes with original carrying case and USB-C charging cable.",
    condition: "Like New",
    listed: "2 hours ago",
    seller: {
      name: "Alex Rivera",
      joined: "2 years ago",
      sales: 14,
      image: "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde"
    }
  };

  return (
    <Box className="flex-1 bg-white">
      {/* Header */}
      <HStack className="px-6 pt-12 pb-4 items-center justify-between border-b border-gray-50">
        <TouchableOpacity onPress={() => router.back()}>
          <ChevronLeft size={28} color="#1f2937" />
        </TouchableOpacity>
        <Text className="text-xl font-bold text-indigo-700">UniSphere</Text>
        <TouchableOpacity>
          <MoreVertical size={24} color="#1f2937" />
        </TouchableOpacity>
      </HStack>

      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingBottom: 120 }}>
        {/* Rounded Image Container */}
        <Box className="px-4 mt-4">
          <Box className="h-[420px] w-full rounded-[45px] overflow-hidden bg-gray-100">
            <Image 
              source={{ uri: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e' }} 
              className="w-full h-full"
              resizeMode="cover"
            />
            <Box className="absolute top-6 left-6 bg-white/90 px-3 py-1 rounded-lg">
              <Text className="text-[10px] font-bold text-indigo-600 uppercase">Verified Seller</Text>
            </Box>
          </Box>
        </Box>

        <VStack className="px-8 mt-6" space="xl">
          {/* Info Header */}
          <HStack className="justify-between items-start">
            <VStack className="flex-1">
              <Text className="text-3xl font-black text-gray-900 leading-tight">{product.title}</Text>
              <HStack space="xs" className="items-center mt-2">
                <MapPin size={16} color="#6B7280" />
                <Text className="text-gray-500 font-medium">{product.location}</Text>
              </HStack>
            </VStack>
            <VStack items-end>
              <Text className="text-2xl font-black text-indigo-600">{product.price}</Text>
              <Text className="text-[10px] font-bold text-gray-400">NEGOTIABLE</Text>
            </VStack>
          </HStack>

          {/* Description */}
          <VStack space="xs">
            <Text className="text-[11px] font-bold text-gray-400 uppercase tracking-widest">Description</Text>
            <Text className="text-gray-600 leading-6 text-base">{product.description}</Text>
          </VStack>

          {/* Seller Profile Card */}
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

          {/* Condition & Time Grid */}
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

      {/* Floating Bottom Bar */}
      <Box className="absolute bottom-6 left-6 right-6 flex-row" style={{ height: 70 }}>
        <TouchableOpacity 
          className="flex-1 bg-indigo-600 rounded-full flex-row items-center justify-center shadow-lg shadow-indigo-300"
        >
          <MessageCircle size={22} color="white" />
          <Text className="text-white font-bold text-lg ml-2">Message Seller</Text>
        </TouchableOpacity>
        <TouchableOpacity 
          className="ml-4 w-[70px] h-[70px] bg-white rounded-full items-center justify-center border border-gray-100 shadow-sm"
        >
          <Heart size={26} color="#1f2937" />
        </TouchableOpacity>
      </Box>
    </Box>
  );
}