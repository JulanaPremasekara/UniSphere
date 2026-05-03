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

const categories = [
  "Electronics",
  "Clothing",
  "Accessories",
  "Documents",
  "Other",
];

export default function CreateLostReportScreen() {
  const { itemId } = useLocalSearchParams<{ itemId?: string }>();

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
        className="flex-1 items-center justify-center bg-white"
      >
        <Text className="text-slate-500">Loading item...</Text>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView edges={["top"]} className="flex-1 bg-white">
      <View className="flex-1 px-4 pt-2">
        <ScrollView
          showsVerticalScrollIndicator={false}
          contentContainerStyle={{ paddingBottom: 28 }}
        >
          <View className="mb-6 flex-row items-start justify-between">
            <View>
              <Text className="mb-1 text-[10px] font-extrabold uppercase tracking-[2px] text-indigo-300">
                {isEditMode ? "Edit Report" : "Report Submission"}
              </Text>
              <Text className="text-4xl font-extrabold text-slate-900">
                Lost &amp; Found
              </Text>
            </View>

            <TouchableOpacity onPress={() => router.back()} className="p-2">
              <Text className="text-xl text-slate-400">×</Text>
            </TouchableOpacity>
          </View>

          <View className="mb-5">
            <Text className="mb-2 text-sm font-semibold text-slate-600">
              Report Classification
            </Text>

            <View className="flex-row rounded-full bg-slate-100 p-1">
              <TouchableOpacity
                onPress={() => updateField("reportType", "LOST")}
                className={`flex-1 rounded-full px-4 py-3 ${
                  form.reportType === "LOST" ? "bg-white" : ""
                }`}
              >
                <Text
                  className={`text-center text-sm font-bold ${
                    form.reportType === "LOST"
                      ? "text-indigo-600"
                      : "text-slate-500"
                  }`}
                >
                  I Lost Something
                </Text>
              </TouchableOpacity>

              <TouchableOpacity
                onPress={() => updateField("reportType", "FOUND")}
                className={`flex-1 rounded-full px-4 py-3 ${
                  form.reportType === "FOUND" ? "bg-white" : ""
                }`}
              >
                <Text
                  className={`text-center text-sm font-bold ${
                    form.reportType === "FOUND"
                      ? "text-indigo-600"
                      : "text-slate-500"
                  }`}
                >
                  I Found Something
                </Text>
              </TouchableOpacity>
            </View>
          </View>

          <View className="mb-5">
            <Text className="mb-2 text-sm font-semibold text-slate-600">
              Category
            </Text>

            <ScrollView horizontal showsHorizontalScrollIndicator={false}>
              <View className="flex-row gap-2">
                {categories.map((category) => (
                  <TouchableOpacity
                    key={category}
                    onPress={() => updateField("category", category)}
                    className={`rounded-full px-4 py-2 ${
                      form.category === category
                        ? "bg-indigo-600"
                        : "bg-slate-100"
                    }`}
                  >
                    <Text
                      className={`text-sm font-bold ${
                        form.category === category
                          ? "text-white"
                          : "text-slate-500"
                      }`}
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
            <Text className="mb-2 text-sm font-semibold text-slate-600">
              Item Title
            </Text>

            <TextInput
              value={form.title}
              onChangeText={(text) => updateField("title", text)}
              placeholder="e.g. Mac book"
              placeholderTextColor="#CBD5E1"
              className={`rounded-2xl bg-slate-100 px-4 py-4 text-sm text-slate-900 ${
                errors.title ? "border border-red-400" : ""
              }`}
            />

            {errors.title && (
              <Text className="mt-1 text-xs font-medium text-red-500">
                {errors.title}
              </Text>
            )}
          </View>

          <View className="mb-5">
            <Text className="mb-2 text-sm font-semibold text-slate-600">
              Last Seen / Found Location
            </Text>

            <TextInput
              value={form.location}
              onChangeText={(text) => updateField("location", text)}
              placeholder="e.g. Library Second Floor"
              placeholderTextColor="#CBD5E1"
              className={`rounded-2xl bg-slate-100 px-4 py-4 text-sm text-slate-900 ${
                errors.location ? "border border-red-400" : ""
              }`}
            />

            {errors.location && (
              <Text className="mt-1 text-xs font-medium text-red-500">
                {errors.location}
              </Text>
            )}
          </View>

          <View className="mb-5">
            <Text className="mb-2 text-sm font-semibold text-slate-600">
              Distinguishing Features
            </Text>

            <TextInput
              value={form.features}
              onChangeText={(text) => updateField("features", text)}
              placeholder="Contains a student ID and a $20 bill."
              placeholderTextColor="#CBD5E1"
              multiline
              textAlignVertical="top"
              className={`min-h-[120px] rounded-2xl bg-slate-100 px-4 py-4 text-sm text-slate-900 ${
                errors.features ? "border border-red-400" : ""
              }`}
            />

            {errors.features && (
              <Text className="mt-1 text-xs font-medium text-red-500">
                {errors.features}
              </Text>
            )}
          </View>

          <View className="mb-8">
            <Text className="mb-2 text-sm font-semibold text-slate-600">
              Photo Reference
            </Text>

            <TouchableOpacity
              activeOpacity={0.85}
              onPress={pickImage}
              className={`overflow-hidden rounded-3xl border border-dashed bg-slate-50 ${
                errors.image ? "border-red-400" : "border-slate-300"
              }`}
            >
              {form.image ? (
                <View className="items-center justify-center p-3">
                  <Image
                    source={{ uri: form.image}}
                    className="h-52 w-full rounded-2xl"
                    resizeMode="cover"
                  />
                  <Text className="mt-3 text-sm font-medium text-indigo-600">
                    Tap to change image
                  </Text>
                </View>
              ) : (
                <View className="h-36 items-center justify-center">
                  <Text className="text-2xl">📷</Text>
                  <Text className="mt-2 text-sm text-slate-500">
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
            className={`mb-5 rounded-full px-6 py-4 ${
              isSubmitting ? "bg-indigo-300" : "bg-indigo-600"
            }`}
          >
            <Text className="text-center text-base font-extrabold text-white">
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
            <Text className="text-center text-sm font-medium text-slate-400">
              Cancel and discard draft
            </Text>
          </TouchableOpacity>
        </ScrollView>
      </View>
    </SafeAreaView>
  );
}