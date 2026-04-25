import { Alert } from "react-native";
import { router } from "expo-router";
import { useState } from "react";
import * as ImagePicker from "expo-image-picker";

export type ReportType = "LOST" | "FOUND";

type LostFormState = {
  reportType: ReportType;
  title: string;
  location: string;
  features: string;
  image: ImagePicker.ImagePickerAsset | null;
};

const initialFormState: LostFormState = {
  reportType: "LOST",
  title: "",
  location: "",
  features: "",
  image: null,
};

export const useCreateLostForm = () => {
  const [form, setForm] = useState<LostFormState>(initialFormState);
  const [isSubmitting, setIsSubmitting] = useState(false);

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
    const permission =
      await ImagePicker.requestMediaLibraryPermissionsAsync();

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

    formData.append("type", form.reportType.toLowerCase());
    formData.append("title", form.title.trim());
    formData.append("location", form.location.trim());
    formData.append("features", form.features.trim());

    if (form.image) {
      formData.append(
        "image",
        {
          uri: form.image.uri,
          name: form.image.fileName || `lost-item-${Date.now()}.jpg`,
          type: form.image.mimeType || "image/jpeg",
        } as any
      );
    }

    return formData;
  };

  const submitForm = async () => {
    if (!form.title.trim() || !form.location.trim()) {
      Alert.alert("Missing details", "Please fill in the title and location.");
      return;
    }

    try {
      setIsSubmitting(true);

      const formData = buildFormData();

      console.log("Submitting form:", {
        reportType: form.reportType,
        title: form.title,
        location: form.location,
        features: form.features,
        image: form.image?.uri ?? null,
      });

      // Example:
      // await createLostItem(formData);

      Alert.alert("Success", "Report submitted successfully.");
      resetForm();
      router.back();
    } catch (error) {
      console.error("Submit failed:", error);
      Alert.alert("Error", "Failed to submit report.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return {
    form,
    updateField,
    pickImage,
    submitForm,
    resetForm,
    isSubmitting,
  };
};