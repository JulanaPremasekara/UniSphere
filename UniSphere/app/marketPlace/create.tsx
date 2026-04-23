import React, { useState } from 'react';
import { ScrollView, TouchableOpacity, Image,TextInput } from 'react-native';
import { useRouter } from 'expo-router';
import { Box } from '@/components/ui/box';
import { VStack } from '@/components/ui/vstack';
import { HStack } from '@/components/ui/hstack';
import { Text } from '@/components/ui/text';
import { Input, InputField, InputSlot, InputIcon } from '@/components/ui/input';
import { Textarea, TextareaInput } from '@/components/ui/textarea';
import { Button, ButtonText, ButtonIcon } from '@/components/ui/button';
import { X, Camera, ArrowRight, DollarSign } from 'lucide-react-native';
import axios from 'axios';
import * as ImagePicker from 'expo-image-picker';
 // Add TextInput here

export default function CreateListingScreen() {
  const router = useRouter();
  const [title, setTitle] = useState('');
  const [price, setPrice] = useState('');
  const [description, setDescription] = useState('');
  const [image, setImage] = useState<string | null>(null);

  const pickImage = async () => {
  // 1. THIS IS THE NEW PART: Request permission from the phone
  const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
  
  // 2. If the user says "No", show an alert and stop the function
  if (status !== 'granted') {
    alert('Permission to access gallery is required to upload photos!');
    return;
  }

  // 3. If permission is "granted", then open the library
  let result = await ImagePicker.launchImageLibraryAsync({
    mediaTypes: ImagePicker.MediaTypeOptions.Images,
    allowsEditing: true,
    aspect: [4, 3],
    quality: 0.5,
  });

  if (!result.canceled) {
    setImage(result.assets[0].uri);
  }
};
  const handleSaveListing = async () => {
    if (!title || !price || !description) {
      alert("Please fill in all fields");
      return;
    }

    const payload = {
      title: title,
      price: price,
      description: description,
      location: "Main Campus",
      condition: "Used",
      // Use the picked image URI, fallback to placeholder if null
      image: image || "https://via.placeholder.com/400"
    };

    try {
    await axios.post("http://192.168.1.7:5000/api/marketplace", payload);
      
      // Use replace instead of push to ensure the home screen re-renders
      router.replace("/marketplace"); 
    } catch (error) {
      alert("Save successful in DB, but failed to redirect.");
    }
  };

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
          
          {/* 1. Title Input */}
          <VStack space="xs">
            <Text className="text-[12px] font-bold text-gray-500 uppercase tracking-wider ml-1">Title</Text>
            <TextInput 
              value={title}
              onChangeText={setTitle}
              placeholder="e.g., Organic Chemistry Textbook"
              placeholderTextColor="#9CA3AF"
              style={{ 
                backgroundColor: '#f3f4f6', 
                color: '#000000', // Guaranteed visible text
                padding: 15, 
                borderRadius: 15, 
                fontSize: 16,
                height: 56
              }}
            />
          </VStack>

          {/* 2. Price Input */}
          <VStack space="xs">
            <Text className="text-[12px] font-bold text-gray-500 uppercase tracking-wider ml-1">Price (USD)</Text>
            <TextInput 
              value={price}
              onChangeText={setPrice}
              placeholder="0.00"
              placeholderTextColor="#9CA3AF"
              keyboardType="numeric"
              style={{ 
                backgroundColor: '#f3f4f6', 
                color: '#000000', 
                padding: 15, 
                borderRadius: 15, 
                fontSize: 16,
                height: 56
              }}
            />
          </VStack>

          {/* 3. Description Input */}
          <VStack space="xs">
            <Text className="text-[12px] font-bold text-gray-500 uppercase tracking-wider ml-1">Description</Text>
            <TextInput 
              value={description}
              onChangeText={setDescription}
              placeholder="Describe the item..."
              placeholderTextColor="#9CA3AF"
              multiline={true}
              numberOfLines={4}
              style={{ 
                backgroundColor: '#f3f4f6', 
                color: '#000000', 
                padding: 15, 
                borderRadius: 15, 
                fontSize: 16, 
                minHeight: 120,
                textAlignVertical: 'top'
              }}
            />
          </VStack>

          {/* Media Selection Area */}
          <HStack space="md" className="mt-2">
            <TouchableOpacity 
              onPress={pickImage} 
              className="w-32 h-32 bg-gray-100 rounded-[35px] border-2 border-dashed border-gray-300 items-center justify-center"
            >
              <VStack className="items-center" space="xs">
                <Camera size={24} color="#9CA3AF" />
                <Text className="text-[10px] font-bold text-gray-400 uppercase">Add Media</Text>
              </VStack>
            </TouchableOpacity>

            <Box className="w-32 h-32 bg-gray-100 rounded-[35px] overflow-hidden">
              {image ? (
                <Image 
                  source={{ uri: image }} 
                  style={{ width: '100%', height: '100%' }} 
                />
              ) : (
                <Box className="flex-1 bg-gray-200 items-center justify-center">
                  <Text className="text-gray-400 text-[10px]">PREVIEW</Text>
                </Box>
              )}
            </Box>
          </HStack>

          {/* Actions */}
          <VStack space="md" className="mt-8">
            <Button 
              size="xl" 
              className="bg-indigo-600 rounded-full h-16 shadow-lg shadow-indigo-200"
              onPress={handleSaveListing}
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
