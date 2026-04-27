import React, { useCallback, useState } from "react";
import {
  ActivityIndicator,
  FlatList,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context"; // ✅ Modern
import { router } from "expo-router";

import AppHeader from "../components/AppHeader";
import SearchInput from "../components/SearchInput";
import FilterChips from "../components/FilterChips";
import SectionHeader from "../components/SectionHeader";

import LostItemCard from "./components/LostItemCard";
import { useLostItemsListQuery } from "./hooks/useLostItems";
import { LostItem } from "./types/lostItem.types";
import { useFilteredList } from "../hooks/useFilteredList";
import Footer from "../components/Footer";

type LostItemsFilter =
  | "ALL"
  | "LOST"
  | "FOUND"
  | "ELECTRONICS"
  | "PERSON";

const filterOptions: LostItemsFilter[] = [
  "ALL",
  "LOST",
  "FOUND",
  "ELECTRONICS",
  "PERSON",
];

export default function LostIndexScreen() {
  const [searchText, setSearchText] = useState("");
  const [selectedFilter, setSelectedFilter] = useState<LostItemsFilter>("ALL");

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
    [selectedFilter]
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

  const renderHeader = () => (
    <View>
      <AppHeader
        title="UniSphere"
        avatarUrl="https://i.pravatar.cc/100?img=12"
      />

      <SearchInput
        value={searchText}
        onChangeText={setSearchText}
        placeholder="Search for lost items..."
      />

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
  );

  const renderItem = ({ item }: { item: LostItem }) => (
    <LostItemCard item={item} onPress={handlePressItem} />
  );

  if (isLoading) {
    return (
      <SafeAreaView className="flex-1 items-center justify-center bg-white">
        <ActivityIndicator size="large" color="#4F46E5" />
      </SafeAreaView>
    );
  }

  if (isError) {
    return (
      <SafeAreaView className="flex-1 items-center justify-center bg-white px-6">
        <Text className="mb-2 text-lg font-bold text-slate-900">
          Failed to load lost items
        </Text>
        <Text className="text-center text-sm text-slate-500">
          {error instanceof Error ? error.message : "Something went wrong"}
        </Text>
      </SafeAreaView>
    );
  }

 return (
  <SafeAreaView edges={["top"]} className="flex-1 bg-white">
    <View className="flex-1">
      <FlatList
        data={filteredItems}
        keyExtractor={(item) => item.id}
        renderItem={renderItem}
        ListHeaderComponent={renderHeader}
        contentContainerStyle={{
          paddingHorizontal: 20,
          paddingTop: 16,
          paddingBottom: 160,
        }}
        showsVerticalScrollIndicator={false}
      />

      <TouchableOpacity
        onPress={handleCreateReport}
        activeOpacity={0.9}
        className="absolute bottom-24 right-6 h-14 w-14 items-center justify-center rounded-full bg-indigo-600 shadow-lg"
      >
        <Text className="text-3xl font-bold text-white">+</Text>
      </TouchableOpacity>

      <Footer />
    </View>
  </SafeAreaView>
);
}