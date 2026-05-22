import React, { useCallback, useState } from "react";
import {
  ActivityIndicator,
  FlatList,
  Modal,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { SafeAreaView, useSafeAreaInsets } from "react-native-safe-area-context"; // ✅ Modern
import { router } from "expo-router";

import AppHeader from "@/components/AppHeader";
import SearchInput from "@/components/SearchInput";
import FilterChips from "@/components/FilterChips";
import SectionHeader from "@/components/SectionHeader";

import LostItemCard from "./components/LostItemCard";
import { useLostItemsListQuery } from "./hooks/useLostItems";
import { LostItem } from "./types/lostItem.types";
import { useFilteredList } from "@/hooks/useFilteredList";
import Footer from "@/components/Footer";
import { Calendar, Plus, UserCheck } from "lucide-react-native";
import { useUser } from "@/hooks/useUser";
import { useTheme } from "@/context/ThemeContext";

type LostItemsFilter = "ALL" | "LOST" | "FOUND" | "ELECTRONICS" | "PERSON";

const filterOptions: LostItemsFilter[] = [
  "ALL",
  "LOST",
  "FOUND",
  "ELECTRONICS",
  "PERSON",
];

export default function LostIndexScreen() {
  const insets = useSafeAreaInsets();
  const [searchText, setSearchText] = useState("");
  const [selectedFilter, setSelectedFilter] = useState<LostItemsFilter>("ALL");
  const { userId, user } = useUser();
  const [loginModalVisible, setLoginModalVisible] = useState(false);
  const { colors } = useTheme();
  const totalFooterHeight = 70 + Math.max(insets.bottom, 16);

  const {
    data: items = [],
    isLoading,
    isError,
    error,
  } = useLostItemsListQuery();

  const customFilter = useCallback(
    (item: LostItem) => {
      if (selectedFilter === "ALL") {
        return true;
      }

      return (
        item.status.toUpperCase() === selectedFilter ||
        item.category.toUpperCase() === selectedFilter
      );
    },
    [selectedFilter],
  );

  const filteredItems = useFilteredList<LostItem>({
    items,
    searchText,
    searchFields: ["title", "location", "category"],
    customFilter,
  });

  const handlePressItem = (itemId: string) => {
    router.push(`/lost/${itemId}` as any);
  };

  const handleCreateReport = () => {
    router.push("/lost/create" as any);
  };



  const renderItem = ({ item }: { item: LostItem }) => (
    <LostItemCard
      item={item}
      onPress={() =>
        !userId ? setLoginModalVisible(true) : handlePressItem(item.id)
      }
    />
  );

  if (isLoading) {
    return (
      <SafeAreaView style={{ backgroundColor: colors.bg }} className="flex-1 items-center justify-center">
        <ActivityIndicator size="large" color={colors.primary} />
      </SafeAreaView>
    );
  }

  if (isError) {
    return (
      <SafeAreaView style={{ backgroundColor: colors.bg }} className="flex-1 items-center justify-center px-6">
        <Text style={{ color: colors.text }} className="mb-2 text-lg font-bold">
          Failed to load lost items
        </Text>
        <Text style={{ color: colors.textSecondary }} className="text-center text-sm">
          {error instanceof Error ? error.message : "Something went wrong"}
        </Text>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView edges={["top"]} style={{ backgroundColor: colors.bg }} className="flex-1">
      <View className="flex-1">
        <AppHeader title="UniSphere" />

        <View className="px-5">
          <SearchInput
            value={searchText}
            onChangeText={setSearchText}
            placeholder="Search for lost items..."
          />
        </View>

        <FlatList
          data={filteredItems}
          keyExtractor={(item) => item.id}
          renderItem={renderItem}
          ListHeaderComponent={
            <View>
              <FilterChips
                options={filterOptions}
                selectedValue={selectedFilter}
                onSelect={setSelectedFilter}
              />

              <SectionHeader
                title="Lost & Found"
                subtitle="Reconnecting community members with their belongings."
              />
            </View>
          }
          ListEmptyComponent={
            <View className="mt-20 items-center">
              <Text style={{ color: colors.text }} className="text-lg font-bold">
                No items found
              </Text>

              <Text style={{ color: colors.textSecondary }} className="text-sm mt-2 text-center px-10">
                Try adjusting your search or filter to find what you're looking
                for.
              </Text>
            </View>
          }
          contentContainerStyle={{
            paddingHorizontal: 20,
            paddingTop: 16,
            flexGrow: 1,
            paddingBottom: totalFooterHeight + 24
          }}
          showsVerticalScrollIndicator={false}
        />

        {/* <TouchableOpacity
        onPress={handleCreateReport}
        activeOpacity={0.9}
        className="absolute bottom-24 right-6 h-14 w-14 items-center justify-center rounded-full bg-indigo-600 shadow-lg"
      >
        <Text className="text-3xl font-bold text-white">+</Text>
      </TouchableOpacity> */}

        <TouchableOpacity
          onPress={() =>
            !userId ? setLoginModalVisible(true) : handleCreateReport()
          }
          style={{ bottom: 90 + Math.max(insets.bottom, 16), backgroundColor: colors.primary }}
          className="absolute right-8 w-16 h-16 rounded-full items-center justify-center shadow-lg"
        >
          <Plus color="white" size={32} />
        </TouchableOpacity>

        <Footer />
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
            <View style={{ backgroundColor: colors.white }} className="rounded-[40px] w-full max-w-sm p-8 shadow-2xl items-center">
              <View style={{ backgroundColor: colors.primaryLight }} className="p-6 rounded-full mb-6">
                <UserCheck size={40} color={colors.primary} />
              </View>
              <Text style={{ color: colors.text }} className="text-2xl font-black mb-2">
                Login Required
              </Text>
              <Text style={{ color: colors.textSecondary }} className="text-center text-lg mb-8 leading-relaxed">
                Please sign in to your UniSphere account to create and share new
                events with the campus.
              </Text>
              <View className="flex-row gap-4 w-full">
                <TouchableOpacity
                  onPress={() => setLoginModalVisible(false)}
                  style={{ backgroundColor: colors.bgInput }}
                  className="flex-1 p-5 rounded-3xl"
                >
                  <Text style={{ color: colors.text }} className="font-bold text-center text-lg">
                    Cancel
                  </Text>
                </TouchableOpacity>
                <TouchableOpacity
                  onPress={() => {
                    setLoginModalVisible(false);
                    router.push("/login");
                  }}
                  style={{ backgroundColor: colors.primary }}
                  className="flex-1 p-5 rounded-3xl shadow-lg"
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
