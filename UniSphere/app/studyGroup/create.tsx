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
  View,
} from "react-native";
import { useLocalSearchParams, useRouter } from "expo-router";
import * as ImagePicker from "expo-image-picker";
import { ChevronLeft, Camera } from "lucide-react-native";

import { Box } from "@/components/ui/box";
import { VStack } from "@/components/ui/vstack";
import { HStack } from "@/components/ui/hstack";
import { Text } from "@/components/ui/text";
import { Button, ButtonText } from "@/components/ui/button";

import apiClient from "@/services/api";
import { useTheme } from "@/context/ThemeContext";

const TAGS = ["GENERAL", "MATHEMATICS", "COMPUTER SCIENCE"];

type FormErrors = {
  subject?: string;
  location?: string;
  time?: string;
  maxParticipants?: string;
  tag?: string;
  learningGoals?: string;
  image?: string;
};

export default function CreateStudyGroup() {
  const router = useRouter();
  const { editId } = useLocalSearchParams();
  const { colors } = useTheme();

  const isEdit = !!editId;

  const [loading, setLoading] = useState(false);
  const [screenLoading, setScreenLoading] = useState(false);
  const [errors, setErrors] = useState<FormErrors>({});

  const [subject, setSubject] = useState("");
  const [location, setLocation] = useState("");
  const [time, setTime] = useState("");
  const [maxParticipants, setMaxParticipants] = useState("");
  const [tag, setTag] = useState("GENERAL");
  const [learningGoals, setLearningGoals] = useState("");
  const [image, setImage] = useState<string | null>(null);
  const [newImageSelected, setNewImageSelected] = useState(false);

  const clearError = (field: keyof FormErrors) => {
    setErrors((prev) => ({
      ...prev,
      [field]: undefined,
    }));
  };

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
        setNewImageSelected(false);
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
      clearError("image");
    }
  };

  const handleSave = async () => {
    setErrors({});

    const localErrors: FormErrors = {};

    if (!subject.trim()) localErrors.subject = "Subject is required.";
    if (!location.trim()) localErrors.location = "Location is required.";
    if (!time.trim()) localErrors.time = "Time is required.";
    if (!maxParticipants.trim()) {
      localErrors.maxParticipants = "Max participants is required.";
    }

    const maxParticipantsNumber = Number(maxParticipants);

    if (
      maxParticipants.trim() &&
      (Number.isNaN(maxParticipantsNumber) || maxParticipantsNumber < 1)
    ) {
      localErrors.maxParticipants =
        "Max participants must be a valid number greater than 0.";
    }

    if (Object.keys(localErrors).length > 0) {
      setErrors(localErrors);
      return;
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

        formData.append("image", {
          uri: image,
          name: filename,
          type,
        } as any);
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
    } catch (error: any) {
      const backendErrors = error.response?.data?.errors;

      if (Array.isArray(backendErrors)) {
        const fieldErrors: FormErrors = {};

        backendErrors.forEach((err: { field: string; message: string }) => {
          if (
            err.field === "subject" ||
            err.field === "location" ||
            err.field === "time" ||
            err.field === "maxParticipants" ||
            err.field === "tag" ||
            err.field === "learningGoals" ||
            err.field === "image"
          ) {
            fieldErrors[err.field as keyof FormErrors] = err.message;
          }
        });

        setErrors(fieldErrors);
        return;
      }

      Alert.alert(
        "Error",
        error.response?.data?.message ||
          (isEdit
            ? "Could not update study group."
            : "Could not create study group.")
      );
    } finally {
      setLoading(false);
    }
  };

  if (screenLoading) {
    return (
      <Box style={{ backgroundColor: colors.bg }} className="flex-1 items-center justify-center">
        <ActivityIndicator size="large" color={colors.primary} />
        <Text style={{ color: colors.textSecondary }} className="mt-3 font-semibold">
          Loading study group...
        </Text>
      </Box>
    );
  }

  const FormContent = (
    <Box style={{ backgroundColor: colors.bg }} className="flex-1 pt-12">
      <HStack className="px-6 py-4 items-center">
        <TouchableOpacity onPress={() => router.back()}>
          <ChevronLeft size={28} color={colors.text} />
        </TouchableOpacity>

        <Text style={{ color: colors.text }} className="ml-4 text-xl font-bold">
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
          <VStack>
            <TouchableOpacity
              onPress={pickImage}
              style={{
                backgroundColor: colors.bgCard,
                borderColor: errors.image ? "#EF4444" : colors.border,
              }}
              className="h-64 rounded-[40px] border-2 border-dashed items-center justify-center overflow-hidden"
            >
              {image ? (
                <Image source={{ uri: image }} className="w-full h-full" />
              ) : (
                <VStack className="items-center">
                  <Camera size={40} color={colors.textMuted} />
                  <Text style={{ color: colors.textSecondary }} className="mt-2">Add Photo</Text>
                </VStack>
              )}
            </TouchableOpacity>

            {errors.image && (
              <Text className="mt-1 text-xs font-medium text-red-500">
                {errors.image}
              </Text>
            )}
          </VStack>

          <VStack>
            <TextInput
              placeholder="Subject"
              placeholderTextColor={colors.textMuted}
              value={subject}
              onChangeText={(text) => {
                setSubject(text);
                clearError("subject");
              }}
              style={{
                backgroundColor: colors.bgInput,
                color: colors.text,
                borderColor: errors.subject ? "#EF4444" : "transparent",
                borderWidth: errors.subject ? 1 : 0,
              }}
              className="p-5 rounded-2xl text-lg font-bold"
            />

            {errors.subject && (
              <Text className="mt-1 text-xs font-medium text-red-500">
                {errors.subject}
              </Text>
            )}
          </VStack>

          <VStack>
            <TextInput
              placeholder="Location"
              placeholderTextColor={colors.textMuted}
              value={location}
              onChangeText={(text) => {
                setLocation(text);
                clearError("location");
              }}
              style={{
                backgroundColor: colors.bgInput,
                color: colors.text,
                borderColor: errors.location ? "#EF4444" : "transparent",
                borderWidth: errors.location ? 1 : 0,
              }}
              className="p-5 rounded-2xl text-lg font-bold"
            />

            {errors.location && (
              <Text className="mt-1 text-xs font-medium text-red-500">
                {errors.location}
              </Text>
            )}
          </VStack>

          <VStack>
            <TextInput
              placeholder="Time (e.g. 2026-05-10T14:30:00Z)"
              placeholderTextColor={colors.textMuted}
              value={time}
              onChangeText={(text) => {
                setTime(text);
                clearError("time");
              }}
              style={{
                backgroundColor: colors.bgInput,
                color: colors.text,
                borderColor: errors.time ? "#EF4444" : "transparent",
                borderWidth: errors.time ? 1 : 0,
              }}
              className="p-5 rounded-2xl text-lg font-bold"
            />

            {errors.time && (
              <Text className="mt-1 text-xs font-medium text-red-500">
                {errors.time}
              </Text>
            )}
          </VStack>

          <VStack>
            <TextInput
              placeholder="Max Participants"
              placeholderTextColor={colors.textMuted}
              value={maxParticipants}
              onChangeText={(text) => {
                setMaxParticipants(text);
                clearError("maxParticipants");
              }}
              keyboardType="numeric"
              style={{
                backgroundColor: colors.bgInput,
                color: colors.text,
                borderColor: errors.maxParticipants ? "#EF4444" : "transparent",
                borderWidth: errors.maxParticipants ? 1 : 0,
              }}
              className="p-5 rounded-2xl text-lg font-bold"
            />

            {errors.maxParticipants && (
              <Text className="mt-1 text-xs font-medium text-red-500">
                {errors.maxParticipants}
              </Text>
            )}
          </VStack>

          <VStack space="xs">
            <Text style={{ color: colors.textMuted }} className="text-[11px] font-black uppercase ml-2">
              Tag
            </Text>

            <HStack space="sm" className="flex-wrap">
              {TAGS.map((t) => (
                <TouchableOpacity
                  key={t}
                  onPress={() => {
                    setTag(t);
                    clearError("tag");
                  }}
                  style={{
                    backgroundColor: tag === t ? colors.primary : colors.bgInput,
                    borderColor: tag === t ? colors.primary : colors.border,
                  }}
                  className="px-5 py-3 rounded-full border mb-2"
                >
                  <Text
                    style={{
                      color: tag === t ? "white" : colors.textSecondary,
                    }}
                    className="font-bold"
                  >
                    {t}
                  </Text>
                </TouchableOpacity>
              ))}
            </HStack>

            {errors.tag && (
              <Text className="mt-1 text-xs font-medium text-red-500">
                {errors.tag}
              </Text>
            )}
          </VStack>

          <VStack>
            <TextInput
              placeholder="Learning Goals (comma separated)"
              placeholderTextColor={colors.textMuted}
              value={learningGoals}
              onChangeText={(text) => {
                setLearningGoals(text);
                clearError("learningGoals");
              }}
              multiline
              textAlignVertical="top"
              style={{
                backgroundColor: colors.bgInput,
                color: colors.text,
                borderColor: errors.learningGoals ? "#EF4444" : "transparent",
                borderWidth: errors.learningGoals ? 1 : 0,
              }}
              className="p-5 rounded-2xl text-base border min-h-[100px]"
            />

            {errors.learningGoals && (
              <Text className="mt-1 text-xs font-medium text-red-500">
                {errors.learningGoals}
              </Text>
            )}
          </VStack>
        </VStack>
      </ScrollView>

      <Box style={{ backgroundColor: colors.bg }} className="absolute bottom-0 w-full p-6">
        <Button
          onPress={handleSave}
          disabled={loading}
          style={{ backgroundColor: colors.primary }}
          className="rounded-full h-16 shadow-lg"
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
      style={{ flex: 1, backgroundColor: colors.bg }}
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