import React, { useEffect, useMemo, useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ActivityIndicator,
  ScrollView,
  FlatList,
  Keyboard,
  Modal,
  SafeAreaView,
  Platform,
  Pressable,
} from "react-native";
import { Search, X } from "lucide-react-native";
import { useRouter } from "expo-router";
import apiClient from "../services/api";

type GlobalSearchItem = {
  id: string;
  type: string;
  title: string;
  subtitle?: string;
  route: string;
};

type GlobalSearchProps = {
  onSearchActiveChange?: (active: boolean) => void;
};

const toArray = (res: any) => {
  const data = res?.data;

  if (Array.isArray(data)) return data;
  if (Array.isArray(data?.data)) return data.data;
  if (Array.isArray(data?.items)) return data.items;
  if (Array.isArray(data?.events)) return data.events;
  if (Array.isArray(data?.housings)) return data.housings;
  if (Array.isArray(data?.tutors)) return data.tutors;
  if (Array.isArray(data?.groups)) return data.groups;

  return [];
};

export default function GlobalSearch({
  onSearchActiveChange,
}: GlobalSearchProps) {
  const router = useRouter();

  const [query, setQuery] = useState("");
  const [items, setItems] = useState<GlobalSearchItem[]>([]);
  const [loading, setLoading] = useState(false);

  const searchActive = query.trim().length > 0;

  useEffect(() => {
    onSearchActiveChange?.(searchActive);

    return () => {
      onSearchActiveChange?.(false);
    };
  }, [searchActive, onSearchActiveChange]);

  useEffect(() => {
    const fetchSearchData = async () => {
      try {
        setLoading(true);

        const results = await Promise.allSettled([
          apiClient.get("/events"),
          apiClient.get("/api/marketplace"),
          apiClient.get("/lost"),
          apiClient.get("/housing"),
          apiClient.get("/tutors"),
          apiClient.get("/studyGroups"),
        ]);

        const events =
          results[0].status === "fulfilled" ? toArray(results[0].value) : [];

        const marketplace =
          results[1].status === "fulfilled" ? toArray(results[1].value) : [];

        const lost =
          results[2].status === "fulfilled" ? toArray(results[2].value) : [];

        const housing =
          results[3].status === "fulfilled" ? toArray(results[3].value) : [];

        const tutors =
          results[4].status === "fulfilled" ? toArray(results[4].value) : [];

        const studyGroups =
          results[5].status === "fulfilled" ? toArray(results[5].value) : [];

        const normalizedItems: GlobalSearchItem[] = [
          ...events.map((item: any) => ({
            id: item._id || item.id,
            type: "Event",
            title: item.title || "Untitled Event",
            subtitle: item.location || "",
            route: `/events/${item._id || item.id}`,
          })),
          ...marketplace.map((item: any) => ({
            id: item._id || item.id,
            type: "Marketplace",
            title: item.title || "Untitled Item",
            subtitle: item.location || item.condition || "",
            route: `/marketplace/${item._id || item.id}`,
          })),
          ...lost.map((item: any) => ({
            id: item._id || item.id,
            type: "Lost Item",
            title: item.title || "Untitled Lost Item",
            subtitle: item.location || item.category || "",
            route: `/lost/${item._id || item.id}`,
          })),
          ...housing.map((item: any) => ({
            id: item._id || item.id,
            type: "Housing",
            title: item.title || "Untitled Housing",
            subtitle: item.address || item.roomType || "",
            route: `/housing/${item._id || item.id}`,
          })),
          ...tutors.map((item: any) => ({
            id: item._id || item.id,
            type: "Tutor",
            title: item.name || "Unnamed Tutor",
            subtitle: item.subject || "",
            route: `/tutors/${item._id || item.id}`,
          })),
          ...studyGroups.map((item: any) => ({
            id: item._id || item.id,
            type: "Study Group",
            title: item.subject || "Untitled Study Group",
            subtitle: item.location || item.tag || "",
            route: `/studyGroup/${item._id || item.id}`,
          })),
        ].filter((item) => item.id);

        setItems(normalizedItems);
      } catch (error) {
        console.log("Global search fetch error:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchSearchData();
  }, []);

  const filteredResults = useMemo(() => {
    const searchText = query.trim().toLowerCase();

    if (!searchText) return [];

    return items
      .filter((item) => {
        const searchableText = `${item.type} ${item.title} ${
          item.subtitle || ""
        }`;

        return searchableText.toLowerCase().includes(searchText);
      })
      .slice(0, 20);
  }, [query, items]);

  const clearSearch = () => {
    setQuery("");
    onSearchActiveChange?.(false);
  };

  const handleResultPress = (route: string) => {
    Keyboard.dismiss();
    clearSearch();
    router.push(route as any);
  };

  return (
    <View>
      {/* Search Bar - Always on Home Screen */}
      <View className="px-6 mt-2 mb-4">
        <View className="flex-row items-center bg-gray-100 rounded-full px-5 h-14">
          <Search size={20} color="#9CA3AF" />

          <TextInput
            value={query}
            onChangeText={setQuery}
            placeholder="Search UniSphere..."
            className="flex-1 ml-3 text-gray-700 text-base"
            placeholderTextColor="#9CA3AF"
            autoCorrect={false}
          />

          {query.length > 0 && (
            <TouchableOpacity onPress={clearSearch}>
              <X size={18} color="#9CA3AF" />
            </TouchableOpacity>
          )}
        </View>
      </View>

      {/* Separate Window (Modal) for Search Results */}
      <Modal
        visible={searchActive}
        transparent={true}
        animationType="slide"
        onRequestClose={clearSearch}
        statusBarTranslucent
      >
        <View className="flex-1">
          {/* Backdrop Layer (Darkened background) */}
          <Pressable
            onPress={clearSearch}
            className="absolute inset-0 bg-black/40"
          />

          <SafeAreaView className="flex-1" pointerEvents="box-none">
            <View 
              className="px-6" 
              style={{ marginTop: 100 }}
              pointerEvents="box-none"
            >
              <View 
                className="bg-white rounded-[40px] shadow-2xl border border-gray-100 overflow-hidden"
                style={{ elevation: 20 }}
              >
                {loading ? (
                  <View className="py-12 items-center">
                    <ActivityIndicator color="#4F46E5" size="large" />
                    <Text className="text-gray-400 mt-4 font-medium">Searching UniSphere...</Text>
                  </View>
                ) : filteredResults.length > 0 ? (
                  <View style={{ height: 450 }}>
                    <FlatList
                      data={filteredResults}
                      keyExtractor={(item) => `${item.type}-${item.id}`}
                      keyboardShouldPersistTaps="always"
                      nestedScrollEnabled={true}
                      showsVerticalScrollIndicator={true}
                      contentContainerStyle={{ paddingVertical: 10 }}
                      renderItem={({ item }) => (
                        <TouchableOpacity
                          activeOpacity={0.7}
                          onPress={() => handleResultPress(item.route)}
                          className="px-6 py-5 border-b border-gray-50"
                        >
                          <View className="flex-row justify-between items-center mb-1">
                            <Text className="text-[10px] font-black text-indigo-600 uppercase tracking-[2px]">
                              {item.type}
                            </Text>
                          </View>

                          <Text
                            className="text-lg font-bold text-gray-900"
                            numberOfLines={1}
                          >
                            {item.title}
                          </Text>

                          {item.subtitle ? (
                            <Text
                              className="text-gray-500 mt-1 text-sm font-medium"
                              numberOfLines={1}
                            >
                              {item.subtitle}
                            </Text>
                          ) : null}
                        </TouchableOpacity>
                      )}
                    />
                  </View>
                ) : (
                  <View className="py-16 items-center">
                    <Text className="text-gray-400 font-bold text-lg">No results found</Text>
                    <Text className="text-gray-300 text-sm mt-1">Try a different search term</Text>
                  </View>
                )}
              </View>
            </View>
          </SafeAreaView>
        </View>
      </Modal>
    </View>
  );
}