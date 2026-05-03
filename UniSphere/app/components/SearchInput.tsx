import React from "react";
import { TextInput, View } from "react-native";

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
  return (
    <View className="mb-4 rounded-full bg-slate-100 px-4 mt-2">
      <TextInput
        value={value}
        onChangeText={onChangeText}
        placeholder={placeholder}
        placeholderTextColor="#94A3B8"
        className="h-12 text-sm text-slate-900"
      />
    </View>
  );
};

export default SearchInput;