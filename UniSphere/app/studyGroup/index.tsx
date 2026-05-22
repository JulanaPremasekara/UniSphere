import { useRouter } from "expo-router";
import { Calendar, Clock, MapPin, Plus } from "lucide-react-native";
import React, { useEffect, useState } from "react";
import {
  ActivityIndicator,
  Modal,
  ScrollView,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { SafeAreaView, useSafeAreaInsets } from "react-native-safe-area-context";

import Footer from "@/components/Footer";
import AppHeader from "@/components/AppHeader";
import SearchInput from "@/components/SearchInput";
import SectionHeader from "@/components/SectionHeader";
import FilterChips from "@/components/FilterChips";
import { useUser } from "@/hooks/useUser";
import { useStudyGroups } from "./hooks/useStudyGroups";
import { useTheme } from "@/context/ThemeContext";

type StudyFilter = "ALL" | "GENERAL" | "MATHEMATICS" | "COMPUTER SCIENCE";

const filterOptions: StudyFilter[] = [
  "ALL",
  "GENERAL",
  "MATHEMATICS",
  "COMPUTER SCIENCE",
];

export default function StudyGroupFeed() {
  const router = useRouter();
  const insets = useSafeAreaInsets();

  const { userId } = useUser();

  const { groups, loading } = useStudyGroups();
  const [filteredGroups, setFilteredGroups] = useState<any[]>([]);

  const [loginModalVisible, setLoginModalVisible] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedFilter, setSelectedFilter] = useState<StudyFilter>("ALL");
  const { colors } = useTheme();
  const totalFooterHeight = 70 + Math.max(insets.bottom, 16);

  useEffect(() => {
    let filtered = [...groups];

    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase();

      filtered = filtered.filter(
        (group) =>
          group.subject?.toLowerCase().includes(query) ||
          group.location?.toLowerCase().includes(query) ||
          group.tag?.toLowerCase().includes(query)
      );
    }

    if (selectedFilter !== "ALL") {
      filtered = filtered.filter(
        (group) => group.tag?.toUpperCase() === selectedFilter
      );
    }

    setFilteredGroups(filtered);
  }, [searchQuery, selectedFilter, groups]);

  const handlePressGroup = (id: string) => {
    if (!userId) {
      setLoginModalVisible(true);
      return;
    }

    router.push(`/studyGroup/${id}` as any);
  };

  const handleCreateGroup = () => {
    if (!userId) {
      setLoginModalVisible(true);
      return;
    }

    router.push("/studyGroup/create" as any);
  };



  if (loading) {
    return (
      <SafeAreaView style={{ backgroundColor: colors.bg }} className="flex-1 items-center justify-center">
        <ActivityIndicator size="large" color={colors.primary} />
        <Text style={{ color: colors.textMuted }} className="text-center mt-4">
          Finding study groups...
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
            value={searchQuery}
            onChangeText={setSearchQuery}
            placeholder="Find study groups..."
          />
        </View>

        <ScrollView
          showsVerticalScrollIndicator={false}
          contentContainerStyle={{
            paddingHorizontal: 20,
            paddingTop: 8,
            flexGrow: 1,
            paddingBottom: totalFooterHeight + 24
          }}
        >
          <FilterChips
            options={filterOptions}
            selectedValue={selectedFilter}
            onSelect={setSelectedFilter}
          />

          <SectionHeader
            title="Study Groups"
            subtitle="Connect with peers and master your courses together."
          />

          {filteredGroups.length > 0 ? (
            <View>
              {filteredGroups.map((group) => (
                <TouchableOpacity
                  key={group._id || group.id}
                  onPress={() => handlePressGroup(group._id || group.id)}
                  style={{
                    backgroundColor: colors.bgCard,
                    borderRadius: 35,
                    borderWidth: 1,
                    borderColor: colors.border,
                    padding: 24,
                    marginBottom: 32,
                    overflow: "hidden",
                  }}
                  className="shadow-sm"
                >
                  <View style={{ backgroundColor: colors.primaryLight }} className="self-start px-4 py-2 rounded-full mb-4">
                    <Text style={{ color: colors.primary }} className="font-black text-[10px] uppercase">
                      {group.tag || "GENERAL"}
                    </Text>
                  </View>

                  <Text style={{ color: colors.text }} className="text-2xl font-black mb-5">
                    {group.subject}
                  </Text>

                  <View className="gap-y-3">
                    <View style={{ backgroundColor: colors.bgInput }} className="flex-row items-center p-3 rounded-2xl self-start">
                      <Clock size={16} color={colors.primary} />
                      <Text style={{ color: colors.textSecondary }} className="ml-2 text-sm font-medium">
                        {group.time}
                      </Text>
                    </View>

                    <View style={{ backgroundColor: colors.bgInput }} className="flex-row items-center p-3 rounded-2xl self-start">
                      <MapPin size={16} color={colors.primary} />
                      <Text style={{ color: colors.textSecondary }} className="ml-2 text-sm font-medium">
                        {group.location}
                      </Text>
                    </View>
                  </View>
                </TouchableOpacity>
              ))}
            </View>
          ) : (
            <View className="w-full py-20 items-center">
              <Text style={{ color: colors.text }} className="text-lg font-bold">
                No study groups found
              </Text>

              <Text style={{ color: colors.textMuted }} className="text-sm mt-2 text-center px-10">
                Try adjusting your search or filter.
              </Text>
            </View>
          )}
        </ScrollView>

        <TouchableOpacity
          onPress={handleCreateGroup}
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
                <Calendar size={40} color={colors.primary} />
              </View>

              <Text style={{ color: colors.text }} className="text-2xl font-black mb-2">
                Login Required
              </Text>

              <Text style={{ color: colors.textSecondary }} className="text-center text-lg mb-8 leading-relaxed">
                Please sign in to view study group details or create a new
                study group.
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
                    router.push("/login" as any);
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