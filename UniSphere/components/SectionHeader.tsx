import React from "react";
import { Text, View } from "react-native";
import { useTheme } from "@/context/ThemeContext";

type SectionHeaderProps = {
  title: string;
  subtitle?: string;
};

const SectionHeader = ({ title, subtitle }: SectionHeaderProps) => {
  const { colors } = useTheme();

  return (
    <View style={{ marginBottom: 8 }}>
      <Text style={{ marginBottom: 8, fontSize: 36, fontWeight: "800", color: colors.text }}>
        {title}
      </Text>
      {subtitle ? (
        <Text style={{ fontSize: 15, lineHeight: 24, color: colors.textSecondary }}>
          {subtitle}
        </Text>
      ) : null}
    </View>
  );
};

export default SectionHeader;