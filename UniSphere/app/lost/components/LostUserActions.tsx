import React from "react";
import { Alert, Linking, Text, TouchableOpacity, View } from "react-native";

type Props = {
  itemId: string;
  phoneNumber: string; 
};

export default function LostUserActions({ itemId, phoneNumber }: Props) {
  
  const handleCall = () => {
    if (!phoneNumber) {
      Alert.alert("Error", "Phone number not available");
      return;
    }

    Alert.alert(
      "Contact Finder",
      `Call ${phoneNumber}?`,
      [
        { text: "Cancel", style: "cancel" },
        {
          text: "Call",
          onPress: () => {
            Linking.openURL(`tel:${phoneNumber}`);
          },
        },
      ]
    );
  };

  return (
    <View className="mt-6">
      <TouchableOpacity
        onPress={handleCall}
        className="bg-indigo-600 rounded-full py-4 items-center"
        activeOpacity={0.9}
      >
        <Text className="text-white font-bold">
          Claim / Contact Finder
        </Text>
      </TouchableOpacity>

      <View className="mt-4 bg-indigo-50 p-4 rounded-xl">
        <Text className="text-xs text-slate-500">
          Security note: You may need to verify ownership.
        </Text>
      </View>
    </View>
  );
}
