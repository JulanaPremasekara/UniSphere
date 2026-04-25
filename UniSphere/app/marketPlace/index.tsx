import React, { useEffect, useState } from "react";
import { Image, ScrollView, TouchableOpacity, ActivityIndicator, RefreshControl } from "react-native";
import { useRouter } from "expo-router";
import { Bell, ChevronLeft, Plus, Search } from "lucide-react-native";
import { Avatar, AvatarFallbackText, AvatarImage } from "@/components/ui/avatar";
import { Box } from "@/components/ui/box";
import { HStack } from "@/components/ui/hstack";
import { Input, InputField, InputIcon, InputSlot } from "@/components/ui/input";
import { Text } from "@/components/ui/text";
import { VStack } from "@/components/ui/vstack";
import { useMarketplace } from "@/hooks/useMarketplace";

const CATEGORIES = ["All items", "Textbooks", "Electronics", "Clothing"];

export default function MarketplaceIndex() {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState("All items");
  const { products, loading, fetchProducts } = useMarketplace();
  const [refreshing, setRefreshing] = useState(false);

  useEffect(() => {
    fetchProducts();
  }, [fetchProducts]);

  const onRefresh = async () => {
    setRefreshing(true);
    await fetchProducts();
    setRefreshing(false);
  };

  return (
    <Box className="flex-1 bg-white">
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

      <ScrollView 
        showsVerticalScrollIndicator={false}
        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}
      >
        <VStack className="px-6 pb-20">
          <Text className="text-3xl font-black text-gray-900 mt-4 mb-6">Marketplace</Text>

          <Input className="bg-gray-100 border-none rounded-2xl h-14 px-4 mb-6">
            <InputSlot className="pl-3"><InputIcon as={Search} /></InputSlot>
            <InputField placeholder="Find textbooks, gear, or tech..." />
          </Input>

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

          {loading && !refreshing ? (
            <ActivityIndicator size="large" color="#4F46E5" />
          ) : (
            <HStack className="flex-wrap justify-between">
              {products.map((item) => (
                <TouchableOpacity 
                  key={item._id}
                  className="w-[48%] mb-6"
                  onPress={() => router.push({ pathname: "/marketplace/[id]", params: { id: item._id } })}
                >
                  <Box className="relative aspect-square rounded-[30px] overflow-hidden bg-gray-100 mb-2">
                    <Image source={{ uri: item.image || "https://via.placeholder.com/150" }} className="w-full h-full" />
                  </Box>
                  <Text className="font-bold text-gray-800" numberOfLines={1}>{item.title}</Text>
                  <Text className="text-indigo-600 font-black">${item.price}</Text>
                </TouchableOpacity>
              ))}
            </HStack>
          )}

          {!loading && products.length === 0 && (
            <Text className="text-center text-gray-400 mt-10">No items listed yet.</Text>
          )}
        </VStack>
      </ScrollView>

      <TouchableOpacity 
        onPress={() => router.push("/marketplace/create")}
        className="absolute bottom-8 right-6 bg-indigo-600 w-16 h-16 rounded-full items-center justify-center shadow-lg"
      >
        <Plus size={32} color="white" />
      </TouchableOpacity>
    </Box>
  );
}