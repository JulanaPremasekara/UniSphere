import React from "react";
import { Image, Text, TouchableOpacity, View } from "react-native";
import { LostItem } from "../types/lostItem.types";
import { useTheme } from "@/context/ThemeContext";

type LostItemCardProps = {
  item: LostItem;
  onPress: (itemId: string) => void;
};

const LostItemCard = ({ item, onPress }: LostItemCardProps) => {
  const { colors, isDark } = useTheme();

  return (
    <TouchableOpacity
      activeOpacity={0.9}
      onPress={() => onPress(item.id)}
      style={{ marginBottom: 24 }}
    >
      <View style={{ position: "relative", marginBottom: 12, overflow: "hidden", borderRadius: 30, backgroundColor: colors.bgCard, padding: 12, borderWidth: 1, borderColor: colors.border }}>
        {item.isMine && (
          <View style={{ position: "absolute", left: 12, top: 12, zIndex: 10, borderRadius: 9999, backgroundColor: colors.primary, paddingHorizontal: 12, paddingVertical: 6 }}>
            <Text style={{ fontSize: 10, fontWeight: "800", color: "#ffffff" }}>
              YOUR POST
            </Text>
          </View>
        )}

        <View
          style={{
            position: "absolute",
            right: 12,
            top: 12,
            zIndex: 10,
            borderRadius: 9999,
            paddingHorizontal: 12,
            paddingVertical: 6,
            backgroundColor: item.status === "lost" 
              ? (isDark ? "rgba(239, 68, 68, 0.2)" : "#FEE2E2") 
              : (isDark ? "rgba(99, 102, 241, 0.2)" : "#EEF2FF"),
          }}
        >
          <Text
            style={{
              fontSize: 10,
              fontWeight: "800",
              color: item.status === "lost" ? "#EF4444" : colors.primary,
            }}
          >
            {item.status.toUpperCase()}
          </Text>
        </View>

        <Image
          source={{ uri: item.image }}
          className="h-[260px] w-full rounded-[24px]"
          resizeMode="cover"
        />
      </View>

      <Text style={{ marginBottom: 8, fontSize: 22, fontWeight: "800", color: colors.text }}>
        {item.title}
      </Text>

      <Text style={{ marginBottom: 4, fontSize: 13, color: colors.textSecondary }}>
        📍 {item.location}
      </Text>

      <Text style={{ fontSize: 13, color: colors.textMuted }}>
        🕒 {item.timeAgo}
      </Text>
    </TouchableOpacity>
  );
};

export default LostItemCard;