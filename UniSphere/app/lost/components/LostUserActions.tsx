import { useUser } from "@/hooks/useUser";
import React, { useEffect, useState } from "react";
import { Alert, Image, Linking, Text, TouchableOpacity, View } from "react-native";

type Props = {
  itemId: string;
  category: string;
  ownerid: string;
};

type User = {
  _id: string;
  name?: string;
  phone?: string;
  image?: string;
};

export default function LostUserActions({ itemId, category, ownerid }: Props) {
  const { getuserById } = useUser();

  const [createdUser, setCreatedUser] = useState<User | null>(null);
  const [loadingOwner, setLoadingOwner] = useState(false);

  useEffect(() => {
    if (!ownerid) return;

    const fetchOwner = async () => {
      try {
        setLoadingOwner(true);

        const user = await getuserById(ownerid);
        setCreatedUser(user);
      } catch (error) {
        
        setCreatedUser(null);
      } finally {
        setLoadingOwner(false);
      }
    };

    fetchOwner();
  }, [ownerid]);

  const handleCall = () => {
    if (!createdUser?.phone) {
      Alert.alert("Error", "Phone number not available");
      return;
    }

    Alert.alert("Contact Finder", `Call ${createdUser.phone}?`, [
      { text: "Cancel", style: "cancel" },
      {
        text: "Call",
        onPress: () => {
          Linking.openURL(`tel:${createdUser.phone}`);
        },
      },
    ]);
  };

  return (
    <View className="mx-5 mb-10">
      <View className="bg-white p-6 rounded-[40px] border border-gray-100 shadow-xl shadow-black/5">
        <View className="flex-row items-center mb-6">
          <View className="w-12 h-12 rounded-full bg-indigo-50 mr-4 overflow-hidden">
            {createdUser?.image ? (
              <Image
                source={{ uri: createdUser.image }}
                className="w-full h-full"
              />
            ) : (
              <View className="w-full h-full bg-gray-200" />
            )}
          </View>

          <View>
            <Text className="text-[10px] text-gray-400 font-medium">
              Found by
            </Text>

            <Text className="text-base font-bold text-gray-800">
              {loadingOwner ? "Loading..." : createdUser?.name || "Unknown User"}
            </Text>
          </View>
        </View>

        <View className="flex-row justify-between py-3 border-b border-gray-50">
          <Text className="text-xs text-gray-400">Item ID</Text>
          <Text className="text-xs font-bold text-gray-800">{itemId}</Text>
        </View>

        <View className="flex-row justify-between py-3 mb-4">
          <Text className="text-xs text-gray-400">Category</Text>
          <Text className="text-xs font-bold text-indigo-600">
            {category}
          </Text>
        </View>

        <TouchableOpacity
          onPress={handleCall}
          className="w-full bg-indigo-600 py-5 rounded-3xl items-center shadow-lg shadow-indigo-300"
        >
          <Text className="text-white font-bold text-base">
            Claim / Contact Finder
          </Text>
        </TouchableOpacity>
      </View>

      <View className="bg-indigo-50/50 p-6 rounded-[30px] mt-4">
        <Text className="text-[10px] font-black text-indigo-400 uppercase tracking-wider mb-1">
          Security Note
        </Text>
        <Text className="text-[11px] text-indigo-900/60 leading-4 font-medium">
          To prevent fraudulent claims, all high-value items require a formal
          identity check and specific descriptive verification.
        </Text>
      </View>
    </View>
  );
}