import React from "react";
import {
  Image,
  ScrollView,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { router, useLocalSearchParams } from "expo-router";
import { SafeAreaView } from "react-native-safe-area-context";
import { useLostForm } from "./hooks/useCreateLostForm";
import { useTheme } from "@/context/ThemeContext";

const categories = [
  "Electronics",
  "Clothing",
  "Accessories",
  "Documents",
  "Other",
];

export default function CreateLostReportScreen() {
  const { itemId } = useLocalSearchParams<{ itemId?: string }>();
  const { colors } = useTheme();

  const {
    form,
    errors,
    updateField,
    pickImage,
    submitForm,
    isSubmitting,
    isEditMode,
    isLoadingItem,
  } = useLostForm({ itemId });

  if (isLoadingItem) {
    return (
      <SafeAreaView
        edges={["top"]}
        style={{ backgroundColor: colors.bg }}
        className="flex-1 items-center justify-center"
      >
        <Text style={{ color: colors.textSecondary }}>Loading item...</Text>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView edges={["top"]} style={{ backgroundColor: colors.bg }} className="flex-1">
      <View style={{ backgroundColor: colors.bg }} className="flex-1 px-4 pt-2">
        <ScrollView
          showsVerticalScrollIndicator={false}
          contentContainerStyle={{ paddingBottom: 28 }}
        >
          <View className="mb-6 flex-row items-start justify-between">
            <View>
              <Text style={{ color: colors.primary }} className="mb-1 text-[10px] font-extrabold uppercase tracking-[2px]">
                {isEditMode ? "Edit Report" : "Report Submission"}
              </Text>
              <Text style={{ color: colors.text }} className="text-4xl font-extrabold">
                Lost &amp; Found
              </Text>
            </View>

            <TouchableOpacity onPress={() => router.back()} className="p-2">
              <Text style={{ color: colors.textSecondary }} className="text-2xl">×</Text>
            </TouchableOpacity>
          </View>

          <View className="mb-5">
            <Text style={{ color: colors.text }} className="mb-2 text-sm font-semibold">
              Report Classification
            </Text>

            <View style={{ backgroundColor: colors.bgInput }} className="flex-row rounded-full p-1">
              <TouchableOpacity
                onPress={() => updateField("reportType", "LOST")}
                style={{
                  backgroundColor: form.reportType === "LOST" ? colors.white : "transparent",
                }}
                className="flex-1 rounded-full px-4 py-3"
              >
                <Text
                  style={{
                    color: form.reportType === "LOST" ? colors.primary : colors.textSecondary,
                  }}
                  className="text-center text-sm font-bold"
                >
                  I Lost Something
                </Text>
              </TouchableOpacity>

              <TouchableOpacity
                onPress={() => updateField("reportType", "FOUND")}
                style={{
                  backgroundColor: form.reportType === "FOUND" ? colors.white : "transparent",
                }}
                className="flex-1 rounded-full px-4 py-3"
              >
                <Text
                  style={{
                    color: form.reportType === "FOUND" ? colors.primary : colors.textSecondary,
                  }}
                  className="text-center text-sm font-bold"
                >
                  I Found Something
                </Text>
              </TouchableOpacity>
            </View>
          </View>

          <View className="mb-5">
            <Text style={{ color: colors.text }} className="mb-2 text-sm font-semibold">
              Category
            </Text>

            <ScrollView horizontal showsHorizontalScrollIndicator={false}>
              <View className="flex-row gap-2">
                {categories.map((category) => (
                  <TouchableOpacity
                    key={category}
                    onPress={() => updateField("category", category)}
                    style={{
                      backgroundColor: form.category === category ? colors.primary : colors.bgInput,
                    }}
                    className="rounded-full px-4 py-2"
                  >
                    <Text
                      style={{
                        color: form.category === category ? "white" : colors.textSecondary,
                      }}
                      className="text-sm font-bold"
                    >
                      {category}
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>
            </ScrollView>

            {errors.category && (
              <Text className="mt-1 text-xs font-medium text-red-500">
                {errors.category}
              </Text>
            )}
          </View>

          <View className="mb-5">
            <Text style={{ color: colors.text }} className="mb-2 text-sm font-semibold">
              Item Title
            </Text>

            <TextInput
              value={form.title}
              onChangeText={(text) => updateField("title", text)}
              placeholder="e.g. Mac book"
              placeholderTextColor={colors.textMuted}
              style={{
                backgroundColor: colors.bgInput,
                color: colors.text,
                borderColor: errors.title ? "#EF4444" : "transparent",
                borderWidth: errors.title ? 1 : 0,
              }}
              className="rounded-2xl px-4 py-4 text-sm font-semibold"
            />

            {errors.title && (
              <Text className="mt-1 text-xs font-medium text-red-500">
                {errors.title}
              </Text>
            )}
          </View>

          <View className="mb-5">
            <Text style={{ color: colors.text }} className="mb-2 text-sm font-semibold">
              Last Seen / Found Location
            </Text>

            <TextInput
              value={form.location}
              onChangeText={(text) => updateField("location", text)}
              placeholder="e.g. Library Second Floor"
              placeholderTextColor={colors.textMuted}
              style={{
                backgroundColor: colors.bgInput,
                color: colors.text,
                borderColor: errors.location ? "#EF4444" : "transparent",
                borderWidth: errors.location ? 1 : 0,
              }}
              className="rounded-2xl px-4 py-4 text-sm font-semibold"
            />

            {errors.location && (
              <Text className="mt-1 text-xs font-medium text-red-500">
                {errors.location}
              </Text>
            )}
          </View>

          <View className="mb-5">
            <Text style={{ color: colors.text }} className="mb-2 text-sm font-semibold">
              Distinguishing Features
            </Text>

            <TextInput
              value={form.features}
              onChangeText={(text) => updateField("features", text)}
              placeholder="Contains a student ID and a $20 bill."
              placeholderTextColor={colors.textMuted}
              multiline
              textAlignVertical="top"
              style={{
                backgroundColor: colors.bgInput,
                color: colors.text,
                borderColor: errors.features ? "#EF4444" : "transparent",
                borderWidth: errors.features ? 1 : 0,
              }}
              className="min-h-[120px] rounded-2xl px-4 py-4 text-sm font-semibold"
            />

            {errors.features && (
              <Text className="mt-1 text-xs font-medium text-red-500">
                {errors.features}
              </Text>
            )}
          </View>

          <View className="mb-8">
            <Text style={{ color: colors.text }} className="mb-2 text-sm font-semibold">
              Photo Reference
            </Text>

            <TouchableOpacity
              activeOpacity={0.85}
              onPress={pickImage}
              style={{
                backgroundColor: colors.bgCard,
                borderColor: errors.image ? "#EF4444" : colors.border,
              }}
              className="overflow-hidden rounded-3xl border border-dashed"
            >
              {form.image ? (
                <View className="items-center justify-center p-3">
                  <Image
                    source={{ uri: form.image}}
                    className="h-52 w-full rounded-2xl"
                    resizeMode="cover"
                  />
                  <Text style={{ color: colors.primary }} className="mt-3 text-sm font-medium">
                    Tap to change image
                  </Text>
                </View>
              ) : (
                <View className="h-36 items-center justify-center">
                  <Text className="text-2xl">📷</Text>
                  <Text style={{ color: colors.textSecondary }} className="mt-2 text-sm">
                    Upload or Select Image
                  </Text>
                </View>
              )}
            </TouchableOpacity>

            {errors.image && (
              <Text className="mt-2 text-xs font-medium text-red-500">
                {errors.image}
              </Text>
            )}
          </View>

          <TouchableOpacity
            onPress={submitForm}
            disabled={isSubmitting}
            activeOpacity={0.9}
            style={{
              backgroundColor: isSubmitting ? colors.primaryLight : colors.primary,
            }}
            className="mb-5 rounded-full px-6 py-4"
          >
            <Text
              style={{
                color: isSubmitting ? colors.primary : "white",
              }}
              className="text-center text-base font-extrabold"
            >
              {isSubmitting
                ? isEditMode
                  ? "Updating..."
                  : "Submitting..."
                : isEditMode
                ? "Update Report ➜"
                : "Post Report ➜"}
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            onPress={() => router.back()}
            disabled={isSubmitting}
          >
            <Text style={{ color: colors.textMuted }} className="text-center text-sm font-medium">
              Cancel and discard draft
            </Text>
          </TouchableOpacity>
        </ScrollView>
      </View>
    </SafeAreaView>
  );
}