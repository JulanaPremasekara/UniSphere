import { useRouter } from "expo-router";
import { Calendar, Plus, User } from "lucide-react-native";
import React, { useEffect, useState } from "react";
import {
  ActivityIndicator,
  FlatList,
  Modal,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { SafeAreaView, useSafeAreaInsets } from "react-native-safe-area-context";

import { Avatar, AvatarImage } from "@/components/ui/avatar";
import { Box } from "@/components/ui/box";
import { HStack } from "@/components/ui/hstack";
import { Icon } from "@/components/ui/icon";
import { VStack } from "@/components/ui/vstack";

import { useUser } from "@/hooks/useUser";
import { useTutors } from "./hooks/useTutors";

import AppHeader from "@/components/AppHeader";
import SearchInput from "@/components/SearchInput";
import SectionHeader from "@/components/SectionHeader";
import Footer from "@/components/Footer";
import FilterChips from "@/components/FilterChips";
import { useTheme } from "@/context/ThemeContext";

type TutorFilter =
  | "ALL"
  | "ONLINE"
  | "OFFLINE"
  | "MATH"
  | "SCIENCE"
  | "IT";

const filterOptions: TutorFilter[] = [
  "ALL",
  "ONLINE",
  "OFFLINE",
  "MATH",
  "SCIENCE",
  "IT",
];

export default function FindTutor() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const { colors } = useTheme();

  const { tutorList, loading } = useTutors();
  const { userId } = useUser();
  const [filteredTutors, setFilteredTutors] = useState<any[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedFilter, setSelectedFilter] = useState<TutorFilter>("ALL");
  const [loginModalVisible, setLoginModalVisible] = useState(false);

  useEffect(() => {
    let filtered = [...tutorList];

    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase();

      filtered = filtered.filter(
        (tutor) =>
          tutor.name?.toLowerCase().includes(query) ||
          tutor.subject?.toLowerCase().includes(query)
      );
    }

    if (selectedFilter !== "ALL") {
      filtered = filtered.filter((tutor) => {
        if (selectedFilter === "ONLINE") {
          return tutor.isOnline !== false;
        }

        if (selectedFilter === "OFFLINE") {
          return tutor.isOnline === false;
        }

        return tutor.subject?.toUpperCase().includes(selectedFilter);
      });
    }

    setFilteredTutors(filtered);
  }, [searchQuery, selectedFilter, tutorList]);

  const handlePressTutor = (tutor: any) => {
    if (!userId) {
      setLoginModalVisible(true);
      return;
    }

    if (tutor.userId === userId || tutor._id === userId) {
      router.push("/tutors/setup" as any);
      return;
    }

    router.push(`/tutors/${tutor._id}` as any);
  };

  const handleCreateTutor = () => {
    if (!userId) {
      setLoginModalVisible(true);
      return;
    }

    router.push("/tutors/setup" as any);
  };



  const renderItem = ({ item: tutor }: { item: any }) => (
    <TouchableOpacity
      onPress={() => handlePressTutor(tutor)}
      style={{
        backgroundColor: colors.bgCard,
        borderRadius: 25,
        borderWidth: 1,
        borderColor: colors.border,
        padding: 16,
        marginBottom: 16,
      }}
      className="shadow-sm"
    >
      <HStack space="md" className="items-center">
        <View className="relative">
          <Avatar style={{ backgroundColor: colors.primary }} className="w-16 h-16">
            {tutor.image ? (
              <AvatarImage
                source={{ uri: tutor.image }}
                className="w-full h-full rounded-full"
              />
            ) : (
              <Icon as={User} size="xl" className="text-white" />
            )}
          </Avatar>

          <Box
            style={{ borderColor: colors.bgCard }}
            className={`absolute bottom-0 right-0 w-4 h-4 rounded-full border-2 ${
              tutor.isOnline !== false ? "bg-green-500" : "bg-gray-300"
            }`}
          />
        </View>

        <VStack className="flex-1" space="xs">
          <Text style={{ color: colors.text }} className="font-bold text-xl">{tutor.name}</Text>
          <Text style={{ color: colors.textMuted }} className="text-sm">{tutor.subject}</Text>

          <HStack className="justify-between items-center mt-1">
            <Text style={{ color: colors.primary }} className="font-bold text-lg">
              {tutor.price}
              <Text style={{ color: colors.textMuted }} className="text-sm font-normal">/hr</Text>
            </Text>
          </HStack>
        </VStack>
      </HStack>
    </TouchableOpacity>
  );

  if (loading) {
    return (
      <SafeAreaView style={{ backgroundColor: colors.bg }} className="flex-1 items-center justify-center">
        <ActivityIndicator size="large" color={colors.primary} />
        <Text style={{ color: colors.textMuted }} className="text-center mt-4">
          Finding tutors...
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
            placeholder="Search subjects..."
          />
        </View>

        <FlatList
          data={filteredTutors}
          keyExtractor={(item) => item._id}
          renderItem={renderItem}
          ListHeaderComponent={
            <View>
              <FilterChips
                options={filterOptions}
                selectedValue={selectedFilter}
                onSelect={setSelectedFilter}
              />

              <SectionHeader
                title="Find Tutors"
                subtitle="Connect with skilled tutors across your campus."
              />
            </View>
          }
          ListEmptyComponent={
            <View className="mt-10 items-center">
              <Text style={{ color: colors.textMuted }}>No tutors found.</Text>
            </View>
          }
          contentContainerStyle={{
            paddingHorizontal: 20,
            paddingTop: 16,
            paddingBottom: 20,
          }}
          showsVerticalScrollIndicator={false}
        />

        <TouchableOpacity
          onPress={handleCreateTutor}
          activeOpacity={0.8}
          style={{ bottom: 90 + Math.max(insets.bottom, 16), backgroundColor: colors.primary, elevation: 5 }}
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
                Please sign in to your UniSphere account to view tutor details
                or create your tutor profile.
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