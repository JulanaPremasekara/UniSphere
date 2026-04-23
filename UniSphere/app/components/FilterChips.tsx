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
            className={`rounded-full px-4 py-2.5 ${
              isActive ? "bg-indigo-600" : "bg-slate-100"
            }`}
          >
            <Text
              className={`text-[13px] font-bold ${
                isActive ? "text-white" : "text-slate-500"
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