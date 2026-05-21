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
import Footer from "@/components/Footer";
import { useUser } from "@/hooks/useUser";
import apiClient from "@/services/api";
import { useTheme } from "@/context/ThemeContext";

export default function JoinedStudyGroups() {
  const router = useRouter();
  const { userId } = useUser();
  const { colors } = useTheme();
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
      <View style={{ backgroundColor: colors.bg }} className="flex-1 justify-center items-center">
        <ActivityIndicator size="large" color={colors.primary} />
      </View>
    );
  }

  return (
    <View style={{ backgroundColor: colors.bg }} className="flex-1">
      <View
        style={{ backgroundColor: colors.bg, paddingTop: Platform.OS === "ios" ? 70 : 60 }}
        className="flex-row items-center px-6 pb-4"
      >
        <TouchableOpacity onPress={() => router.back()} className="p-2 -ml-2">
          <ChevronLeft size={28} color={colors.text} />
        </TouchableOpacity>
        <Text style={{ color: colors.text }} className="text-xl font-bold ml-4">
          My Study Groups
        </Text>
      </View>

      <ScrollView
        style={{ backgroundColor: colors.bg }}
        className="flex-1 px-6"
        contentContainerStyle={{ paddingBottom: 120 }}
      >
        <View className="mt-6 mb-4">
          <Text style={{ color: colors.textMuted }} className="font-bold text-[11px] uppercase tracking-[2px] ml-1">
            Joined Groups ({groups.length})
          </Text>
        </View>

        {groups.length > 0 ? (
          groups.map((group) => (
            <TouchableOpacity
              key={group._id || group.id}
              onPress={() => router.push(`/studyGroup/${group._id || group.id}`)}
              style={{ backgroundColor: colors.bgCard, borderColor: colors.border, borderWidth: 1 }}
              className="rounded-[30px] mb-6 overflow-hidden shadow-sm p-6"
            >
              <View style={{ backgroundColor: colors.primaryLight }} className="self-start px-3 py-1 rounded-full mb-3">
                <Text style={{ color: colors.primary }} className="font-black text-[9px] uppercase">
                  {group.tag || "GENERAL"}
                </Text>
              </View>

              <Text style={{ color: colors.text }} className="text-xl font-black mb-4">
                {group.subject}
              </Text>

              <View className="gap-y-2">
                <View style={{ backgroundColor: colors.bgInput }} className="flex-row items-center p-2.5 rounded-xl self-start">
                  <Clock size={14} color={colors.primary} />
                  <Text style={{ color: colors.textSecondary }} className="ml-2 text-xs font-medium">
                    {group.time}
                  </Text>
                </View>

                <View style={{ backgroundColor: colors.bgInput }} className="flex-row items-center p-2.5 rounded-xl self-start">
                  <MapPin size={14} color={colors.primary} />
                  <Text style={{ color: colors.textSecondary }} className="ml-2 text-xs font-medium">
                    {group.location}
                  </Text>
                </View>
              </View>
            </TouchableOpacity>
          ))
        ) : (
          <View className="flex-1 items-center justify-center py-20">
            <View style={{ backgroundColor: colors.primaryLight }} className="p-8 rounded-full mb-4">
              <Users size={48} color={colors.primary} />
            </View>
            <Text style={{ color: colors.text }} className="text-xl font-bold mb-2">
              No Groups Joined
            </Text>
            <Text style={{ color: colors.textSecondary }} className="text-center px-10">
              You haven't joined any study groups yet. Find your peers and start
              collaborating!
            </Text>
            <TouchableOpacity
              onPress={() => router.push("/studyGroup")}
              style={{ backgroundColor: colors.primary }}
              className="mt-8 px-8 py-4 rounded-3xl"
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
