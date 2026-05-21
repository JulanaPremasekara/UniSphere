import { useUser } from "@/hooks/useUser";
import React, { useEffect, useState } from "react";
import { Alert, Image, Linking, Text, TouchableOpacity, View } from "react-native";
import { useTheme } from "@/context/ThemeContext";

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
  const { colors } = useTheme();

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
      <View style={{ backgroundColor: colors.bgCard, borderColor: colors.border }} className="p-6 rounded-[40px] border shadow-xl">
        <View className="flex-row items-center mb-6">
          <View style={{ backgroundColor: colors.bgInput }} className="w-12 h-12 rounded-full mr-4 overflow-hidden">
            {createdUser?.image ? (
              <Image
                source={{ uri: createdUser.image }}
                className="w-full h-full"
              />
            ) : (
              <View style={{ backgroundColor: colors.border }} className="w-full h-full" />
            )}
          </View>

          <View>
            <Text style={{ color: colors.textMuted }} className="text-[10px] font-medium">
              Found by
            </Text>

            <Text style={{ color: colors.text }} className="text-base font-bold">
              {loadingOwner ? "Loading..." : createdUser?.name || "Unknown User"}
            </Text>
          </View>
        </View>

        <View style={{ borderColor: colors.border }} className="flex-row justify-between py-3 border-b">
          <Text style={{ color: colors.textMuted }} className="text-xs">Item ID</Text>
          <Text style={{ color: colors.text }} className="text-xs font-bold">{itemId}</Text>
        </View>

        <View className="flex-row justify-between py-3 mb-4">
          <Text style={{ color: colors.textMuted }} className="text-xs">Category</Text>
          <Text style={{ color: colors.primary }} className="text-xs font-bold">
            {category}
          </Text>
        </View>

        <TouchableOpacity
          onPress={handleCall}
          style={{ backgroundColor: colors.primary }}
          className="w-full py-5 rounded-3xl items-center shadow-lg"
        >
          <Text className="text-white font-bold text-base">
            Claim / Contact Finder
          </Text>
        </TouchableOpacity>
      </View>

      <View style={{ backgroundColor: colors.primaryLight }} className="p-6 rounded-[30px] mt-4">
        <Text style={{ color: colors.primary }} className="text-[10px] font-black uppercase tracking-wider mb-1">
          Security Note
        </Text>
        <Text style={{ color: colors.textSecondary }} className="text-[11px] leading-4 font-medium">
          To prevent fraudulent claims, all high-value items require a formal
          identity check and specific descriptive verification.
        </Text>
      </View>
    </View>
  );
}