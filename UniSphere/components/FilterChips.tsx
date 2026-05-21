import React from "react";
import { ScrollView, Text, TouchableOpacity } from "react-native";
import { useTheme } from "@/context/ThemeContext";

type FilterChipsProps<T extends string> = {
  options: T[];
  selectedValue: T;
  onSelect: (value: T) => void;
};

const FilterChips = <T extends string>({
  options,
  selectedValue,
  onSelect,
}: FilterChipsProps<T>) => {
  const { colors } = useTheme();

  return (
    <ScrollView
      horizontal
      showsHorizontalScrollIndicator={false}
      contentContainerStyle={{ gap: 10 }}
      style={{ marginBottom: 24 }}
    >
      {options.map((option) => {
        const isActive = selectedValue === option;

        return (
          <TouchableOpacity
            key={option}
            onPress={() => onSelect(option)}
            activeOpacity={0.8}
            style={{
              borderRadius: 9999,
              paddingHorizontal: 32,
              height: 32,
              borderWidth: 1,
              alignItems: "center",
              justifyContent: "center",
              backgroundColor: isActive ? colors.primary : colors.white,
              borderColor: isActive ? colors.primary : colors.border,
            }}
          >
            <Text
              style={{
                fontSize: 11,
                fontWeight: "bold",
                textTransform: "uppercase",
                letterSpacing: 1.5,
                color: isActive ? "#ffffff" : colors.textMuted,
              }}
            >
              {option}
            </Text>
          </TouchableOpacity>
        );
      })}
    </ScrollView>
  );
};

export default FilterChips;