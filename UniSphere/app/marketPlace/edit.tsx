import React, { useState } from 'react';
import { ScrollView, TouchableOpacity } from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { Box } from '@/components/ui/box';
import { VStack } from '@/components/ui/vstack';
import { HStack } from '@/components/ui/hstack';
import { Text } from '@/components/ui/text';
import { Input, InputField } from '@/components/ui/input';
import { Textarea, TextareaInput } from '@/components/ui/textarea';
import { Button, ButtonText } from '@/components/ui/button';
import { X } from 'lucide-react-native';


// This should match the data in your [id].tsx and index.tsx
const PRODUCTS = [
  { id: "1", title: "Modern Physics: Third Edition", price: "45.00", description: "Lightly used book. Perfect for studying.", condition: "Like New" },
  { id: "2", title: "MacBook Air M2 (8GB/256GB)", price: "850.00", description: "Space Gray, excellent condition.", condition: "Used - Excellent" },
];

export default function EditListingScreen() {
  const { id } = useLocalSearchParams(); // Receives the ID from the URL
  const router = useRouter();
  
  const existingProduct = PRODUCTS.find(p => p.id === id);

  const [title, setTitle] = useState(existingProduct?.title || "");
  const [price, setPrice] = useState(existingProduct?.price || "");
  const [description, setDescription] = useState(existingProduct?.description || "");

  const handleUpdate = () => {
    console.log("Saving Changes for ID:", id, { title, price, description });
    router.back();
  };

  return (
    <Box className="flex-1 bg-white pt-12">
      <HStack className="px-6 items-center justify-between mb-6">
        <VStack>
          <Text className="text-3xl font-black text-gray-900">Edit Listing</Text>
          <Text className="text-gray-400 text-sm">Update details for ID: {id}</Text>
        </VStack>
        <TouchableOpacity onPress={() => router.back()} className="p-2 bg-gray-100 rounded-full">
          <X size={20} color="#1f2937" />
        </TouchableOpacity>
      </HStack>

      <ScrollView className="px-6" showsVerticalScrollIndicator={false}>
        <VStack space="xl" className="pb-10">
          <VStack space="xs">
            <Text className="text-[12px] font-bold text-gray-400 uppercase tracking-widest ml-1">Title</Text>
            <Input className="bg-gray-100 border-none rounded-2xl h-14 px-4">
              <InputField value={title} onChangeText={setTitle} />
            </Input>
          </VStack>

          <VStack space="xs">
            <Text className="text-[12px] font-bold text-gray-400 uppercase tracking-widest ml-1">Price</Text>
            <Input className="bg-gray-100 border-none rounded-2xl h-14 px-4">
              <InputField value={price} onChangeText={setPrice} keyboardType="numeric" />
            </Input>
          </VStack>

          <VStack space="xs">
            <Text className="text-[12px] font-bold text-gray-400 uppercase tracking-widest ml-1">Description</Text>
            <Box className="bg-gray-100 rounded-3xl p-2">
              <Textarea className="border-none min-h-[120px]">
                <TextareaInput value={description} onChangeText={setDescription} multiline />
              </Textarea>
            </Box>
          </VStack>

          <Button className="bg-indigo-600 rounded-full h-16 mt-6 shadow-lg shadow-indigo-200" onPress={handleUpdate}>
            <ButtonText className="font-bold text-lg">Save Changes</ButtonText>
          </Button>
        </VStack>
      </ScrollView>
    </Box>
  );
}