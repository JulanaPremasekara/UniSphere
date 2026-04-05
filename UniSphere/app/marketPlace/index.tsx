import React, { useState } from "react";
import { ScrollView, TouchableOpacity, Image } from "react-native";
import { useRouter } from "expo-router";
import { Box } from "@/components/ui/box";
import { HStack } from "@/components/ui/hstack";
import { VStack } from "@/components/ui/vstack";
import { Text } from "@/components/ui/text";
import { Input, InputField, InputIcon, InputSlot } from "@/components/ui/input";
import { Avatar, AvatarFallbackText, AvatarImage } from "@/components/ui/avatar";
import { Search, Bell, ChevronLeft, Plus } from "lucide-react-native";


// Mock Data for the UI
const CATEGORIES = ["All items", "Textbooks", "Electronics", "Clothing"];
const PRODUCTS = [
  { id: "1", title: "Modern Physics: Third Edition", price: "$45.00", image: "https://images.unsplash.com/photo-1544947950-fa07a98d237f?q=80&w=1000", isNew: true },
  { id: "2", title: "MacBook Air M2 (8GB/256GB)", price: "$850.00", image: "https://images.unsplash.com/photo-1517336714731-489689fd1ca8?q=80&w=1000", isNew: false },
];

export default function MarketplaceIndex() {
  const [activeTab, setActiveTab] = useState("All items");
  const router = useRouter();

  return (
    <Box className="flex-1 bg-white">
      {/* Header */}
      <HStack className="px-6 pt-12 pb-4 items-center justify-between">
        <HStack space="md" className="items-center">
          <TouchableOpacity onPress={() => router.replace("/")}>
            <ChevronLeft size={28} color="#1f2937" />
          </TouchableOpacity>
          <Avatar size="md">
            <AvatarFallbackText>UN</AvatarFallbackText>
            <AvatarImage source={{ uri: "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde" }} />
          </Avatar>
          <Text className="text-xl font-bold text-indigo-600">UniSphere</Text>
        </HStack>
        <Bell size={24} color="#1f2937" />
      </HStack>

      <ScrollView showsVerticalScrollIndicator={false}>
        <VStack className="px-6 pb-20">
          <Text className="text-3xl font-black text-gray-900 mt-4 mb-6">Marketplace</Text>

          {/* Search */}
          <Input className="bg-gray-100 border-none rounded-2xl h-14 px-4 mb-6">
            <InputSlot className="pl-3"><InputIcon as={Search} /></InputSlot>
            <InputField placeholder="Find textbooks, gear, or tech..." />
          </Input>

          {/* Category Pills */}
          <ScrollView horizontal showsHorizontalScrollIndicator={false} className="mb-6">
            <HStack space="sm">
              {CATEGORIES.map((cat) => (
                <TouchableOpacity 
                  key={cat}
                  onPress={() => setActiveTab(cat)}
                  className={`px-6 py-3 rounded-full ${activeTab === cat ? 'bg-indigo-600' : 'bg-gray-100'}`}
                >
                  <Text className={`font-bold ${activeTab === cat ? 'text-white' : 'text-gray-500'}`}>{cat}</Text>
                </TouchableOpacity>
              ))}
            </HStack>
          </ScrollView>

          {/* Product Grid */}
          <HStack className="flex-wrap justify-between">
            {PRODUCTS.map((item) => (
              <TouchableOpacity 
                key={item.id} 
                className="w-[48%] mb-6"
                // Using the object syntax helps TypeScript resolve the dynamic ID
                onPress={() => router.push({ pathname: "/marketplace/[id]", params: { id: item.id } })}
              >
                <Box className="relative aspect-square rounded-[30px] overflow-hidden bg-gray-100 mb-2">
                  <Image source={{ uri: item.image }} className="w-full h-full" />
                  {item.isNew && (
                    <Box className="absolute top-3 right-3 bg-white px-2 py-1 rounded-lg">
                      <Text className="text-[10px] font-bold text-indigo-600">NEW</Text>
                    </Box>
                  )}
                </Box>
                <Text className="font-bold text-gray-800" numberOfLines={1}>{item.title}</Text>
                <Text className="text-gray-900 font-black">{item.price}</Text>
              </TouchableOpacity>
            ))}
          </HStack>
        </VStack>
      </ScrollView>

      {/* Floating Action Button */}
      <TouchableOpacity 
        // Adding 'as any' is a quick way to bypass the strict check if the route is valid
        onPress={() => router.push("/marketplace/create" as any)}
        className="absolute bottom-8 right-6 bg-indigo-600 w-16 h-16 rounded-full items-center justify-center shadow-lg"
      >
        <Plus size={32} color="white" />
      </TouchableOpacity>
    </Box>
  );
}
