import React, { useState, useCallback } from "react";
import { Image, ScrollView, TouchableOpacity, ActivityIndicator, RefreshControl } from "react-native";
import { useRouter, useFocusEffect } from "expo-router";
import { ChevronLeft, Plus, Search, X } from "lucide-react-native";
import { Box } from "@/components/ui/box";
import { HStack } from "@/components/ui/hstack";
import { Input, InputField, InputIcon, InputSlot } from "@/components/ui/input";
import { Text } from "@/components/ui/text";
import { VStack } from "@/components/ui/vstack";
import apiClient from "../services/api"; 

export default function MarketplaceIndex() {
  const router = useRouter();
  
  const [searchQuery, setSearchQuery] = useState("");
  const [products, setProducts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  const fetchProducts = useCallback(async () => {
    try {
      const response = await apiClient.get('/api/marketplace');
      const data = response.data.data || response.data;
      setProducts(Array.isArray(data) ? data : []); 
    } catch (error) {
      console.error("Error fetching marketplace items:", error);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, []);

  useFocusEffect(
    useCallback(() => {
      fetchProducts();
    }, [fetchProducts])
  );

  const onRefresh = () => {
    setRefreshing(true);
    fetchProducts();
  };

  const filteredProducts = products.filter(item => {
    return item.title?.toLowerCase().includes(searchQuery.toLowerCase());
  });

  return (
    <Box className="flex-1 bg-white">
      {/* HEADER SECTION */}
      <Box className="pt-12 px-6 pb-4">
        {/* Top Row: Back Button and Centered Title */}
        <Box className="relative flex-row items-center justify-center h-12">
          <TouchableOpacity 
            onPress={() => router.replace("/")} 
            className="absolute left-0 z-10"
          >
            <ChevronLeft size={28} color="#1f2937" />
          </TouchableOpacity>
          
          <Text className="text-2xl font-black text-indigo-800">UniSphere</Text>
        </Box>

        {/* Marketplace Subtitle: Smaller and Centered */}
        
      </Box>

      <ScrollView 
        showsVerticalScrollIndicator={false}
        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}
      >
        <VStack className="px-6 pb-20">
          
          {/* SEARCH BOX */}
          <Input className="bg-gray-100 border-none rounded-2xl h-14 px-4 mb-8 mt-4">
            <InputSlot className="pl-3">
              <InputIcon as={Search} color="#6B7280" />
            </InputSlot>
            <InputField 
              placeholder="Find items..." 
              placeholderTextColor="#9CA3AF"
              className="text-gray-900 font-medium"
              value={searchQuery}
              onChangeText={(text) => setSearchQuery(text)}
            />
            {searchQuery.length > 0 && (
              <InputSlot className="pr-3" onPress={() => setSearchQuery("")}>
                <InputIcon as={X} color="#9CA3AF" size="sm" />
              </InputSlot>
            )}
          </Input>

          {/* PRODUCT GRID */}
          {loading && !refreshing ? (
            <ActivityIndicator size="large" color="#4F46E5" className="mt-10" />
          ) : (
            <HStack className="flex-wrap justify-between">
              {filteredProducts.length > 0 ? (
                filteredProducts.map((item) => (
                  <TouchableOpacity 
                    key={item._id}
                    className="w-[48%] mb-6"
                    onPress={() => router.push({ pathname: "/marketplace/[id]", params: { id: item._id } })}
                  >
                    <Box className="relative aspect-square rounded-[30px] overflow-hidden bg-gray-100 mb-2 border border-gray-50">
                      <Image 
                        source={{ uri: item.image || "https://via.placeholder.com/150" }} 
                        className="w-full h-full" 
                        resizeMode="cover"
                      />
                    </Box>
                    <Text className="font-bold text-gray-800" numberOfLines={1}>{item.title}</Text>
                    <Text className="text-indigo-600 font-black">${item.price}</Text>
                  </TouchableOpacity>
                ))
              ) : (
                <Box className="w-full py-10 items-center">
                  <Text className="text-gray-400 font-medium">No items found</Text>
                </Box>
              )}
            </HStack>
          )}
        </VStack>
      </ScrollView>

      {/* FLOATING ACTION BUTTON */}
      <TouchableOpacity 
        onPress={() => router.push("/marketplace/create")}
        className="absolute bottom-8 right-6 bg-indigo-600 w-16 h-16 rounded-full items-center justify-center shadow-xl"
      >
        <Plus size={32} color="white" />
      </TouchableOpacity>
    </Box>
  );
}