import { useRouter } from "expo-router";
import { Calendar, Clock, MapPin, Plus } from "lucide-react-native";
import React, { useState } from "react";
import {
  ScrollView,
  Text,
  TouchableOpacity,
  View,
  Modal,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

import Footer from "../components/Footer";
import AppHeader from "../components/AppHeader";
import SearchInput from "../components/SearchInput";
import SectionHeader from "../components/SectionHeader";
import FilterChips from "../components/FilterChips";
import { useUser } from "@/hooks/useUser";

type StudyFilter = "ALL" | "MATHEMATICS" | "COMPUTER SCIENCE";

const filterOptions: StudyFilter[] = [
  "ALL",
  "MATHEMATICS",
  "COMPUTER SCIENCE",
];

export default function StudyGroupFeed() {
  const router = useRouter();

  const { userId } = useUser();
  const [loginModalVisible, setLoginModalVisible] = useState(false);

  const [searchQuery, setSearchQuery] = useState("");
  const [selectedFilter, setSelectedFilter] = useState<StudyFilter>("ALL");

  const groups = [
    {
      id: "1",
      subject: "Calculus III: Multivariable Integration",
      time: "2:00 PM",
      location: "Central Library, Room 402",
      tag: "MATHEMATICS",
    },
    {
      id: "2",
      subject: "Data Structures & Algorithms Mock Interviews",
      time: "4:30 PM",
      location: "Engineering Hall",
      tag: "COMPUTER SCIENCE",
    },
  ];

  const filteredGroups = groups.filter((group) => {
    const matchesSearch =
      group.subject.toLowerCase().includes(searchQuery.toLowerCase()) ||
      group.location.toLowerCase().includes(searchQuery.toLowerCase()) ||
      group.tag.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesFilter =
      selectedFilter === "ALL" || group.tag === selectedFilter;

    return matchesSearch && matchesFilter;
  });

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

  const renderHeader = () => (
    <View>
      <AppHeader title="UniSphere" />

      <SearchInput
        value={searchQuery}
        onChangeText={setSearchQuery}
        placeholder="Find study groups..."
      />

      <FilterChips
        options={filterOptions}
        selectedValue={selectedFilter}
        onSelect={setSelectedFilter}
      />

      <SectionHeader
        title="Study Groups"
        subtitle="Connect with peers and master your courses together."
      />
    </View>
  );

  return (
    <SafeAreaView edges={["top"]} className="flex-1 bg-white">
      <View className="flex-1">
        <ScrollView
          showsVerticalScrollIndicator={false}
          contentContainerStyle={{
            paddingHorizontal: 20,
            paddingTop: 16,
            paddingBottom: 160,
          }}
        >
          {renderHeader()}

          {filteredGroups.length > 0 ? (
            <View>
              {filteredGroups.map((group) => (
                <TouchableOpacity
                  key={group.id}
                  onPress={() => handlePressGroup(group.id)}
                  className="bg-white rounded-[35px] mb-8 overflow-hidden border border-gray-100 shadow-sm p-6"
                >
                  <View className="bg-indigo-100 self-start px-4 py-2 rounded-full mb-4">
                    <Text className="text-indigo-700 font-black text-[10px] uppercase">
                      {group.tag}
                    </Text>
                  </View>

                  <Text className="text-2xl font-black text-gray-900 mb-5">
                    {group.subject}
                  </Text>

                  <View className="gap-y-3">
                    <View className="flex-row items-center bg-gray-50 p-3 rounded-2xl self-start">
                      <Clock size={16} color="#4F46E5" />
                      <Text className="ml-2 text-sm text-gray-600 font-medium">
                        {group.time}
                      </Text>
                    </View>

                    <View className="flex-row items-center bg-gray-50 p-3 rounded-2xl self-start">
                      <MapPin size={16} color="#4F46E5" />
                      <Text className="ml-2 text-sm text-gray-600 font-medium">
                        {group.location}
                      </Text>
                    </View>
                  </View>
                </TouchableOpacity>
              ))}
            </View>
          ) : (
            <View className="w-full py-20 items-center">
              <Text className="text-lg font-bold text-gray-700">
                No study groups found
              </Text>

              <Text className="text-sm text-gray-400 mt-2 text-center px-10">
                Try adjusting your search or filter.
              </Text>
            </View>
          )}
        </ScrollView>

        <TouchableOpacity
          onPress={handleCreateGroup}
          className="absolute bottom-28 right-8 bg-indigo-600 w-16 h-16 rounded-full items-center justify-center shadow-lg"
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
                Please sign in to view study group details or create a new
                study group.
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