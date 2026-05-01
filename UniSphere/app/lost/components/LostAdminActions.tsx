import { router } from "expo-router";

import React from "react";
import { Alert, Text, TouchableOpacity, View } from "react-native";
import {
  useDeleteLostItemMutation,
  useMarkItemAsResolvedMutation,
} from "../hooks/useLostItems";

type Props = {
  itemId: string;
};

export default function LostAdminActions({ itemId }: Props) {
  const deleteMutation = useDeleteLostItemMutation();
  const markResolvedMutation = useMarkItemAsResolvedMutation();

  const handleEdit = () => {
    router.push(`/lost/create?itemId=${itemId}`);
  };

  const handleMarkResolved = () => {
    Alert.alert(
      "Mark as Resolved",
      "Are you sure you want to mark this item as resolved?",
      [
        { text: "Cancel", style: "cancel" },
        {
          text: "Mark Resolved",
          style: "default",
          onPress: async () => {
            try {
              await markResolvedMutation.mutateAsync(itemId);
              router.back();
            } catch (error) {
              Alert.alert("Error", "Failed to mark item as resolved.");
            }
          },
        },
      ],
    );
  };

  const handleDelete = () => {
    Alert.alert("Delete Item", "This action cannot be undone!", [
      { text: "Cancel", style: "cancel" },
      {
        text: "Delete",
        style: "destructive",
        onPress: async () => {
          try {
            await deleteMutation.mutateAsync(itemId);
            router.back();
          } catch (error) {
            Alert.alert("Error", "Failed to delete item.");
          }
        },
      },
    ]);
  };

  return (
    <View className="mx-5 my-4 p-6 bg-gray-100 rounded-[40px]">
      <Text className="text-[10px] font-bold text-gray-400 text-center tracking-[2px] mb-5 uppercase">
        Admin Controls
      </Text>

      <TouchableOpacity
        onPress={handleMarkResolved}
        className="w-full bg-white p-5 rounded-3xl shadow-sm items-center mb-3"
      >
        <Text className="font-bold text-gray-800">Mark Resolved</Text>
      </TouchableOpacity>

      <TouchableOpacity
        onPress={handleEdit}
        className="w-full bg-white p-5 rounded-3xl shadow-sm items-center mb-3"
      >
        <Text className="font-bold text-gray-800">Edit Details</Text>
      </TouchableOpacity>

      <TouchableOpacity
        onPress={handleDelete}
        className="w-full bg-white p-5 rounded-3xl shadow-sm items-center"
      >
        <Text className="font-bold text-red-500">Remove Post</Text>
      </TouchableOpacity>
    </View>
  );
}
