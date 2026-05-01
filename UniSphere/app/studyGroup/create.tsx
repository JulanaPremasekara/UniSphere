import React, { useEffect, useState } from "react";
import {
  ScrollView,
  TouchableOpacity,
  Image,
  TextInput,
  ActivityIndicator,
  Alert,
  KeyboardAvoidingView,
  Platform,
  TouchableWithoutFeedback,
  Keyboard,
} from "react-native";
import { useLocalSearchParams, useRouter } from "expo-router";
import * as ImagePicker from "expo-image-picker";
import { ChevronLeft, Camera } from "lucide-react-native";

import { Box } from "@/components/ui/box";
import { VStack } from "@/components/ui/vstack";
import { HStack } from "@/components/ui/hstack";
import { Text } from "@/components/ui/text";
import { Button, ButtonText } from "@/components/ui/button";

import apiClient from "../services/api";

const TAGS = ["GENERAL", "MATHEMATICS", "COMPUTER SCIENCE"];

export default function CreateStudyGroup() {
  const router = useRouter();
  const { editId } = useLocalSearchParams();

  const isEdit = !!editId;

  const [loading, setLoading] = useState(false);
  const [screenLoading, setScreenLoading] = useState(false);

  const [subject, setSubject] = useState("");
  const [location, setLocation] = useState("");
  const [time, setTime] = useState("");
  const [maxParticipants, setMaxParticipants] = useState("");
  const [tag, setTag] = useState("GENERAL");
  const [learningGoals, setLearningGoals] = useState("");
  const [image, setImage] = useState<string | null>(null);

  const [newImageSelected, setNewImageSelected] = useState(false);

  const parseLearningGoalsForInput = (goals: any): string => {
    if (!goals) return "";

    try {
      let parsed = goals;

      while (typeof parsed === "string") {
        parsed = JSON.parse(parsed);
      }

      if (Array.isArray(parsed)) {
        return parsed.join(", ");
      }

      return "";
    } catch {
      return String(goals)
        .replace(/^\[+|\]+$/g, "")
        .replace(/"+/g, "")
        .split(",")
        .map((goal) => goal.trim())
        .filter(Boolean)
        .join(", ");
    }
  };

  useEffect(() => {
    if (!editId) return;

    const fetchStudyGroupForEdit = async () => {
      try {
        setScreenLoading(true);

        const response = await apiClient.get(`/studyGroups/${editId}`);

        const data =
          response.data?.data?.data ||
          response.data?.data ||
          response.data;

        setSubject(data.subject || "");
        setLocation(data.location || "");
        setTime(data.time || "");
        setMaxParticipants(String(data.maxParticipants || ""));
        setTag(data.tag || "GENERAL");
        setLearningGoals(parseLearningGoalsForInput(data.learningGoals));
        setImage(data.image || null);
      } catch (error) {
        console.error("Failed to load study group:", error);
        Alert.alert("Error", "Could not load study group details.");
      } finally {
        setScreenLoading(false);
      }
    };

    fetchStudyGroupForEdit();
  }, [editId]);

  const pickImage = async () => {
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      quality: 0.8,
    });

    if (!result.canceled) {
      setImage(result.assets[0].uri);
      setNewImageSelected(true);
    }
  };

  const handleSave = async () => {
    if (!subject.trim() || !location.trim() || !time.trim() || !maxParticipants.trim()) {
      return Alert.alert("Required", "Please fill all required fields.");
    }

    const maxParticipantsNumber = Number(maxParticipants);

    if (Number.isNaN(maxParticipantsNumber) || maxParticipantsNumber < 1) {
      return Alert.alert(
        "Invalid",
        "Max participants must be a valid number greater than 0."
      );
    }

    setLoading(true);

    try {
      const formData = new FormData();

      formData.append("subject", subject.trim());
      formData.append("location", location.trim());
      formData.append("time", time.trim());
      formData.append("maxParticipants", String(maxParticipantsNumber));
      formData.append("tag", tag);

      const goalsArray = learningGoals
        .split(",")
        .map((goal) => goal.trim())
        .filter(Boolean);

      formData.append("learningGoals", JSON.stringify(goalsArray));

      if (image && newImageSelected) {
        const filename = image.split("/").pop() || "upload.jpg";
        const match = /\.(\w+)$/.exec(filename);
        const type = match ? `image/${match[1]}` : "image/jpeg";

        // @ts-ignore
        formData.append("image", {
          uri: image,
          name: filename,
          
        });
      }

      if (isEdit) {
        await apiClient.put(`/studyGroups/${editId}`, formData, {
          headers: { "Content-Type": "multipart/form-data" },
        });

        Alert.alert("Success", "Study group updated successfully.");
      } else {
        await apiClient.post("/studyGroups", formData, {
          headers: { "Content-Type": "multipart/form-data" },
        });

        Alert.alert("Success", "Study group created successfully.");
      }

      router.replace("/studyGroup");
    } catch (error) {
      console.error("Save study group error:", error);
      Alert.alert(
        "Error",
        isEdit
          ? "Could not update study group."
          : "Could not create study group."
      );
    } finally {
      setLoading(false);
    }
  };

  if (screenLoading) {
    return (
      <Box className="flex-1 bg-white items-center justify-center">
        <ActivityIndicator size="large" color="#4F46E5" />
        <Text className="mt-3 text-gray-500 font-semibold">
          Loading study group...
        </Text>
      </Box>
    );
  }

  const FormContent = (
    <Box className="flex-1 pt-12 bg-white">
      <HStack className="px-6 py-4 items-center">
        <TouchableOpacity onPress={() => router.back()}>
          <ChevronLeft size={28} color="#1f2937" />
        </TouchableOpacity>

        <Text className="ml-4 text-xl font-bold text-gray-900">
          {isEdit ? "Edit Study Group" : "Create Study Group"}
        </Text>
      </HStack>

      <ScrollView
        showsVerticalScrollIndicator={false}
        className="px-6"
        contentContainerStyle={{ paddingBottom: 250 }}
        keyboardShouldPersistTaps="handled"
      >
        <VStack space="xl" className="mt-4">
          <TouchableOpacity
            onPress={pickImage}
            className="h-64 bg-gray-100 rounded-[40px] border-2 border-dashed border-gray-200 items-center justify-center overflow-hidden"
          >
            {image ? (
              <Image source={{ uri: image }} className="w-full h-full" />
            ) : (
              <VStack className="items-center">
                <Camera size={40} color="#9CA3AF" />
                <Text className="text-gray-600 mt-2">Add Photo</Text>
              </VStack>
            )}
          </TouchableOpacity>

          <TextInput
            placeholder="Subject"
            placeholderTextColor="#9CA3AF"
            value={subject}
            onChangeText={setSubject}
            className="bg-gray-50 p-5 rounded-2xl text-lg font-bold text-gray-900 border border-gray-100"
          />

          <TextInput
            placeholder="Location"
            placeholderTextColor="#9CA3AF"
            value={location}
            onChangeText={setLocation}
            className="bg-gray-50 p-5 rounded-2xl text-lg font-bold text-gray-900 border border-gray-100"
          />

          <TextInput
            placeholder="Time (e.g. 2026-05-10T14:30:00Z)"
            placeholderTextColor="#9CA3AF"
            value={time}
            onChangeText={setTime}
            className="bg-gray-50 p-5 rounded-2xl text-lg font-bold text-gray-900 border border-gray-100"
          />

          <TextInput
            placeholder="Max Participants"
            placeholderTextColor="#9CA3AF"
            value={maxParticipants}
            onChangeText={setMaxParticipants}
            keyboardType="numeric"
            className="bg-gray-50 p-5 rounded-2xl text-lg font-bold text-indigo-600 border border-gray-100"
          />

          <VStack space="xs">
            <Text className="text-[11px] font-black text-gray-500 uppercase ml-2">
              Tag
            </Text>

            <HStack space="sm" className="flex-wrap">
              {TAGS.map((t) => (
                <TouchableOpacity
                  key={t}
                  onPress={() => setTag(t)}
                  className={`px-5 py-3 rounded-full border mb-2 ${
                    tag === t
                      ? "bg-indigo-600 border-indigo-600"
                      : "bg-white border-gray-200"
                  }`}
                >
                  <Text
                    className={`font-bold ${
                      tag === t ? "text-white" : "text-gray-700"
                    }`}
                  >
                    {t}
                  </Text>
                </TouchableOpacity>
              ))}
            </HStack>
          </VStack>

          <TextInput
            placeholder="Learning Goals (comma separated)"
            placeholderTextColor="#9CA3AF"
            value={learningGoals}
            onChangeText={setLearningGoals}
            multiline
            className="bg-gray-50 p-5 rounded-2xl text-base text-gray-900 border border-gray-100 min-h-[100px]"
          />
        </VStack>
      </ScrollView>

      <Box className="absolute bottom-0 w-full p-6 bg-white">
        <Button
          onPress={handleSave}
          disabled={loading}
          className="bg-indigo-600 rounded-full h-16 shadow-lg shadow-indigo-100"
        >
          {loading ? (
            <ActivityIndicator color="white" />
          ) : (
            <ButtonText className="text-white font-bold text-lg">
              {isEdit ? "Update Session" : "Create Session"}
            </ButtonText>
          )}
        </Button>
      </Box>
    </Box>
  );

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      style={{ flex: 1, backgroundColor: "white" }}
    >
      {Platform.OS === "web" ? (
        FormContent
      ) : (
        <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
          {FormContent}
        </TouchableWithoutFeedback>
      )}
    </KeyboardAvoidingView>
  );
}