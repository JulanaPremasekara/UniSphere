import React, { useState } from 'react';
import { ScrollView, TouchableOpacity } from 'react-native';
import { useRouter } from 'expo-router';
import { Box } from '@/components/ui/box';
import { VStack } from '@/components/ui/vstack';
import { HStack } from '@/components/ui/hstack';
import { Text } from '@/components/ui/text';
import { Input, InputField, InputSlot, InputIcon } from '@/components/ui/input';
import { Textarea, TextareaInput } from '@/components/ui/textarea';
import { Button, ButtonText, ButtonIcon } from '@/components/ui/button';
import { X, Camera, ArrowRight, DollarSign } from 'lucide-react-native';

export default function CreateListingScreen() {
  const router = useRouter();
  const [title, setTitle] = useState('');
  const [price, setPrice] = useState('');
  const [description, setDescription] = useState('');

  return (
    <Box className="flex-1 bg-white pt-12">
      {/* Header Area */}
      <HStack className="px-6 items-center justify-between mb-2">
        <VStack>
          <Text className="text-3xl font-black text-gray-900">Listing Details</Text>
          <Text className="text-gray-500 text-sm mt-1">
            Fill in the essential information for your item.
          </Text>
        </VStack>
        <TouchableOpacity onPress={() => router.back()} className="p-2 bg-gray-100 rounded-full">
          <X size={20} color="#1f2937" />
        </TouchableOpacity>
      </HStack>

      <ScrollView showsVerticalScrollIndicator={false} className="px-6 mt-6">
        <VStack space="xl" className="pb-10">
          
          {/* Title Input */}
          <VStack space="xs">
            <Text className="text-[12px] font-bold text-gray-500 uppercase tracking-wider ml-1">Title</Text>
            <Input className="bg-gray-100 border-none rounded-2xl h-14 px-4">
              <InputField 
                placeholder="e.g., Organic Chemistry Textbook" 
                value={title}
                onChangeText={setTitle}
              />
            </Input>
          </VStack>

          {/* Price Input */}
          <VStack space="xs">
            <Text className="text-[12px] font-bold text-gray-500 uppercase tracking-wider ml-1">Price (USD)</Text>
            <Input className="bg-gray-100 border-none rounded-2xl h-14 px-4">
              <InputSlot className="pl-3">
                <InputIcon as={DollarSign} size="sm" color="#9CA3AF" />
              </InputSlot>
              <InputField 
                placeholder="0.00" 
                keyboardType="numeric"
                value={price}
                onChangeText={setPrice}
              />
            </Input>
          </VStack>

          {/* Description Input */}
          <VStack space="xs">
            <Text className="text-[12px] font-bold text-gray-500 uppercase tracking-wider ml-1">Description</Text>
            <Box className="bg-gray-100 rounded-3xl p-2">
              <Textarea className="border-none min-h-[120px]">
                <TextareaInput 
                  placeholder="Describe the condition, usage, and any key details..." 
                  value={description}
                  onChangeText={setDescription}
                />
              </Textarea>
            </Box>
          </VStack>

          {/* Media Selection Area */}
          <HStack space="md" className="mt-2">
            <TouchableOpacity className="w-32 h-32 bg-gray-100 rounded-[35px] border-2 border-dashed border-gray-300 items-center justify-center">
              <VStack items-center space="xs">
                <Camera size={24} color="#9CA3AF" />
                <Text className="text-[10px] font-bold text-gray-400 uppercase">Add Media</Text>
              </VStack>
            </TouchableOpacity>

            {/* Placeholder for selected image */}
            <Box className="w-32 h-32 bg-gray-100 rounded-[35px] overflow-hidden">
               <Box className="flex-1 bg-gray-200 items-center justify-center">
                  <Text className="text-gray-400 text-[10px]">PREVIEW</Text>
               </Box>
            </Box>
          </HStack>

          {/* Actions */}
          <VStack space="md" className="mt-8">
            <Button 
              size="xl" 
              className="bg-indigo-600 rounded-full h-16 shadow-lg shadow-indigo-200"
              onPress={() => {
                console.log("Saving...", { title, price, description });
                router.back();
              }}
            >
              <ButtonText className="font-black text-lg">Save Listing</ButtonText>
              <ButtonIcon as={ArrowRight} className="ml-2" />
            </Button>

            <TouchableOpacity 
              onPress={() => router.back()}
              className="py-4 items-center"
            >
              <Text className="font-bold text-gray-500 uppercase tracking-widest">Cancel</Text>
            </TouchableOpacity>
          </VStack>

        </VStack>
      </ScrollView>
    </Box>
  );
}