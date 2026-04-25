import React from "react";
import { Text, TouchableOpacity, View } from "react-native";

type Props = {
  itemId: string;
};

export default function LostAdminActions({ itemId }: Props) {
  return (
    <View className="mt-6 bg-slate-100 rounded-2xl p-5">
      <Text className="text-sm font-bold text-slate-500 mb-4">
        ADMIN CONTROLS
      </Text>

      <View className="flex-row justify-between">
        <TouchableOpacity className="items-center">
          <Text className="text-lg">✅</Text>
          <Text className="text-xs mt-1">Resolve</Text>
        </TouchableOpacity>

        <TouchableOpacity className="items-center">
          <Text className="text-lg">✏️</Text>
          <Text className="text-xs mt-1">Edit</Text>
        </TouchableOpacity>

        <TouchableOpacity className="items-center">
          <Text className="text-lg text-red-500">🗑</Text>
          <Text className="text-xs mt-1 text-red-500">Delete</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}