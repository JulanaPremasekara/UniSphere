import React from "react";
import { Text, View } from "react-native";

type SectionHeaderProps = {
  title: string;
  subtitle?: string;
};

const SectionHeader = ({ title, subtitle }: SectionHeaderProps) => {
  return (
    <View className="mb-6">
      <Text className="mb-2 text-4xl font-extrabold text-slate-900">
        {title}
      </Text>
      {subtitle ? (
        <Text className="text-[15px] leading-6 text-slate-500">
          {subtitle}
        </Text>
      ) : null}
    </View>
  );
};

export default SectionHeader;