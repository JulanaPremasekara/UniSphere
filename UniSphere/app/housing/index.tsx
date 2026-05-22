import React, { useState } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  FlatList,
  ActivityIndicator,
  Modal,
} from "react-native";
import { useRouter, useFocusEffect } from "expo-router";
import { Plus, Trash2, Search, Calendar } from "lucide-react-native";
import { SafeAreaView, useSafeAreaInsets } from "react-native-safe-area-context";

import Footer from "@/components/Footer";
import apiClient from "@/services/api";
import { useHousing, Housing } from "./hooks/useHousing";
import { useUser } from "@/hooks/useUser";
import HousingCard from "./components/HousingCard";

import AppHeader from "@/components/AppHeader";
import SearchInput from "@/components/SearchInput";
import FilterChips from "@/components/FilterChips";
import SectionHeader from "@/components/SectionHeader";
import { Alert } from "react-native";
import { useTheme } from "@/context/ThemeContext";

export default function HousingList() {
  const router = useRouter();
  const insets = useSafeAreaInsets();

  const [activeFilter, setActiveFilter] = useState("All");
  const [deleteModalVisible, setDeleteModalVisible] = useState(false);
  const [housingToDelete, setHousingToDelete] = useState<string | null>(null);
  const [loginModalVisible, setLoginModalVisible] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const totalFooterHeight = 70 + Math.max(insets.bottom, 16);

  const { housings, loading, refreshHousings } = useHousing();
  const { userId } = useUser();
  const { colors } = useTheme();

  const filterOptions = ["All", "Mine", "Others"];

  useFocusEffect(
    React.useCallback(() => {
      refreshHousings();
    }, [refreshHousings])
  );

  const confirmDelete = async () => {
    if (!housingToDelete) return;

    try {
      if ((await apiClient.delete(`/housing/${housingToDelete}`)).data.success) {
        refreshHousings();
      }
    } catch {
      Alert.alert("Error", "Failed to delete housing listing.");
    } finally {
      setDeleteModalVisible(false);
      setHousingToDelete(null);
    }
  };

  const goToHousing = (item: Housing) => {
    if (!item.id?.trim()) return;
    router.push({ pathname: "/housing/[id]", params: { id: item.id } });
  };

  // 🔥 SAME LOGIC (unchanged)
  const filteredHousings = housings.filter(
    (h: Housing) =>
      (activeFilter === "All"
        ? true
        : activeFilter === "Mine"
        ? h.isMine
        : !h.isMine) &&
      (h.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        h.location.toLowerCase().includes(searchQuery.toLowerCase()))
  );



  if (loading) {
    return (
      <SafeAreaView style={{ backgroundColor: colors.bg }} className="flex-1 justify-center items-center">
        <ActivityIndicator size="large" color={colors.primary} />
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView edges={["top"]} style={{ backgroundColor: colors.bg }} className="flex-1">
      <View className="flex-1">
        <AppHeader title="UniSphere" />

        <View className="px-5">
          <SearchInput
            value={searchQuery}
            onChangeText={setSearchQuery}
            placeholder="Search rooms..."
          />
        </View>

        <FlatList
          data={filteredHousings}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => (
            <HousingCard
              item={item}
              onPress={() => goToHousing(item)}
            />
          )}
          ListHeaderComponent={
            <View>
              <FilterChips
                options={filterOptions}
                selectedValue={activeFilter}
                onSelect={setActiveFilter}
              />

              <SectionHeader
                title="Housing"
                subtitle="Find rooms and accommodations around campus."
              />
            </View>
          }
          ListEmptyComponent={
            <View className="items-center justify-center py-20">
              <View style={{ backgroundColor: colors.bgInput }} className="p-8 rounded-full mb-4">
                <Search size={48} color={colors.textMuted} />
              </View>

              <Text style={{ color: colors.text }} className="text-xl font-bold mb-2">
                No Rooms Found
              </Text>

              <Text style={{ color: colors.textSecondary }} className="text-center px-10">
                There are currently no rooms matching your search or criteria.
              </Text>
            </View>
          }
          contentContainerStyle={{
            paddingHorizontal: 20,
            paddingTop: 8,
            flexGrow: 1,
            paddingBottom: totalFooterHeight + 24
          }}
          showsVerticalScrollIndicator={false}
        />

        {/* Floating Button */}
        <TouchableOpacity
          onPress={() =>
            !userId
              ? setLoginModalVisible(true)
              : router.push("/housing/create")
          }
          style={{ bottom: 90 + Math.max(insets.bottom, 16), backgroundColor: colors.primary }}
          className="absolute right-8 w-16 h-16 rounded-full items-center justify-center shadow-lg"
        >
          <Plus color="white" size={32} />
        </TouchableOpacity>

        <Footer />

        {/* DELETE MODAL */}
        <Modal
          animationType="fade"
          transparent={true}
          visible={deleteModalVisible}
          onRequestClose={() => setDeleteModalVisible(false)}
        >
          <TouchableOpacity
            activeOpacity={1}
            onPress={() => setDeleteModalVisible(false)}
            className="flex-1 bg-black/60 justify-center items-center px-6"
          >
            <View style={{ backgroundColor: colors.white }} className="rounded-[40px] w-full max-w-sm p-8 shadow-2xl items-center">
              <View style={{ backgroundColor: 'rgba(239, 68, 68, 0.15)' }} className="p-6 rounded-full mb-6">
                <Trash2 size={40} color="#EF4444" />
              </View>

              <Text style={{ color: colors.text }} className="text-2xl font-black mb-2">
                Delete Listing?
              </Text>

              <Text style={{ color: colors.textSecondary }} className="text-center text-lg mb-8 leading-relaxed">
                This will permanently remove your room listing.
              </Text>

              <View className="flex-row gap-4 w-full">
                <TouchableOpacity
                  onPress={() => setDeleteModalVisible(false)}
                  style={{ backgroundColor: colors.bgInput }}
                  className="flex-1 p-5 rounded-3xl"
                >
                  <Text style={{ color: colors.text }} className="font-bold text-center text-lg">
                    Cancel
                  </Text>
                </TouchableOpacity>

                <TouchableOpacity
                  onPress={confirmDelete}
                  className="flex-1 bg-red-600 p-5 rounded-3xl"
                >
                  <Text className="text-white font-bold text-center text-lg">
                    Delete
                  </Text>
                </TouchableOpacity>
              </View>
            </View>
          </TouchableOpacity>
        </Modal>

        {/* LOGIN MODAL */}
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
                <Calendar size={40} color={colors.primary} />
              </View>

              <Text style={{ color: colors.text }} className="text-2xl font-black mb-2">
                Login Required
              </Text>

              <Text style={{ color: colors.textSecondary }} className="text-center text-lg mb-8">
                Please sign in to post a room listing.
              </Text>

              <View className="flex-row gap-4 w-full">
                <TouchableOpacity
                  onPress={() => setLoginModalVisible(false)}
                  style={{ backgroundColor: colors.bgInput }}
                  className="flex-1 p-5 rounded-3xl"
                >
                  <Text style={{ color: colors.text }} className="font-bold text-center">
                    Cancel
                  </Text>
                </TouchableOpacity>

                <TouchableOpacity
                  onPress={() => {
                    setLoginModalVisible(false);
                    router.push("/login");
                  }}
                  style={{ backgroundColor: colors.primary }}
                  className="flex-1 p-5 rounded-3xl"
                >
                  <Text className="text-white font-bold text-center">
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