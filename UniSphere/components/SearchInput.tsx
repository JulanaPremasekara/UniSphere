import React from "react";
import { TextInput, View } from "react-native";
import { useTheme } from "@/context/ThemeContext";

type SearchInputProps = {
  value: string;
  onChangeText: (text: string) => void;
  placeholder?: string;
};

const SearchInput = ({
  value,
  onChangeText,
  placeholder = "Search...",
}: SearchInputProps) => {
  const { colors } = useTheme();
  return (
    <View style={{ marginBottom: 16, borderRadius: 9999, backgroundColor: colors.bgInput, paddingHorizontal: 16, marginTop: 8 }}>
      <TextInput
        value={value}
        onChangeText={onChangeText}
        placeholder={placeholder}
        placeholderTextColor={colors.textMuted}
        style={{ height: 48, fontSize: 14, color: colors.text }}
      />
    </View>
  );
};

export default SearchInput;