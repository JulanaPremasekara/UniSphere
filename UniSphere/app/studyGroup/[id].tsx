import { useLocalSearchParams, useRouter } from "expo-router";
import { Calendar, CheckCircle2, Pencil } from "lucide-react-native";
import React, { useEffect, useState } from "react";
import {
  ActivityIndicator,
  ScrollView,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import apiClient from "../services/api";

interface SessionDetailData {
  _id: string;
  subject: string;
  time: string;
  location: string;
  learningGoals?: string[];
  participants?: number;
  maxParticipants?: number;
}

export default function SessionDetail() {
  const router = useRouter();
  const { id } = useLocalSearchParams<{ id: string }>();

  const [session, setSession] = useState<SessionDetailData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let isMounted = true;

    const fetchSession = async () => {
      try {
        setLoading(true);

        const response = await apiClient.get(`/studyGroups/${id}`);

        if (isMounted) {
          setSession(response.data?.data || null);
        }
      } catch {
        if (isMounted) {
          setSession(null);
        }
      } finally {
        if (isMounted) {
          setLoading(false);
        }
      }
    };

    if (id) {
      fetchSession();
    }

    return () => {
      isMounted = false;
    };
  }, [id]);

  if (loading) {
    return (
      <View className="flex-1 justify-center items-center bg-white">
        <ActivityIndicator size="large" color="#4F46E5" />
      </View>
    );
  }

  if (!session) {
    return (
      <View className="flex-1 justify-center items-center bg-white px-6">
        <Text className="text-xl font-bold text-gray-900 mb-2">
          Session Not Found
        </Text>

        <TouchableOpacity
          onPress={() => router.back()}
          className="bg-indigo-600 px-6 py-3 rounded-2xl mt-2"
        >
          <Text className="text-white font-bold">Go Back</Text>
        </TouchableOpacity>
      </View>
    );
  }

  const goals =
    session.learningGoals && session.learningGoals.length > 0
      ? session.learningGoals
      : ["Bring your own questions", "Collaborate on exercises"];

  const participants = session.participants || 0;
  const maxParticipants = session.maxParticipants || 12;

  const progressPercent = Math.max(
    0,
    Math.min(100, (participants / maxParticipants) * 100)
  );

  return (
    <ScrollView className="flex-1 bg-white">
      <View className="p-6 pt-12">
        <Text className="text-3xl font-black mb-6">{session.subject}</Text>

        <View className="bg-gray-50 p-5 rounded-[30px] mb-4 flex-row items-center">
          <Calendar color="#4F46E5" size={20} />
          <Text className="ml-4 font-bold">
            {session.time} • {session.location}
          </Text>
        </View>

        <Text className="text-xl font-bold mt-8 mb-4">Learning Goals</Text>

        {goals.map((goal, i) => (
          <View key={i} className="flex-row items-center mb-3">
            <CheckCircle2 size={20} color="#4F46E5" />
            <Text className="ml-3 text-gray-600">{goal}</Text>
          </View>
        ))}

        <View className="bg-gray-50 p-6 rounded-[35px] mt-6">
          <Text className="font-bold">Participants</Text>

          <Text className="text-gray-500 mb-2">
            {participants}/{maxParticipants} spots taken
          </Text>

          <View className="h-2 bg-gray-200 rounded-full overflow-hidden">
            <View
              className="h-full bg-indigo-600"
              style={{ width: `${progressPercent}%` }}
            />
          </View>
        </View>

        <TouchableOpacity
          onPress={() =>
            router.push({
              pathname: "/studyGroup/edit",
              params: { id: session._id },
            } as any)
          }
          className="mt-8 bg-indigo-600 p-5 rounded-[25px] flex-row justify-center items-center"
        >
          <Pencil size={18} color="white" />
          <Text className="text-white font-bold ml-2">Edit Session</Text>
        </TouchableOpacity>

        <TouchableOpacity
          onPress={() =>
            router.push({
              pathname: "/studyGroup/cancel",
              params: { id: session._id },
            } as any)
          }
          className="mt-6"
        >
          <Text className="text-center text-red-500 font-bold">
            Cancel Session
          </Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
}