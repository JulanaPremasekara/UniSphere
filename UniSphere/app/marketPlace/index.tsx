import React, { useState, useCallback, useEffect } from "react";
import {
  Image,
  ScrollView,
  TouchableOpacity,
  ActivityIndicator,
  RefreshControl,
  Modal,
  View,
} from "react-native";
import { useRouter, useFocusEffect } from "expo-router";
import { Calendar, Plus } from "lucide-react-native";
import { SafeAreaView, useSafeAreaInsets } from "react-native-safe-area-context";

import { Box } from "@/components/ui/box";
import { Text } from "@/components/ui/text";

import apiClient from "../services/api";
import AppHeader from "../components/AppHeader";
import SearchInput from "../components/SearchInput";
import SectionHeader from "../components/SectionHeader";
import Footer from "../components/Footer";
import FilterChips from "../components/FilterChips";
import { useUser } from "@/hooks/useUser";

type MarketFilter =
  | "ALL"
  | "CHEAP"
  | "EXPENSIVE"
  | "NEW"
  | "USED";

const filterOptions: MarketFilter[] = [
  "ALL",
  "CHEAP",
  "EXPENSIVE",
  "NEW",
  "USED",
];

export default function MarketplaceIndex() {
  const router = useRouter();
  const insets = useSafeAreaInsets();

  const [searchQuery, setSearchQuery] = useState("");
  const [products, setProducts] = useState<any[]>([]);
  const [filteredProducts, setFilteredProducts] = useState<any[]>([]);
  const [selectedFilter, setSelectedFilter] = useState<MarketFilter>("ALL");

  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  const { userId } = useUser();
  const [loginModalVisible, setLoginModalVisible] = useState(false);

  const fetchProducts = useCallback(async () => {
    try {
      const response = await apiClient.get("/api/marketplace");
      const data = response.data.data || response.data;
      const list = Array.isArray(data) ? data : [];

      setProducts(list);
      setFilteredProducts(list);
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

  // 🔥 FILTER LOGIC (same pattern as tutor)
  useEffect(() => {
    let filtered = [...products];

    // SEARCH
    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase();

      filtered = filtered.filter((item) =>
        item.title?.toLowerCase().includes(query)
      );
    }

    // FILTER
    if (selectedFilter !== "ALL") {
      filtered = filtered.filter((item) => {
        if (selectedFilter === "CHEAP") {
          return item.price < 5000;
        }

        if (selectedFilter === "EXPENSIVE") {
          return item.price >= 5000;
        }

        if (selectedFilter === "NEW") {
          return item.condition?.toUpperCase() === "NEW";
        }

        if (selectedFilter === "USED") {
          return item.condition?.toUpperCase() === "USED";
        }

        return true;
      });
    }

    setFilteredProducts(filtered);
  }, [searchQuery, selectedFilter, products]);

  const handlePressProduct = (item: any) => {
    if (!userId) {
      setLoginModalVisible(true);
      return;
    }

    if (
      item.userId === userId ||
      item.ownerId === userId ||
      item.createdBy === userId
    ) {
      router.push("/marketplace/create" as any);
      return;
    }

    router.push({
      pathname: "/marketplace/[id]",
      params: { id: item._id },
    });
  };

  const handleCreateProduct = () => {
    if (!userId) {
      setLoginModalVisible(true);
      return;
    }

    router.push("/marketplace/create" as any);
  };



  if (loading && !refreshing) {
    return (
      <SafeAreaView className="flex-1 items-center justify-center bg-white">
        <ActivityIndicator size="large" color="#4F46E5" />
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView edges={["top"]} className="flex-1 bg-white">
      <View className="flex-1">
        <AppHeader title="UniSphere" />

        <View className="px-5">
          <SearchInput
            value={searchQuery}
            onChangeText={setSearchQuery}
            placeholder="Find items..."
          />
        </View>

        <ScrollView
          showsVerticalScrollIndicator={false}
          refreshControl={
            <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
          }
        >
          <View
            style={{
              paddingHorizontal: 20,
              paddingTop: 8,
              paddingBottom: 20,
            }}
          >
            <FilterChips
              options={filterOptions}
              selectedValue={selectedFilter}
              onSelect={setSelectedFilter}
            />

            <SectionHeader
              title="Marketplace"
              subtitle="Buy, sell, and discover useful items around campus."
            />

            {filteredProducts.length > 0 ? (
              <View>
                {filteredProducts.map((item) => (
                  <TouchableOpacity
                    key={item._id}
                    onPress={() => handlePressProduct(item)}
                    className="bg-white rounded-[35px] mb-8 overflow-hidden"
                  >
                    <Box className="relative w-full h-[340px] rounded-[35px] overflow-hidden bg-gray-50 border border-gray-100">
                      <Image
                        source={{
                          uri:
                            item.image ||
                            "https://via.placeholder.com/150",
                        }}
                        className="w-full h-full"
                        resizeMode="cover"
                      />
                    </Box>

                    <View className="flex-row justify-between items-center px-4 pt-5">
                      <Text
                        className="text-2xl font-black text-gray-900 flex-1 mr-2"
                        numberOfLines={1}
                      >
                        {item.title}
                      </Text>

                      <Text className="text-indigo-600 font-black text-xl">
                        ${item.price}
                      </Text>
                    </View>
                  </TouchableOpacity>
                ))}
              </View>
            ) : (
              <Box className="w-full py-10 items-center">
                <Text className="text-gray-400 font-medium">
                  No items found
                </Text>
              </Box>
            )}
          </View>
        </ScrollView>

        <TouchableOpacity
          onPress={handleCreateProduct}
          className="absolute right-8 bg-indigo-600 w-16 h-16 rounded-full items-center justify-center shadow-lg"
          style={{ bottom: 90 + Math.max(insets.bottom, 16) }}
        >
          <Plus size={32} color="white" />
        </TouchableOpacity>

        <Footer />

        {/* LOGIN MODAL (unchanged) */}
        <Modal
          animationType="fade"
          transparent={true}
          visible={loginModalVisible}
          onRequestClose={() => setLoginModalVisible(false)}
        >
          <TouchableOpacity
            activeOpacity={1}
            onPress={() => setLoginModalVisible(false)}
            className="flex-1 bg-black/60 justify-center items-center px-6"
          >
            <View className="bg-white rounded-[40px] w-full max-w-sm p-8 shadow-2xl items-center">
              <View className="bg-indigo-50 p-6 rounded-full mb-6">
                <Calendar size={40} color="#4F46E5" />
              </View>

              <Text className="text-2xl font-black text-gray-900 mb-2">
                Login Required
              </Text>

              <Text className="text-gray-500 text-center text-lg mb-8 leading-relaxed">
                Please sign in to your UniSphere account to view marketplace
                items or create a new listing.
              </Text>

              <View className="flex-row gap-4 w-full">
                <TouchableOpacity
                  onPress={() => setLoginModalVisible(false)}
                  className="flex-1 bg-gray-50 p-5 rounded-3xl"
                >
                  <Text className="text-gray-900 font-bold text-center text-lg">
                    Cancel
                  </Text>
                </TouchableOpacity>

                <TouchableOpacity
                  onPress={() => {
                    setLoginModalVisible(false);
                    router.push("/login" as any);
                  }}
                  className="flex-1 bg-indigo-600 p-5 rounded-3xl shadow-lg shadow-indigo-200"
                >
                  <Text className="text-white font-bold text-center text-lg">
                    Sign In
                  </Text>
                </TouchableOpacity>
              </View>
            </View>
          </TouchableOpacity>
        </Modal>
      </View>
    </SafeAreaView>
  );
}