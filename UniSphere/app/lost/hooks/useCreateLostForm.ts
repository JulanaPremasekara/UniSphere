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
  image: string | null;
};

type FormErrors = Partial<Record<keyof LostFormState, string>>;

const initialFormState: LostFormState = {
  reportType: "LOST",
  title: "",
  category: "Electronics",
  location: "",
  features: "",
  image: null,
};

type UseLostFormParams = {
  itemId?: string | string[];
};

export const useLostForm = ({ itemId }: UseLostFormParams = {}) => {
  const normalizedItemId = Array.isArray(itemId)
    ? itemId[0]
    : typeof itemId === "string" && itemId.trim() !== ""
    ? itemId.trim()
    : undefined;

  const isEditMode = Boolean(normalizedItemId);

  const [form, setForm] = useState<LostFormState>(initialFormState);
  const [errors, setErrors] = useState<FormErrors>({});

  const { data: existingItem, isLoading: isLoadingItem } =
    useLostItemDetailQuery(normalizedItemId || "");

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
      image: existingItem.image || null,
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

    setErrors((prev) => ({
      ...prev,
      [field]: undefined,
    }));
  };

  const resetForm = () => {
    setForm(initialFormState);
    setErrors({});
  };

  const pickImage = async () => {
    const permission = await ImagePicker.requestMediaLibraryPermissionsAsync();

    if (!permission.granted) {
      Alert.alert("Permission required", "Please allow photo library access.");
      return;
    }

    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      quality: 0.8,
    });

    if (!result.canceled && result.assets.length > 0) {
      updateField("image", result.assets[0].uri);
    }
  };

  const buildFormData = () => {
    const formData = new FormData();

    formData.append("title", form.title.trim());
    formData.append("location", form.location.trim());
    formData.append("features", form.features.trim());
    formData.append("category", form.category);
    formData.append("status", form.reportType.toLowerCase());

    if (form.image && !form.image.startsWith("http")) {
      const filename =
        form.image.split("/").pop() || `lost-item-${Date.now()}.jpg`;

      let ext = filename.split(".").pop()?.toLowerCase() || "jpg";

      if (ext === "jpg") {
        ext = "jpeg";
      }

      const type = `image/${ext}`;

      formData.append("image", {
        uri: form.image,
        name: filename,
        type,
      } as any);
    }

    return formData;
  };

  const submitForm = async () => {
    setErrors({});

    if (!form.title.trim() || !form.location.trim() || !form.features.trim()) {
      const localErrors: FormErrors = {};

      if (!form.title.trim()) localErrors.title = "Title is required.";
      if (!form.location.trim()) localErrors.location = "Location is required.";
      if (!form.features.trim()) localErrors.features = "Features are required.";

      setErrors(localErrors);
      return;
    }

    try {
      const formData = buildFormData();

      if (isEditMode && normalizedItemId) {
        await updateMutation.mutateAsync({
          itemId: normalizedItemId,
          itemData: formData,
        });

        Alert.alert("Success", "Report updated successfully.");
      } else {
        await createMutation.mutateAsync(formData);

        Alert.alert("Success", "Report submitted successfully.");
      }

      router.back();
      resetForm();
    } catch (error: any) {
  console.log("SUBMIT ERROR:", error);
  console.log("ERROR RESPONSE:", error.response?.data);

  const backendErrors = error.response?.data?.errors;

  if (Array.isArray(backendErrors)) {
    const fieldErrors: FormErrors = {};

    backendErrors.forEach((err: { field: string; message: string }) => {
      if (
        err.field === "title" ||
        err.field === "category" ||
        err.field === "location" ||
        err.field === "features" ||
        err.field === "image" ||
        err.field === "reportType"
      ) {
        fieldErrors[err.field as keyof LostFormState] = err.message;
      }
    });

    setErrors(fieldErrors);
    return;
  }

  const status = error.response?.status;
  const backendMessage = error.response?.data?.message;
  const axiosMessage = error.message;

  let reason = backendMessage || axiosMessage || "Unknown error";

  if (status) {
    reason = `Status ${status}: ${reason}`;
  }

  Alert.alert(
    "Error",
    isEditMode
      ? `Failed to update report.\n\nReason: ${reason}`
      : `Failed to submit report.\n\nReason: ${reason}`
  );
}
  }

  return {
    form,
    errors,
    updateField,
    pickImage,
    submitForm,
    resetForm,
    isSubmitting,
    isEditMode,
    isLoadingItem,
  };
};