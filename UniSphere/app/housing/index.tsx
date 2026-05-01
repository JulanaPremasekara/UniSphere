import React, { useState } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  ActivityIndicator,
  Modal,
} from "react-native";
import { useRouter, useFocusEffect } from "expo-router";
import { Plus, Trash2, Search, Calendar } from "lucide-react-native";
import { SafeAreaView } from "react-native-safe-area-context";

import Footer from "../components/Footer";
import apiClient from "../services/api";
import { useHousing, Housing } from "../../hooks/useHousing";
import { useUser } from "../../hooks/useUser";
import HousingCard from "../components/HousingCard";

import AppHeader from "../components/AppHeader";
import SearchInput from "../components/SearchInput";
import FilterChips from "../components/FilterChips";
import SectionHeader from "../components/SectionHeader";
import { Alert } from "react-native";

export default function HousingList() {
  const router = useRouter();

  const [activeFilter, setActiveFilter] = useState("All");
  const [deleteModalVisible, setDeleteModalVisible] = useState(false);
  const [housingToDelete, setHousingToDelete] = useState<string | null>(null);
  const [loginModalVisible, setLoginModalVisible] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");

  const { housings, loading, refreshHousings } = useHousing();
  const { userId } = useUser();

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

  const renderHeader = () => (
    <View>
      <AppHeader title="UniSphere" />

      <SearchInput
        value={searchQuery}
        onChangeText={setSearchQuery}
        placeholder="Search rooms..."
      />

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
  );

  if (loading) {
    return (
      <SafeAreaView className="flex-1 justify-center items-center bg-white">
        <ActivityIndicator size="large" color="#4F46E5" />
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView edges={["top"]} className="flex-1 bg-white">
      <View className="flex-1">
        <ScrollView
          showsVerticalScrollIndicator={false}
          contentContainerStyle={{
            paddingHorizontal: 20,
            paddingTop: 16,
            paddingBottom: 140,
            flexGrow: 1,
          }}
        >
          {renderHeader()}

          {filteredHousings.length > 0 ? (
            filteredHousings.map((item: Housing) => (
              <HousingCard
                key={item.id}
                item={item}
                onPress={() => goToHousing(item)}
                // onEdit={
                //   item.isMine
                //     ? () =>
                //         router.push({
                //           pathname: "/housing/create",
                //           params: { editId: item.id },
                //         })
                //     : undefined
                // }
                // onDelete={
                //   item.isMine
                //     ? () => {
                //         setHousingToDelete(item.id);
                //         setDeleteModalVisible(true);
                //       }
                //     : undefined
                // }
              />
            ))
          ) : (
            <View className="flex-1 items-center justify-center py-20">
              <View className="bg-gray-100 p-8 rounded-full mb-4">
                <Search size={48} color="#9CA3AF" />
              </View>

              <Text className="text-xl font-bold text-gray-800 mb-2">
                No Rooms Found
              </Text>

              <Text className="text-gray-500 text-center px-10">
                There are currently no rooms matching your search or criteria.
              </Text>
            </View>
          )}
        </ScrollView>

        {/* Floating Button */}
        <TouchableOpacity
          onPress={() =>
            !userId
              ? setLoginModalVisible(true)
              : router.push("/housing/create")
          }
          className="absolute bottom-28 right-8 bg-indigo-600 w-16 h-16 rounded-full items-center justify-center shadow-lg"
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
            <View className="bg-white rounded-[40px] w-full max-w-sm p-8 shadow-2xl items-center">
              <View className="bg-red-50 p-6 rounded-full mb-6">
                <Trash2 size={40} color="#EF4444" />
              </View>

              <Text className="text-2xl font-black text-gray-900 mb-2">
                Delete Listing?
              </Text>

              <Text className="text-gray-500 text-center text-lg mb-8 leading-relaxed">
                This will permanently remove your room listing.
              </Text>

              <View className="flex-row gap-4 w-full">
                <TouchableOpacity
                  onPress={() => setDeleteModalVisible(false)}
                  className="flex-1 bg-gray-50 p-5 rounded-3xl"
                >
                  <Text className="text-gray-900 font-bold text-center text-lg">
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
            <View className="bg-white rounded-[40px] w-full max-w-sm p-8 shadow-2xl items-center">
              <View className="bg-indigo-50 p-6 rounded-full mb-6">
                <Calendar size={40} color="#4F46E5" />
              </View>

              <Text className="text-2xl font-black text-gray-900 mb-2">
                Login Required
              </Text>

              <Text className="text-gray-500 text-center text-lg mb-8">
                Please sign in to post a room listing.
              </Text>

              <View className="flex-row gap-4 w-full">
                <TouchableOpacity
                  onPress={() => setLoginModalVisible(false)}
                  className="flex-1 bg-gray-50 p-5 rounded-3xl"
                >
                  <Text className="text-gray-900 font-bold text-center">
                    Cancel
                  </Text>
                </TouchableOpacity>

                <TouchableOpacity
                  onPress={() => router.push("/login")}
                  className="flex-1 bg-indigo-600 p-5 rounded-3xl"
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