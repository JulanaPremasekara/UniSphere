import React from "react";
import {
  Image,
  SafeAreaView,
  ScrollView,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { router } from "expo-router";

import { useCreateLostForm } from "./hooks/useCreateLostForm";

export default function CreateLostReportScreen() {
  const { form, updateField, pickImage, submitForm, isSubmitting } =
    useCreateLostForm();

  return (
    <SafeAreaView className="flex-1 bg-[#0B1020]">
      <View className="flex-1 px-4 pt-4">
        <View className="mb-3 flex-row items-center justify-between px-1">
          <Text className="text-lg font-semibold text-white">Reporting Form</Text>
        </View>

        <View className="flex-1 rounded-[32px] bg-white px-5 pt-6">
          <ScrollView
            showsVerticalScrollIndicator={false}
            contentContainerStyle={{ paddingBottom: 28 }}
          >
            <View className="mb-6 flex-row items-start justify-between">
              <View>
                <Text className="mb-1 text-[10px] font-extrabold uppercase tracking-[2px] text-indigo-300">
                  Report Submission
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
                  activeOpacity={0.9}
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
                  activeOpacity={0.9}
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
                Item Title
              </Text>
              <TextInput
                value={form.title}
                onChangeText={(text) => updateField("title", text)}
                placeholder="e.g. Silver Macbook Pro, Blue Wallet..."
                placeholderTextColor="#CBD5E1"
                className="rounded-2xl bg-slate-100 px-4 py-4 text-sm text-slate-900"
              />
            </View>

            <View className="mb-5">
              <Text className="mb-2 text-sm font-semibold text-slate-600">
                Last Seen / Found Location
              </Text>
              <TextInput
                value={form.location}
                onChangeText={(text) => updateField("location", text)}
                placeholder="e.g. Library 3rd Floor, West Hall..."
                placeholderTextColor="#CBD5E1"
                className="rounded-2xl bg-slate-100 px-4 py-4 text-sm text-slate-900"
              />
            </View>

            <View className="mb-5">
              <Text className="mb-2 text-sm font-semibold text-slate-600">
                Distinguishing Features
              </Text>
              <TextInput
                value={form.features}
                onChangeText={(text) => updateField("features", text)}
                placeholder="Include details like stickers, scratches, case color, or unique identifying marks..."
                placeholderTextColor="#CBD5E1"
                multiline
                textAlignVertical="top"
                className="min-h-[120px] rounded-2xl bg-slate-100 px-4 py-4 text-sm text-slate-900"
              />
            </View>

            <View className="mb-8">
              <Text className="mb-2 text-sm font-semibold text-slate-600">
                Photo Reference
              </Text>

              <TouchableOpacity
                activeOpacity={0.85}
                onPress={pickImage}
                className="overflow-hidden rounded-3xl border border-dashed border-slate-300 bg-slate-50"
              >
                {form.image ? (
                  <View className="items-center justify-center p-3">
                    <Image
                      source={{ uri: form.image.uri }}
                      className="h-52 w-full rounded-2xl"
                      resizeMode="cover"
                    />
                    <Text className="mt-3 text-sm font-medium text-indigo-600">
                      Tap to change image
                    </Text>
                  </View>
                ) : (
                  <View className="h-36 items-center justify-center">
                    <View className="mb-3 h-12 w-12 items-center justify-center rounded-full bg-indigo-100">
                      <Text className="text-xl">📷</Text>
                    </View>
                    <Text className="text-sm text-slate-500">
                      Upload or Select Image
                    </Text>
                  </View>
                )}
              </TouchableOpacity>
            </View>

            <TouchableOpacity
              onPress={submitForm}
              disabled={isSubmitting}
              activeOpacity={0.9}
              className={`mb-5 rounded-full px-6 py-4 shadow ${
                isSubmitting ? "bg-indigo-300" : "bg-indigo-600"
              }`}
            >
              <Text className="text-center text-base font-extrabold text-white">
                {isSubmitting ? "Submitting..." : "Post Report  ➜"}
              </Text>
            </TouchableOpacity>

            <TouchableOpacity onPress={() => router.back()} disabled={isSubmitting}>
              <Text className="text-center text-sm font-medium text-slate-400">
                Cancel and discard draft
              </Text>
            </TouchableOpacity>

            <View className="mt-8 rounded-2xl bg-indigo-50 px-4 py-3">
              <Text className="text-xs leading-5 text-slate-500">
                Your report will be reviewed by campus security before being
                broadcasted to the community.
              </Text>
            </View>
          </ScrollView>
        </View>
      </View>
    </SafeAreaView>
  );
}