import { useRouter } from "expo-router";
import { User, X, Camera } from "lucide-react-native";
import React, { useRef, useState } from "react";
import {
  Alert,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  TouchableOpacity,
  View,
  ActivityIndicator,
} from "react-native";
import * as ImagePicker from "expo-image-picker";

import { Avatar, AvatarImage } from "@/components/ui/avatar";
import { HStack } from "@/components/ui/hstack";
import { Icon } from "@/components/ui/icon";
import { Input, InputField, InputSlot } from "@/components/ui/input";
import { Text } from "@/components/ui/text";
import { VStack } from "@/components/ui/vstack";
import apiClient from "../services/api";

type FormErrors = {
  name?: string;
  fullName?: string;
  subject?: string;
  subjects?: string;
  price?: string;
  hourlyRate?: string;
  bio?: string;
  phone?: string;
  image?: string;
};

export default function ProfileSetup() {
  const router = useRouter();
  const savingRef = useRef(false);

  const [fullName, setFullName] = useState("");
  const [hourlyRate, setHourlyRate] = useState("");
  const [subjects, setSubjects] = useState("");
  const [bio, setBio] = useState("");
  const [phone, setPhone] = useState("");
  const [image, setImage] = useState<string | null>(null);

  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState<FormErrors>({});

  const clearError = (field: keyof FormErrors) => {
    setErrors((prev) => ({ ...prev, [field]: undefined }));
  };

  const getError = (...fields: (keyof FormErrors)[]) => {
    for (const field of fields) {
      if (errors[field]) return errors[field];
    }
    return undefined;
  };

  const pickImage = async () => {
    if (loading) return;

    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();

    if (status !== "granted") {
      Alert.alert(
        "Permission Denied",
        "We need access to your photos to upload a profile picture."
      );
      return;
    }

    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [1, 1],
      quality: 0.7,
    });

    if (!result.canceled) {
      setImage(result.assets[0].uri);
      clearError("image");
    }
  };

  const handleSaveProfile = async () => {
    if (savingRef.current || loading) return;

    setErrors({});

    const localErrors: FormErrors = {};

    if (!fullName.trim()) localErrors.name = "Full name is required.";
    if (!hourlyRate.trim()) localErrors.price = "Hourly rate is required.";
    if (!subjects.trim()) localErrors.subject = "Subject is required.";
    if (!image) localErrors.image = "Profile photo is required.";

    if (Object.keys(localErrors).length > 0) {
      setErrors(localErrors);
      return;
    }

    savingRef.current = true;
    setLoading(true);

    try {
      const formData = new FormData();

      formData.append("name", fullName.trim());
      formData.append("subject", subjects.trim());
      formData.append("price", `Rs.${hourlyRate.trim()}`);
      formData.append("bio", bio.trim());
      formData.append("phone", phone.trim());
      formData.append("isOnline", "true");

      if (image) {
        const filename = image.split("/").pop() || "profile.jpg";
        const match = /\.(\w+)$/.exec(filename);
        const type = match ? `image/${match[1].toLowerCase()}` : "image/jpeg";

        formData.append("image", {
          uri: image,
          name: filename,
          type,
        } as any);
      }

      const response = await apiClient.post("/tutors/setup", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });

      if (response.status === 201 || response.status === 200) {
        Alert.alert("Success", "Tutor profile created successfully!", [
          {
            text: "OK",
            onPress: () => router.replace("/Tutors"),
          },
        ]);
      }
    } catch (error: any) {
      const backendErrors = error.response?.data?.errors;

      if (Array.isArray(backendErrors)) {
        const fieldErrors: FormErrors = {};

        backendErrors.forEach((err: { field: string; message: string }) => {
          if (
            err.field === "name" ||
            err.field === "fullName" ||
            err.field === "subject" ||
            err.field === "subjects" ||
            err.field === "price" ||
            err.field === "hourlyRate" ||
            err.field === "bio" ||
            err.field === "phone" ||
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
        error.response?.data?.message || "Failed to save profile."
      );
    } finally {
      savingRef.current = false;
      setLoading(false);
    }
  };

  const nameError = getError("name", "fullName");
  const priceError = getError("price", "hourlyRate");
  const subjectError = getError("subject", "subjects");

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      style={{ flex: 1 }}
    >
      <ScrollView
        className="flex-1 bg-gray-50"
        keyboardShouldPersistTaps="handled"
        showsVerticalScrollIndicator={false}
      >
        <View className="bg-white rounded-t-[40px] mt-20 p-8 flex-1 min-h-[800px]">
          <HStack className="justify-between items-center mb-2">
            <Text className="text-3xl font-bold text-black">
              Profile Setup
            </Text>

            <TouchableOpacity disabled={loading} onPress={() => router.back()}>
              <Icon as={X} size="xl" className="text-gray-400" />
            </TouchableOpacity>
          </HStack>

          <Text className="text-gray-500 mb-6">
            Tell us about your academic expertise.
          </Text>

          <View className="items-center mb-8">
            <TouchableOpacity
              onPress={pickImage}
              activeOpacity={0.7}
              disabled={loading}
            >
              <Avatar
                className={`bg-indigo-600 w-24 h-24 relative ${
                  errors.image ? "border-2 border-red-400" : ""
                }`}
              >
                {image ? (
                  <AvatarImage
                    source={{ uri: image }}
                    className="w-full h-full rounded-full"
                  />
                ) : (
                  <Icon as={User} size="xl" className="text-white" />
                )}

                <View className="absolute bottom-0 right-0 bg-white p-1.5 rounded-full shadow-sm border border-gray-100">
                  <Icon as={Camera} size="xs" className="text-indigo-600" />
                </View>
              </Avatar>
            </TouchableOpacity>

            <Text className="text-gray-400 text-xs mt-3 font-medium uppercase tracking-tighter">
              {image ? "Tap to change" : "Add Profile Photo"}
            </Text>

            {errors.image && (
              <Text className="mt-1 text-xs font-medium text-red-500">
                {errors.image}
              </Text>
            )}
          </View>

          <VStack space="xl">
            <VStack space="xs">
              <Text className="text-xs font-bold uppercase tracking-wider text-black">
                Full Name
              </Text>

              <Input
                variant="rounded"
                className={`bg-gray-100 h-14 px-2 border ${
                  nameError ? "border-red-400" : "border-transparent"
                }`}
              >
                <InputField
                  className="text-black"
                  placeholder="Dr. Julian Sterling"
                  placeholderTextColor="#9CA3AF"
                  value={fullName}
                  editable={!loading}
                  onChangeText={(text) => {
                    setFullName(text);
                    clearError("name");
                    clearError("fullName");
                  }}
                />
              </Input>

              {nameError && (
                <Text className="mt-1 text-xs font-medium text-red-500">
                  {nameError}
                </Text>
              )}
            </VStack>

            <VStack space="xs">
              <Text className="text-xs font-bold uppercase tracking-wider text-black">
                Hourly Rate (LKR)
              </Text>

              <Input
                variant="rounded"
                className={`bg-gray-100 h-14 px-2 border ${
                  priceError ? "border-red-400" : "border-transparent"
                }`}
              >
                <InputSlot className="pl-3">
                  <Text className="text-gray-400 mr-1">Rs.</Text>
                </InputSlot>

                <InputField
                  className="text-black"
                  placeholder="1000"
                  placeholderTextColor="#9CA3AF"
                  keyboardType="numeric"
                  value={hourlyRate}
                  editable={!loading}
                  onChangeText={(text) => {
                    setHourlyRate(text);
                    clearError("price");
                    clearError("hourlyRate");
                  }}
                />
              </Input>

              {priceError && (
                <Text className="mt-1 text-xs font-medium text-red-500">
                  {priceError}
                </Text>
              )}
            </VStack>

            <VStack space="xs">
              <Text className="text-xs font-bold uppercase tracking-wider text-black">
                Subjects
              </Text>

              <Input
                variant="rounded"
                className={`bg-gray-100 h-14 px-2 border ${
                  subjectError ? "border-red-400" : "border-transparent"
                }`}
              >
                <InputField
                  className="text-black"
                  placeholder="Physics, Calculus"
                  placeholderTextColor="#9CA3AF"
                  value={subjects}
                  editable={!loading}
                  onChangeText={(text) => {
                    setSubjects(text);
                    clearError("subject");
                    clearError("subjects");
                  }}
                />
              </Input>

              {subjectError && (
                <Text className="mt-1 text-xs font-medium text-red-500">
                  {subjectError}
                </Text>
              )}
            </VStack>

            <VStack space="xs">
              <Text className="text-xs font-bold uppercase tracking-wider text-black">
                Bio & Experience
              </Text>

              <Input
                variant="rounded"
                className={`bg-gray-100 h-14 px-2 border ${
                  errors.bio ? "border-red-400" : "border-transparent"
                }`}
              >
                <InputField
                  className="text-black"
                  placeholder="Share your background..."
                  placeholderTextColor="#9CA3AF"
                  value={bio}
                  editable={!loading}
                  onChangeText={(text) => {
                    setBio(text);
                    clearError("bio");
                  }}
                />
              </Input>

              {errors.bio && (
                <Text className="mt-1 text-xs font-medium text-red-500">
                  {errors.bio}
                </Text>
              )}
            </VStack>

            <VStack space="xs">
              <Text className="text-xs font-bold uppercase tracking-wider text-black">
                Contact Number
              </Text>

              <Input
                variant="rounded"
                className={`bg-gray-100 h-14 px-2 border ${
                  errors.phone ? "border-red-400" : "border-transparent"
                }`}
              >
                <InputField
                  className="text-black"
                  placeholder="0771234567"
                  placeholderTextColor="#9CA3AF"
                  keyboardType="numeric"
                  value={phone}
                  editable={!loading}
                  onChangeText={(text) => {
                    setPhone(text);
                    clearError("phone");
                  }}
                />
              </Input>

              {errors.phone && (
                <Text className="mt-1 text-xs font-medium text-red-500">
                  {errors.phone}
                </Text>
              )}
            </VStack>

            <TouchableOpacity
              activeOpacity={0.7}
              className={`bg-[#4338CA] p-4 rounded-full mt-4 mb-10 ${
                loading ? "opacity-50" : ""
              }`}
              onPress={handleSaveProfile}
              disabled={loading}
            >
              {loading ? (
                <ActivityIndicator color="white" />
              ) : (
                <Text className="text-white text-center font-bold text-lg">
                  Save Profile
                </Text>
              )}
            </TouchableOpacity>
          </VStack>

          <View className="h-20" />
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}