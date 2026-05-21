import { router } from "expo-router";
import React from "react";
import { Alert, Text, TouchableOpacity, View } from "react-native";
import {
  useDeleteLostItemMutation,
  useMarkItemAsResolvedMutation,
} from "../hooks/useLostItems";
import { useTheme } from "@/context/ThemeContext";

type Props = {
  itemId: string;
};

export default function LostAdminActions({ itemId }: Props) {
  const deleteMutation = useDeleteLostItemMutation();
  const markResolvedMutation = useMarkItemAsResolvedMutation();
  const { colors } = useTheme();

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
    <View style={{ backgroundColor: colors.bgCard }} className="mx-5 my-4 p-6 rounded-[40px]">
      <Text style={{ color: colors.textMuted }} className="text-[10px] font-bold text-center tracking-[2px] mb-5 uppercase">
        Admin Controls
      </Text>

      <TouchableOpacity
        onPress={handleMarkResolved}
        style={{ backgroundColor: colors.white, borderColor: colors.border, borderWidth: 1 }}
        className="w-full p-5 rounded-3xl items-center mb-3"
      >
        <Text style={{ color: colors.text }} className="font-bold">Mark Resolved</Text>
      </TouchableOpacity>

      <TouchableOpacity
        onPress={handleEdit}
        style={{ backgroundColor: colors.white, borderColor: colors.border, borderWidth: 1 }}
        className="w-full p-5 rounded-3xl items-center mb-3"
      >
        <Text style={{ color: colors.text }} className="font-bold">Edit Details</Text>
      </TouchableOpacity>

      <TouchableOpacity
        onPress={handleDelete}
        style={{ backgroundColor: colors.white, borderColor: colors.border, borderWidth: 1 }}
        className="w-full p-5 rounded-3xl items-center"
      >
        <Text className="font-bold text-red-500">Remove Post</Text>
      </TouchableOpacity>
    </View>
  );
}
