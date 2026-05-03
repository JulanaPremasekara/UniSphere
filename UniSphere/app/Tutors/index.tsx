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
import { SafeAreaView } from "react-native-safe-area-context";

import { Avatar, AvatarImage } from "@/components/ui/avatar";
import { Box } from "@/components/ui/box";
import { HStack } from "@/components/ui/hstack";
import { Icon } from "@/components/ui/icon";
import { VStack } from "@/components/ui/vstack";

import { useUser } from "@/hooks/useUser";
import apiClient from "../services/api";

import AppHeader from "../components/AppHeader";
import SearchInput from "../components/SearchInput";
import SectionHeader from "../components/SectionHeader";
import Footer from "../components/Footer";
import FilterChips from "../components/FilterChips";

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

  const [tutorList, setTutorList] = useState<any[]>([]);
  const [filteredTutors, setFilteredTutors] = useState<any[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedFilter, setSelectedFilter] = useState<TutorFilter>("ALL");
  const [loading, setLoading] = useState(true);
  const [loginModalVisible, setLoginModalVisible] = useState(false);

  const { userId } = useUser();

  useEffect(() => {
    const fetchAllTutors = async () => {
      try {
        setLoading(true);
        const response = await apiClient.get(`/tutors`);

        if (response.data && response.data.data) {
          setTutorList(response.data.data);
          setFilteredTutors(response.data.data);
        }
      } catch (error) {
        console.error("Error fetching tutors:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchAllTutors();
  }, []);

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
      className="bg-white rounded-[25px] shadow-sm border border-gray-100 p-4 mb-4"
    >
      <HStack space="md" className="items-center">
        <View className="relative">
          <Avatar className="bg-indigo-600 w-16 h-16">
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
            className={`absolute bottom-0 right-0 w-4 h-4 rounded-full border-2 border-white ${
              tutor.isOnline !== false ? "bg-green-500" : "bg-gray-300"
            }`}
          />
        </View>

        <VStack className="flex-1" space="xs">
          <Text className="font-bold text-xl text-black">{tutor.name}</Text>
          <Text className="text-gray-400 text-sm">{tutor.subject}</Text>

          <HStack className="justify-between items-center mt-1">
            <Text className="font-bold text-[#4338CA] text-lg">
              {tutor.price}
              <Text className="text-gray-400 text-sm font-normal">/hr</Text>
            </Text>
          </HStack>
        </VStack>
      </HStack>
    </TouchableOpacity>
  );

  if (loading) {
    return (
      <SafeAreaView className="flex-1 items-center justify-center bg-white">
        <ActivityIndicator size="large" color="#4338CA" />
        <Text className="text-center text-gray-400 mt-4">
          Finding tutors...
        </Text>
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
              <Text className="text-gray-400">No tutors found.</Text>
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
          className="absolute bottom-28 right-8 bg-indigo-600 w-16 h-16 rounded-full items-center justify-center shadow-lg"
          style={{ elevation: 5 }}
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
            <View className="bg-white rounded-[40px] w-full max-w-sm p-8 shadow-2xl items-center">
              <View className="bg-indigo-50 p-6 rounded-full mb-6">
                <Calendar size={40} color="#4F46E5" />
              </View>

              <Text className="text-2xl font-black text-gray-900 mb-2">
                Login Required
              </Text>

              <Text className="text-gray-500 text-center text-lg mb-8 leading-relaxed">
                Please sign in to your UniSphere account to view tutor details
                or create your tutor profile.
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