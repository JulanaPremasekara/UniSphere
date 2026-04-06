import { useLocalSearchParams, useRouter } from "expo-router";
import { Box } from "@/components/ui/box";
import { Text } from "@/components/ui/text";
import { TouchableOpacity, SafeAreaView } from "react-native";
import { ChevronLeft } from "lucide-react-native";
import React from 'react';

export default function ProductDetail() {
  const { id } = useLocalSearchParams();
  const router = useRouter();

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: 'white' }}>
      <Box className="px-6 py-4">
        <TouchableOpacity onPress={() => router.back()}>
          <ChevronLeft size={28} color="black" />
        </TouchableOpacity>
        <Text className="text-2xl font-bold mt-10">Product ID: {id}</Text>
        <Text className="text-gray-500 mt-4">Details for this marketplace item will be fetched here.</Text>
      </Box>
    </SafeAreaView>
  );
}