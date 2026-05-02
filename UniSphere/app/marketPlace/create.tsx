import React, { useState } from "react";
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
import { useRouter } from "expo-router";
import * as ImagePicker from "expo-image-picker";
import { ChevronLeft, Camera } from "lucide-react-native";
import { Box } from "@/components/ui/box";
import { VStack } from "@/components/ui/vstack";
import { HStack } from "@/components/ui/hstack";
import { Text } from "@/components/ui/text";
import { Button, ButtonText } from "@/components/ui/button";
import apiClient from "../services/api";

const CONDITIONS = ["New", "Used", "Like New"];

type FormErrors = {
  title?: string;
  price?: string;
  description?: string;
  location?: string;
  contactNumber?: string;
  condition?: string;
  image?: string;
};

export default function CreateListingScreen() {
  const router = useRouter();

  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState<FormErrors>({});

  const [title, setTitle] = useState("");
  const [price, setPrice] = useState("");
  const [description, setDescription] = useState("");
  const [location, setLocation] = useState("");
  const [contactNumber, setContactNumber] = useState("");
  const [condition, setCondition] = useState("Used");
  const [image, setImage] = useState<string | null>(null);

  const clearError = (field: keyof FormErrors) => {
    setErrors((prev) => ({ ...prev, [field]: undefined }));
  };

  const pickImage = async () => {
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [1, 1],
      quality: 0.8,
    });

    if (!result.canceled) {
      setImage(result.assets[0].uri);
      clearError("image");
    }
  };

  const handleSave = async () => {
    setErrors({});

    const localErrors: FormErrors = {};

    if (!title.trim()) localErrors.title = "Title is required.";
    if (!price.trim()) localErrors.price = "Price is required.";
    if (!description.trim())
      localErrors.description = "Description is required.";
    if (!location.trim()) localErrors.location = "Location is required.";
    if (!contactNumber.trim())
      localErrors.contactNumber = "Phone number is required.";

    if (Object.keys(localErrors).length > 0) {
      setErrors(localErrors);
      return;
    }

    setLoading(true);

    try {
      const formData = new FormData();

      formData.append("title", title.trim());
      formData.append("price", price.trim());
      formData.append("description", description.trim());
      formData.append("location", location.trim());
      formData.append("contactNumber", contactNumber.trim());
      formData.append("condition", condition);

      if (image) {
        const filename = image.split("/").pop() || "upload.jpg";
        const match = /\.(\w+)$/.exec(filename);
        const type = match ? `image/${match[1]}` : "image/jpeg";

        formData.append("image", {
          uri: image,
          name: filename,
          type,
        } as any);
      }

      await apiClient.post("/api/marketplace", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      router.replace("/marketplace");
    } catch (error: any) {
      const backendErrors = error.response?.data?.errors;

      if (Array.isArray(backendErrors)) {
        const fieldErrors: FormErrors = {};

        backendErrors.forEach((err: { field: string; message: string }) => {
          if (
            err.field === "title" ||
            err.field === "price" ||
            err.field === "description" ||
            err.field === "location" ||
            err.field === "contactNumber" ||
            err.field === "condition" ||
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
        error.response?.data?.message || "Could not save listing."
      );
    } finally {
      setLoading(false);
    }
  };

  const inputBase =
    "bg-gray-50 p-5 rounded-2xl text-lg text-gray-900 font-bold border";

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      style={{ flex: 1, backgroundColor: "white" }}
    >
      <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
        <Box className="flex-1 pt-12">
          <HStack className="px-6 py-4 items-center">
            <TouchableOpacity onPress={() => router.back()}>
              <ChevronLeft size={28} color="#1f2937" />
            </TouchableOpacity>

            <Text className="ml-4 text-xl font-bold text-gray-900">
              New Listing
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
                  className={`h-64 bg-gray-100 rounded-[40px] border-2 border-dashed items-center justify-center overflow-hidden ${
                    errors.image ? "border-red-400" : "border-gray-200"
                  }`}
                >
                  {image ? (
                    <Image source={{ uri: image }} className="w-full h-full" />
                  ) : (
                    <VStack className="items-center">
                      <Camera size={40} color="#9CA3AF" />
                      <Text className="text-gray-400 mt-2">Add Photo</Text>
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
                  placeholder="Title"
                  placeholderTextColor="#9CA3AF"
                  value={title}
                  onChangeText={(text) => {
                    setTitle(text);
                    clearError("title");
                  }}
                  className={`${inputBase} ${
                    errors.title ? "border-red-400" : "border-gray-100"
                  }`}
                />

                {errors.title && (
                  <Text className="mt-1 text-xs font-medium text-red-500">
                    {errors.title}
                  </Text>
                )}
              </VStack>

              <VStack>
                <TextInput
                  placeholder="Price ($)"
                  placeholderTextColor="#9CA3AF"
                  value={price}
                  onChangeText={(text) => {
                    setPrice(text);
                    clearError("price");
                  }}
                  keyboardType="numeric"
                  className={`${inputBase} ${
                    errors.price ? "border-red-400" : "border-gray-100"
                  }`}
                />

                {errors.price && (
                  <Text className="mt-1 text-xs font-medium text-red-500">
                    {errors.price}
                  </Text>
                )}
              </VStack>

              <VStack space="xs">
                <Text className="text-[11px] font-black text-gray-400 uppercase ml-2">
                  Condition
                </Text>

                <HStack space="sm">
                  {CONDITIONS.map((c) => (
                    <TouchableOpacity
                      key={c}
                      onPress={() => {
                        setCondition(c);
                        clearError("condition");
                      }}
                      className={`px-5 py-3 rounded-full border ${
                        condition === c
                          ? "bg-indigo-600 border-indigo-600"
                          : "bg-white border-gray-200"
                      }`}
                    >
                      <Text
                        className={`font-bold ${
                          condition === c ? "text-white" : "text-gray-500"
                        }`}
                      >
                        {c}
                      </Text>
                    </TouchableOpacity>
                  ))}
                </HStack>

                {errors.condition && (
                  <Text className="mt-1 text-xs font-medium text-red-500">
                    {errors.condition}
                  </Text>
                )}
              </VStack>

              <VStack>
                <TextInput
                  placeholder="Phone Number"
                  placeholderTextColor="#9CA3AF"
                  value={contactNumber}
                  onChangeText={(text) => {
                    setContactNumber(text);
                    clearError("contactNumber");
                  }}
                  keyboardType="phone-pad"
                  className={`${inputBase} ${
                    errors.contactNumber
                      ? "border-red-400"
                      : "border-gray-100"
                  }`}
                />

                {errors.contactNumber && (
                  <Text className="mt-1 text-xs font-medium text-red-500">
                    {errors.contactNumber}
                  </Text>
                )}
              </VStack>

              <VStack>
                <TextInput
                  placeholder="Location"
                  placeholderTextColor="#9CA3AF"
                  value={location}
                  onChangeText={(text) => {
                    setLocation(text);
                    clearError("location");
                  }}
                  className={`${inputBase} ${
                    errors.location ? "border-red-400" : "border-gray-100"
                  }`}
                />

                {errors.location && (
                  <Text className="mt-1 text-xs font-medium text-red-500">
                    {errors.location}
                  </Text>
                )}
              </VStack>

              <VStack>
                <TextInput
                  placeholder="Description"
                  placeholderTextColor="#9CA3AF"
                  value={description}
                  onChangeText={(text) => {
                    setDescription(text);
                    clearError("description");
                  }}
                  multiline
                  numberOfLines={5}
                  textAlignVertical="top"
                  className={`bg-gray-50 p-5 rounded-3xl text-base text-gray-900 h-40 border ${
                    errors.description ? "border-red-400" : "border-gray-100"
                  }`}
                />

                {errors.description && (
                  <Text className="mt-1 text-xs font-medium text-red-500">
                    {errors.description}
                  </Text>
                )}
              </VStack>
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
                  List Now
                </ButtonText>
              )}
            </Button>
          </Box>
        </Box>
      </TouchableWithoutFeedback>
    </KeyboardAvoidingView>
  );
}