import React from "react";
import { ScrollView, Text, TouchableOpacity } from "react-native";

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
  return (
    <ScrollView
      horizontal
      showsHorizontalScrollIndicator={false}
      contentContainerStyle={{ gap: 10 }}
      className="mb-6"
    >
      {options.map((option) => {
        const isActive = selectedValue === option;

        return (
          <TouchableOpacity
            key={option}
            onPress={() => onSelect(option)}
            activeOpacity={0.8}
            className={`rounded-full px-8 h-8 border items-center justify-center ${
              isActive 
                ? "bg-indigo-600 border-indigo-600" 
                : "bg-white border-gray-200"
            }`}
          >
            <Text
              className={`text-[11px] font-bold uppercase tracking-widest ${
                isActive ? "text-white" : "text-gray-400"
              }`}
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