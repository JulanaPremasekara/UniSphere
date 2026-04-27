import { useFocusEffect } from "@react-navigation/native";
import { useRouter } from "expo-router";
import { Clock, MapPin, Plus } from "lucide-react-native";
import React from "react";
import {
  ActivityIndicator,
  ScrollView,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

import { useStudyGroups } from "../../hooks/useStudyGroups";
import Footer from "../components/Footer";

export default function StudyGroupFeed() {
  const router = useRouter();
  const { groups, loading, refreshStudyGroups } = useStudyGroups();

  useFocusEffect(
    React.useCallback(() => {
      refreshStudyGroups();
    }, [refreshStudyGroups])
  );

  if (loading) {
    return (
      <View className="flex-1 justify-center items-center bg-white">
        <ActivityIndicator size="large" color="#4F46E5" />
      </View>
    );
  }

  return (
    <View className="flex-1 bg-white">
      <View className="flex-1 p-6 pt-12">
        <Text className="text-3xl font-bold mb-2">Study Groups</Text>

        <Text className="text-gray-500 mb-6">
          Connect with peers and master your courses together.
        </Text>

        <ScrollView showsVerticalScrollIndicator={false}>
          {groups.map((group) => (
            <TouchableOpacity
              key={group.id}
              onPress={() => router.push(`/studyGroup/${group.id}` as any)}
              className="bg-white border border-gray-100 rounded-[35px] p-6 mb-4 shadow-sm"
            >
              <View className="bg-indigo-100 self-start px-3 py-1 rounded-lg mb-3">
                <Text className="text-indigo-600 font-bold text-[10px]">
                  {group.tag || "GENERAL"}
                </Text>
              </View>

              <Text className="text-lg font-bold mb-4">{group.subject}</Text>

              <View className="flex-row items-center gap-4">
                <View className="flex-row items-center">
                  <Clock size={14} color="#4F46E5" />
                  <Text className="ml-1 text-xs text-gray-600">
                    {group.time}
                  </Text>
                </View>

                <View className="flex-row items-center">
                  <MapPin size={14} color="#4F46E5" />
                  <Text className="ml-1 text-xs text-gray-600">
                    {group.location}
                  </Text>
                </View>
              </View>
            </TouchableOpacity>
          ))}

          {groups.length === 0 && (
            <View className="items-center justify-center py-20">
              <Text className="text-xl font-bold text-gray-800 mb-2">
                No Study Groups Yet
              </Text>
              <Text className="text-gray-500 text-center px-10">
                Create the first study session for your classmates.
              </Text>
            </View>
          )}
        </ScrollView>

        <TouchableOpacity
          onPress={() => router.push("/studyGroup/create" as any)}
          className="absolute bottom-10 right-6 bg-indigo-600 w-16 h-16 rounded-full items-center justify-center shadow-lg"
        >
          <Plus color="white" size={30} />
        </TouchableOpacity>
      </View>

      <Footer />
    </View>
  );
}