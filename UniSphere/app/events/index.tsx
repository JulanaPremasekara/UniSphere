import React, { useState } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  FlatList,
  Alert,
  ActivityIndicator,
  Modal,
} from "react-native";
import { useRouter } from "expo-router";
import { Calendar, Plus, Trash2, Search } from "lucide-react-native";
import { SafeAreaView, useSafeAreaInsets } from "react-native-safe-area-context";

import EventCard from "./components/EventCard";
import Footer from "@/components/Footer";
import apiClient from "@/services/api";
import { useEvents, Event } from "./hooks/useEvents";
import { useUser } from "@/hooks/useUser";
import { useTheme } from "@/context/ThemeContext";

import AppHeader from "@/components/AppHeader";
import SearchInput from "@/components/SearchInput";
import FilterChips from "@/components/FilterChips";
import SectionHeader from "@/components/SectionHeader";

export default function Home() {
  const router = useRouter();
  const insets = useSafeAreaInsets();

  const [activeFilter, setActiveFilter] = useState("All");
  const { events, loading, refreshEvents } = useEvents();
  const { userId } = useUser();
  const { colors } = useTheme();

  const [deleteModalVisible, setDeleteModalVisible] = useState(false);
  const [eventToDelete, setEventToDelete] = useState<string | null>(null);
  const [loginModalVisible, setLoginModalVisible] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");

  const filterOptions = ["All", "Mine", "Others"];

  const confirmDelete = async () => {
    if (!eventToDelete) return;

    try {
      if ((await apiClient.delete(`/events/${eventToDelete}`)).data.success) {
        refreshEvents();
      }
    } catch {
      Alert.alert("Error", "Failed to delete event.");
    } finally {
      setDeleteModalVisible(false);
      setEventToDelete(null);
    }
  };

  const filteredEvents = events.filter(
    (e: Event) =>
      (activeFilter === "All"
        ? true
        : activeFilter === "Mine"
        ? e.isMine
        : !e.isMine) &&
      e.title.toLowerCase().startsWith(searchQuery.toLowerCase())
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
            placeholder="Search events..."
          />
        </View>

        <FlatList
          data={filteredEvents}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => (
            <EventCard
              item={item}
              onPress={() => router.push(`/events/${item.id}`)}
              onEdit={
                item.isMine
                  ? () =>
                      router.push({
                        pathname: "/events/create",
                        params: { editId: item.id },
                      })
                  : undefined
              }
              onDelete={
                item.isMine
                  ? () => {
                      setEventToDelete(item.id);
                      setDeleteModalVisible(true);
                    }
                  : undefined
              }
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
                title={searchQuery ? "Search Results" : "Campus Feed"}
                subtitle="Discover and share events happening around you."
              />
            </View>
          }
          ListEmptyComponent={
            <View className="items-center justify-center py-20">
              <View style={{ backgroundColor: colors.bgInput }} className="p-8 rounded-full mb-4">
                <Search size={48} color={colors.textMuted} />
              </View>

              <Text style={{ color: colors.text }} className="text-xl font-bold mb-2">
                No Events Found
              </Text>

              <Text style={{ color: colors.textSecondary }} className="text-center px-10">
                There are currently no events matching your search or criteria.
              </Text>
            </View>
          }
          contentContainerStyle={{
            paddingHorizontal: 20,
            paddingTop: 8,
            paddingBottom: 20,
            flexGrow: 1,
          }}
          showsVerticalScrollIndicator={false}
        />

        <TouchableOpacity
          onPress={() =>
            !userId ? setLoginModalVisible(true) : router.push("/events/create")
          }
          style={{ bottom: 90 + Math.max(insets.bottom, 16), backgroundColor: colors.primary }}
          className="absolute right-8 w-16 h-16 rounded-full items-center justify-center shadow-lg"
        >
          <Plus color="white" size={32} />
        </TouchableOpacity>

        <Footer />

        <Modal
          animationType="fade"
          transparent
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
                Delete Event?
              </Text>

              <Text style={{ color: colors.textSecondary }} className="text-center text-lg mb-8 leading-relaxed">
                This will permanently remove your curated event from the campus
                feed. This action cannot be undone.
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
                  className="flex-1 bg-red-600 p-5 rounded-3xl shadow-lg shadow-red-200"
                >
                  <Text className="text-white font-bold text-center text-lg">
                    Delete
                  </Text>
                </TouchableOpacity>
              </View>
            </View>
          </TouchableOpacity>
        </Modal>

        <Modal
          animationType="fade"
          transparent
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