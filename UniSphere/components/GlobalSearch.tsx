import React, { useEffect, useMemo, useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ActivityIndicator,
  FlatList,
  Keyboard,
  Pressable,
} from "react-native";
import { Search, X } from "lucide-react-native";
import { useRouter } from "expo-router";
import apiClient from "@/services/api";
import { useTheme } from "@/context/ThemeContext";

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
  const { colors, isDark } = useTheme();

  const [query, setQuery] = useState("");
  const [items, setItems] = useState<GlobalSearchItem[]>([]);
  const [loading, setLoading] = useState(false);
  const [showResults, setShowResults] = useState(false);

  const searchActive = showResults && query.trim().length > 0;

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

  const closeResults = () => {
    setShowResults(false);
    onSearchActiveChange?.(false);
  };

  const clearSearch = () => {
    setQuery("");
    closeResults();
  };

  const handleResultPress = (route: string) => {
    Keyboard.dismiss();
    closeResults();
    router.push(route as any);
  };

  return (
    <View>
      {/* Search Bar - Always on Home Screen */}
      <View className="px-6 mt-2 mb-4">
        <Pressable 
          onPress={() => {
            if (query.trim().length > 0) setShowResults(true);
          }}
          style={{ backgroundColor: colors.bgInput, borderRadius: 9999, paddingHorizontal: 20, height: 56, flexDirection: "row", alignItems: "center" }}
        >
          <Search size={20} color={colors.textMuted} />

          <TextInput
            value={query}
            onChangeText={(text) => {
              setQuery(text);
              setShowResults(true);
            }}
            onFocus={() => {
              if (query.trim().length > 0) setShowResults(true);
            }}
            placeholder="Search UniSphere..."
            style={{ flex: 1, marginLeft: 12, color: colors.text, fontSize: 16 }}
            placeholderTextColor={colors.textMuted}
            autoCorrect={false}
          />

          {query.length > 0 && (
            <TouchableOpacity onPress={clearSearch}>
              <X size={18} color={colors.textMuted} />
            </TouchableOpacity>
          )}
        </Pressable>
      </View>

      {/* Search Results Overlay */}
      {searchActive && (
        <View 
          style={{ 
            position: 'absolute', 
            top: 64, 
            left: 0, 
            right: 0, 
            bottom: -1000, 
            zIndex: 1000,
          }}
          pointerEvents="box-none"
        >
          {/* Backdrop Layer */}
          <Pressable
            onPress={closeResults}
            style={{ 
              position: 'absolute', 
              top: 0, 
              left: 0, 
              right: 0, 
              bottom: 0,
              backgroundColor: isDark ? "rgba(0,0,0,0.6)" : "rgba(0,0,0,0.3)"
            }}
          />

          {/* Results Dropdown */}
          <View 
            className="px-6" 
            pointerEvents="box-none"
          >
            <View 
              style={{
                backgroundColor: colors.bgCard,
                borderRadius: 32,
                borderWidth: 1,
                borderColor: colors.border,
                overflow: 'hidden',
                elevation: 10
              }}
            >
              {loading ? (
                <View className="py-10 items-center">
                  <ActivityIndicator color={colors.primary} />
                  <Text style={{ color: colors.textMuted }} className="mt-2 text-sm font-medium">Searching...</Text>
                </View>
              ) : filteredResults.length > 0 ? (
                <View style={{ maxHeight: 400 }}>
                  <FlatList
                    data={filteredResults}
                    keyExtractor={(item) => `${item.type}-${item.id}`}
                    keyboardShouldPersistTaps="always"
                    showsVerticalScrollIndicator={true}
                    nestedScrollEnabled={true}
                    contentContainerStyle={{ paddingVertical: 10 }}
                    renderItem={({ item }) => (
                      <TouchableOpacity
                        activeOpacity={0.7}
                        onPress={() => handleResultPress(item.route)}
                        style={{ borderBottomWidth: 1, borderBottomColor: colors.border, paddingHorizontal: 24, paddingVertical: 16 }}
                      >
                        <View className="flex-row justify-between items-center">
                          <Text style={{ color: colors.primary }} className="text-[10px] font-black uppercase tracking-widest">
                            {item.type}
                          </Text>
                        </View>

                        <Text
                          style={{ color: colors.text }}
                          className="text-base font-bold mt-0.5"
                          numberOfLines={1}
                        >
                          {item.title}
                        </Text>

                        {item.subtitle ? (
                          <Text
                            style={{ color: colors.textSecondary }}
                            className="text-sm mt-0.5 font-medium"
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
                <View className="py-12 items-center">
                  <Text style={{ color: colors.textMuted }} className="font-bold">No results found</Text>
                </View>
              )}
            </View>
          </View>
        </View>
      )}
    </View>
  );
}