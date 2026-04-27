import { useLocalSearchParams, useRouter } from "expo-router";
import { Book, Clock, MapPin, Users, X } from "lucide-react-native";
import React, { useEffect, useState } from "react";
import {
  ActivityIndicator,
  Alert,
  ScrollView,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import apiClient from "../services/api";

export default function EditSession() {
  const router = useRouter();
  const { id } = useLocalSearchParams<{ id: string }>();

  const [subject, setSubject] = useState("");
  const [location, setLocation] = useState("");
  const [time, setTime] = useState("");
  const [maxParticipants, setMaxParticipants] = useState("");

  const [loading, setLoading] = useState(true);
  const [updating, setUpdating] = useState(false);

  useEffect(() => {
    const fetchSession = async () => {
      try {
        setLoading(true);

        const response = await apiClient.get(`/studyGroups/${id}`);
        const session = response.data?.data;

        setSubject(session?.subject || "");
        setLocation(session?.location || "");
        setTime(session?.time || "");
        setMaxParticipants(String(session?.maxParticipants || ""));
      } catch (error: any) {
        Alert.alert("Error", "Could not load session details");
      } finally {
        setLoading(false);
      }
    };

    if (id) {
      fetchSession();
    }
  }, [id]);

  const handleUpdateSession = async () => {
    const maxParticipantsNumber = Number(maxParticipants);

    if (
      !subject.trim() ||
      !location.trim() ||
      !time.trim() ||
      !maxParticipants.trim()
    ) {
      Alert.alert(
        "Missing Details",
        "Please enter subject title, location, time, and participants."
      );
      return;
    }

    if (isNaN(maxParticipantsNumber) || maxParticipantsNumber <= 0) {
      Alert.alert("Invalid Participants", "Please enter a valid number.");
      return;
    }

    try {
      setUpdating(true);

      const payload = {
        subject: subject.trim(),
        location: location.trim(),
        time: time.trim(),
        maxParticipants: maxParticipantsNumber,
      };

      const response = await apiClient.put(`/studyGroups/${id}`, payload);

      if (!response.data?.success) {
        throw new Error(response.data?.message || "Update failed");
      }

      Alert.alert("Success", "Study session updated successfully!", [
        {
          text: "OK",
          onPress: () => router.replace(`/studyGroup/${id}` as any),
        },
      ]);
    } catch (error: any) {
      const message =
        error?.response?.data?.message ||
        error?.message ||
        "Could not update session";

      Alert.alert("Update Failed", message);
    } finally {
      setUpdating(false);
    }
  };

  if (loading) {
    return (
      <View className="flex-1 justify-center items-center bg-white">
        <ActivityIndicator size="large" color="#4F46E5" />
      </View>
    );
  }

  return (
    <ScrollView
      className="flex-1 bg-white p-6 pt-12"
      keyboardShouldPersistTaps="handled"
    >
      <View className="flex-row justify-between items-center mb-2">
        <Text className="text-3xl font-bold">Edit Session</Text>

        <TouchableOpacity onPress={() => router.back()}>
          <X color="black" />
        </TouchableOpacity>
      </View>

      <Text className="text-gray-500 mb-8">
        Update your study group session details.
      </Text>

      <Text className="font-bold mb-2">Subject Title</Text>
      <View className="bg-gray-50 flex-row items-center p-4 rounded-3xl mb-6">
        <Book size={20} color="#9CA3AF" />
        <TextInput
          className="ml-3 flex-1"
          placeholder="e.g. Advanced Macroeconomics"
          value={subject}
          onChangeText={setSubject}
        />
      </View>

      <Text className="font-bold mb-2">Location</Text>
      <View className="bg-gray-50 flex-row items-center p-4 rounded-3xl mb-6">
        <MapPin size={20} color="#9CA3AF" />
        <TextInput
          className="ml-3 flex-1"
          placeholder="Level 4, North Library"
          value={location}
          onChangeText={setLocation}
        />
      </View>

      <Text className="font-bold mb-2">Time</Text>
      <View className="bg-gray-50 flex-row items-center p-4 rounded-3xl mb-6">
        <Clock size={20} color="#9CA3AF" />
        <TextInput
          className="ml-3 flex-1"
          placeholder="e.g. 2:00 PM"
          value={time}
          onChangeText={setTime}
        />
      </View>

      <Text className="font-bold mb-2">No. of Participants</Text>
      <View className="bg-gray-50 flex-row items-center p-4 rounded-3xl mb-6">
        <Users size={20} color="#9CA3AF" />
        <TextInput
          className="ml-3 flex-1"
          placeholder="e.g. 12"
          value={maxParticipants}
          onChangeText={setMaxParticipants}
          keyboardType="numeric"
        />
      </View>

      <TouchableOpacity
        onPress={handleUpdateSession}
        disabled={updating}
        activeOpacity={0.8}
        className={`p-5 rounded-[25px] mt-10 mb-20 ${
          updating ? "bg-indigo-400" : "bg-indigo-600"
        }`}
      >
        {updating ? (
          <ActivityIndicator color="white" />
        ) : (
          <Text className="text-white text-center font-bold">
            Update Session
          </Text>
        )}
      </TouchableOpacity>
    </ScrollView>
  );
}