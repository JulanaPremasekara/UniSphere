import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  Platform,
  ActivityIndicator,
} from "react-native";
import { useRouter } from "expo-router";
import { ChevronLeft, Users, Clock, MapPin } from "lucide-react-native";
import Footer from "../components/Footer";
import { useUser } from "@/hooks/useUser";
import apiClient from "../services/api";

export default function JoinedStudyGroups() {
  const router = useRouter();
  const { userId } = useUser();
  const [groups, setGroups] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchJoinedGroups = async () => {
      if (!userId) return;
      try {
        setLoading(true);
        const response = await apiClient.get("/studyGroups");
        const data = response.data.data || response.data;
        
        if (Array.isArray(data)) {
          // Filter groups where the current user is a participant
          const joined = data.filter((group: any) => 
            group.joinedUsers?.includes(userId) || group.createdBy === userId
          );
          setGroups(joined);
        }
      } catch (error) {
        console.error("Error fetching joined groups:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchJoinedGroups();
  }, [userId]);

  if (loading) {
    return (
      <View className="flex-1 justify-center items-center bg-white">
        <ActivityIndicator size="large" color="#4F46E5" />
      </View>
    );
  }

  return (
    <View className="flex-1 bg-white">
      <View
        className="flex-row items-center px-6 pb-4 bg-white"
        style={{ paddingTop: Platform.OS === "ios" ? 70 : 60 }}
      >
        <TouchableOpacity onPress={() => router.back()} className="p-2 -ml-2">
          <ChevronLeft size={28} color="#1E1B4B" />
        </TouchableOpacity>
        <Text className="text-xl font-bold ml-4 text-indigo-900">
          My Study Groups
        </Text>
      </View>

      <ScrollView
        className="flex-1 px-6 bg-gray-50/30"
        contentContainerStyle={{ paddingBottom: 120 }}
      >
        <View className="mt-6 mb-4">
          <Text className="text-gray-400 font-bold text-[11px] uppercase tracking-[2px] ml-1">
            Joined Groups ({groups.length})
          </Text>
        </View>

        {groups.length > 0 ? (
          groups.map((group) => (
            <TouchableOpacity
              key={group._id || group.id}
              onPress={() => router.push(`/studyGroup/${group._id || group.id}`)}
              className="bg-white rounded-[30px] mb-6 overflow-hidden border border-gray-100 shadow-sm p-6"
            >
              <View className="bg-indigo-100 self-start px-3 py-1 rounded-full mb-3">
                <Text className="text-indigo-700 font-black text-[9px] uppercase">
                  {group.tag || "GENERAL"}
                </Text>
              </View>

              <Text className="text-xl font-black text-gray-900 mb-4">
                {group.subject}
              </Text>

              <View className="gap-y-2">
                <View className="flex-row items-center bg-gray-50 p-2.5 rounded-xl self-start">
                  <Clock size={14} color="#4F46E5" />
                  <Text className="ml-2 text-xs text-gray-600 font-medium">
                    {group.time}
                  </Text>
                </View>

                <View className="flex-row items-center bg-gray-50 p-2.5 rounded-xl self-start">
                  <MapPin size={14} color="#4F46E5" />
                  <Text className="ml-2 text-xs text-gray-600 font-medium">
                    {group.location}
                  </Text>
                </View>
              </View>
            </TouchableOpacity>
          ))
        ) : (
          <View className="flex-1 items-center justify-center py-20">
            <View className="bg-indigo-50 p-8 rounded-full mb-4">
              <Users size={48} color="#4F46E5" />
            </View>
            <Text className="text-xl font-bold text-gray-800 mb-2">
              No Groups Joined
            </Text>
            <Text className="text-gray-500 text-center px-10">
              You haven't joined any study groups yet. Find your peers and start
              collaborating!
            </Text>
            <TouchableOpacity
              onPress={() => router.push("/studyGroup")}
              className="mt-8 bg-indigo-600 px-8 py-4 rounded-3xl"
            >
              <Text className="text-white font-bold">Browse Groups</Text>
            </TouchableOpacity>
          </View>
        )}
      </ScrollView>
      <Footer />
    </View>
  );
}
