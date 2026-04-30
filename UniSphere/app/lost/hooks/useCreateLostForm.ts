import { Alert } from "react-native";
import { router } from "expo-router";
import { useEffect, useState } from "react";
import * as ImagePicker from "expo-image-picker";

import {
  useCreateLostItemMutation,
  useLostItemDetailQuery,
  useUpdateLostItemMutation,
} from "./useLostItems";

export type ReportType = "LOST" | "FOUND";

type LostFormState = {
  reportType: ReportType;
  title: string;
  category: string;
  location: string;
  features: string;
  image: ImagePicker.ImagePickerAsset | null;
};

const initialFormState: LostFormState = {
  reportType: "LOST",
  title: "",
  category: "Electronics",
  location: "",
  features: "",
  image: null,
};

type UseLostFormParams = {
  itemId?: string;
};

export const useLostForm = ({ itemId }: UseLostFormParams = {}) => {
  const isEditMode = !!itemId;

  const [form, setForm] = useState<LostFormState>(initialFormState);

  const { data: existingItem, isLoading: isLoadingItem } =
    useLostItemDetailQuery(itemId || "");

  const createMutation = useCreateLostItemMutation();
  const updateMutation = useUpdateLostItemMutation();

  const isSubmitting = createMutation.isPending || updateMutation.isPending;

  useEffect(() => {
    if (!isEditMode || !existingItem) return;

    setForm({
      reportType:
        existingItem.status?.toUpperCase() === "FOUND" ? "FOUND" : "LOST",
      title: existingItem.title || "",
      category: existingItem.category || "Electronics",
      location: existingItem.location || "",
      features: existingItem.features || "",
      image: existingItem.image
        ? ({
            uri: existingItem.image,
            fileName: "existing-image.jpg",
            mimeType: "image/jpeg",
          } as ImagePicker.ImagePickerAsset)
        : null,
    });
  }, [isEditMode, existingItem]);

  const updateField = <K extends keyof LostFormState>(
    field: K,
    value: LostFormState[K]
  ) => {
    setForm((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const resetForm = () => {
    setForm(initialFormState);
  };

  const pickImage = async () => {
    const permission = await ImagePicker.requestMediaLibraryPermissionsAsync();

    if (!permission.granted) {
      Alert.alert("Permission required", "Please allow photo library access.");
      return;
    }

    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ["images"],
      allowsEditing: true,
      quality: 0.8,
    });

    if (!result.canceled && result.assets.length > 0) {
      updateField("image", result.assets[0]);
    }
  };

  const buildFormData = () => {
    const formData = new FormData();

    formData.append("title", form.title.trim());
    formData.append("location", form.location.trim());
    formData.append("features", form.features.trim());
    formData.append("category", form.category);
    formData.append("status", form.reportType.toLowerCase());

    // Only send image if user picked a NEW local image.
    // Existing image URL starts with http, so we don't re-upload it.
    if (form.image?.uri && !form.image.uri.startsWith("http")) {
      formData.append("image", {
        uri: form.image.uri,
        name: form.image.fileName || `lost-item-${Date.now()}.jpg`,
        type: form.image.mimeType || "image/jpeg",
      } as any);
    }

    return formData;
  };

  const submitForm = async () => {
    if (!form.title.trim() || !form.location.trim() || !form.features.trim()) {
      Alert.alert("Missing details", "Please fill in all required fields.");
      return;
    }

    try {
      const formData = buildFormData();

      if (isEditMode && itemId) {
        await updateMutation.mutateAsync({
          itemId,
          itemData: formData,
        });

        Alert.alert("Success", "Report updated successfully.");
      } else {
        await createMutation.mutateAsync(formData);

        Alert.alert("Success", "Report submitted successfully.");
      }

      router.back();
      resetForm();
    } catch (error) {
      console.error("Submit failed:", error);

      Alert.alert(
        "Error",
        isEditMode ? "Failed to update report." : "Failed to submit report."
      );
    }
  };

  return {
    form,
    updateField,
    pickImage,
    submitForm,
    resetForm,
    isSubmitting,
    isEditMode,
    isLoadingItem,
  };
};