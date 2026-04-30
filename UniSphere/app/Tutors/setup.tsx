import axios from "axios";
import { useRouter } from "expo-router";
import { CircleX, User, X, Camera } from "lucide-react-native"; // Check if you prefer lucide-react-native
import React, { useState } from "react";
import { Alert, KeyboardAvoidingView, Platform, ScrollView, TouchableOpacity, View, ActivityIndicator } from "react-native";
import * as ImagePicker from 'expo-image-picker';

// UI Components
import { Avatar, AvatarImage } from "@/components/ui/avatar";
import { HStack } from "@/components/ui/hstack";
import { Icon } from "@/components/ui/icon";
import { Input, InputField, InputSlot } from "@/components/ui/input";
import { Text } from "@/components/ui/text";
import { VStack } from "@/components/ui/vstack";
import apiClient from "../services/api";

export default function ProfileSetup() {
  const router = useRouter();

  // --- STATE MANAGEMENT ---
  const [fullName, setFullName] = useState("");
  const [hourlyRate, setHourlyRate] = useState("");
  const [subjects, setSubjects] = useState("");
  const [bio, setBio] = useState("");
  const [phone, setPhone] = useState("");
  const [image, setImage] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  // --- IMAGE PICKER FUNCTION ---
  const pickImage = async () => {
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (status !== 'granted') {
      Alert.alert("Permission Denied", "We need access to your photos to upload a profile picture.");
      return;
    }

    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [1, 1],
      quality: 0.7,
    });

    if (!result.canceled) {
      setImage(result.assets[0].uri);
    }
  };

  // --- SAVE FUNCTION ---
const handleSaveProfile = async () => {
  // Added !image to the validation check
  if (!fullName || !hourlyRate || !subjects || !image) {
    Alert.alert(
      "Missing Information", 
      "Please upload a profile picture and fill in all required fields."
    );
    return;
  }

    setLoading(true);

    const formData = new FormData();
    formData.append("name", fullName);
    formData.append("subject", subjects);
    formData.append("price", `Rs.${hourlyRate}`);
    formData.append("bio", bio);
    formData.append("phone", phone);
    formData.append("isOnline", "true");

    if (image) {
      const filename = image.split('/').pop() || "profile.jpg";
      const match = /\.(\w+)$/.exec(filename);
      const type = match ? `image/${match[1]}` : `image/jpeg`;

      // @ts-ignore - FormData needs this specific object structure for files
      formData.append("image", {
        uri: image,
        name: filename,
        type,
      });
    }

    try {
      const response = await apiClient.post(`/tutors/setup`, formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });
      
      if (response.status === 201 || response.status === 200) {
        Alert.alert("Success", "Tutor profile created successfully!");
        
        // Use replace to ensure the Tutors list refreshes its data
        router.replace('/tutors'); 
      }
    } catch (error: any) {
      console.error("Save Profile Error:", error.response?.data || error.message);
      const errorMsg = error.response?.data?.message || "Failed to save profile.";
      Alert.alert("Error", errorMsg);
    } finally {
      setLoading(false);
    }
  };

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
            <Text className="text-3xl font-bold text-black">Profile Setup</Text>
            <TouchableOpacity onPress={() => router.back()}>
              <Icon as={X} size="xl" className="text-gray-400" />
            </TouchableOpacity>
          </HStack>
          
          <Text className="text-gray-500 mb-6">Tell us about your academic expertise.</Text>

          {/* Avatar Section */}
          <View className="items-center mb-8">
            <TouchableOpacity onPress={pickImage} activeOpacity={0.7}>
              <Avatar className="bg-indigo-600 w-24 h-24 relative">
                {image ? (
                  <AvatarImage source={{ uri: image }} className="w-full h-full rounded-full" />
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
          </View>

          <VStack space="xl">
            {/* Full Name */}
            <VStack space="xs">
              <Text className="text-xs font-bold uppercase tracking-wider text-black">Full Name</Text>
              <Input variant="rounded" className="bg-gray-100 border-0 h-14 px-2">
                <InputField 
                  className="text-black"
                  placeholder="Dr. Julian Sterling" 
                  value={fullName}
                  onChangeText={setFullName}
                />
              </Input>
            </VStack>

            {/* Hourly Rate */}
            <VStack space="xs">
              <Text className="text-xs font-bold uppercase tracking-wider text-black">Hourly Rate (LKR)</Text>
              <Input variant="rounded" className="bg-gray-100 border-0 h-14 px-2">
                <InputSlot className="pl-3">
                  <Text className="text-gray-400 mr-1">Rs.</Text>
                </InputSlot>
                <InputField 
                  className="text-black"
                  placeholder="1000" 
                  keyboardType="numeric" 
                  value={hourlyRate}
                  onChangeText={setHourlyRate}
                />
              </Input>
            </VStack>

            {/* Subjects */}
            <VStack space="xs">
              <Text className="text-xs font-bold uppercase tracking-wider text-black">Subjects</Text>
              <Input variant="rounded" className="bg-gray-100 border-0 h-14 px-2">
                <InputField 
                  className="text-black"
                  placeholder="Physics, Calculus"
                  value={subjects}        
                  onChangeText={setSubjects}
                />
              </Input>
            </VStack>

            {/* Bio */}
            <VStack space="xs">
              <Text className="text-xs font-bold uppercase tracking-wider text-black">Bio & Experience</Text>
              <Input variant="rounded" className="bg-gray-100 border-0 h-14 px-2">
                <InputField
                  className="text-black"
                  placeholder="Share your background..." 
                  value={bio}
                  onChangeText={setBio}
                />
              </Input>
            </VStack>

            {/* Contact Number */}
            <VStack space="xs">
              <Text className="text-xs font-bold uppercase tracking-wider text-black">Contact Number</Text>
              <Input variant="rounded" className="bg-gray-100 border-0 h-14 px-2">
                <InputField 
                  className="text-black"
                  placeholder="0771234567" 
                  keyboardType="numeric" 
                  value={phone}
                  onChangeText={setPhone}
                />
              </Input>
            </VStack>

            {/* Save Button */}
            <TouchableOpacity 
              className={`bg-[#4338CA] p-4 rounded-full mt-4 mb-10 ${loading ? 'opacity-50' : ''}`}
              onPress={handleSaveProfile}
              disabled={loading}
            >
                {loading ? (
                  <ActivityIndicator color="white" />
                ) : (
                  <Text className="text-white text-center font-bold text-lg">Save Profile</Text>
                )}
            </TouchableOpacity>
          </VStack>
          <View className="h-20" />
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}