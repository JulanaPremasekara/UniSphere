import React, { useState, useEffect } from 'react';
import { ScrollView, TouchableOpacity, TextInput, ActivityIndicator } from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { Box } from '@/components/ui/box';
import { VStack } from '@/components/ui/vstack';
import { HStack } from '@/components/ui/hstack';
import { Text } from '@/components/ui/text';
import { Button, ButtonText } from '@/components/ui/button';
import { X } from 'lucide-react-native';
import axios from 'axios';

export default function EditListingScreen() {
  const { id } = useLocalSearchParams(); 
  const router = useRouter();
  
  // --- STATE ---
  const [title, setTitle] = useState("");
  const [price, setPrice] = useState("");
  const [description, setDescription] = useState("");
  const [loading, setLoading] = useState(true);

  // REPLACE WITH YOUR ACTUAL IP
  const API_URL = `http://192.168.1.7:5000/api/marketplace/${id}`;

  // 1. FETCH THE CURRENT DATA FROM BACKEND
  useEffect(() => {
    const fetchExistingProduct = async () => {
      try {
        const response = await axios.get(API_URL);
        const data = response.data;
        setTitle(data.title);
        setPrice(data.price);
        setDescription(data.description);
      } catch (error) {
        console.error("Error loading product for edit:", error);
        alert("Could not load item details.");
      } finally {
        setLoading(false);
      }
    };
    fetchExistingProduct();
  }, [id]);

  // 2. SEND UPDATED DATA (PUT REQUEST)
  const handleUpdate = async () => {
    try {
      await axios.put(API_URL, {
        title,
        price,
        description
      });
      alert("Updated successfully!");
      router.back();
    } catch (error) {
      console.error("Update failed:", error);
      alert("Failed to save changes.");
    }
  };

  if (loading) {
    return (
      <Box className="flex-1 justify-center items-center bg-white">
        <ActivityIndicator size="large" color="#4F46E5" />
      </Box>
    );
  }

  return (
    <Box className="flex-1 bg-white pt-12">
      <HStack className="px-6 items-center justify-between mb-6">
        <VStack>
          <Text className="text-3xl font-black text-gray-900">Edit Listing</Text>
          <Text className="text-gray-400 text-sm">Modify your item details</Text>
        </VStack>
        <TouchableOpacity onPress={() => router.back()} className="p-2 bg-gray-100 rounded-full">
          <X size={20} color="#1f2937" />
        </TouchableOpacity>
      </HStack>

      <ScrollView className="px-6" showsVerticalScrollIndicator={false}>
        <VStack space="xl" className="pb-10">
          
          {/* Title - Fixed Visibility */}
          <VStack space="xs">
            <Text className="text-[12px] font-bold text-gray-400 uppercase tracking-widest ml-1">Title</Text>
            <TextInput 
              value={title} 
              onChangeText={setTitle} 
              placeholderTextColor="#9CA3AF"
              style={{ 
                backgroundColor: '#f3f4f6', 
                color: '#000000', // Forced Black
                padding: 15, 
                borderRadius: 15, 
                fontSize: 16,
                height: 56
              }}
            />
          </VStack>

          {/* Price - Fixed Visibility */}
          <VStack space="xs">
            <Text className="text-[12px] font-bold text-gray-400 uppercase tracking-widest ml-1">Price</Text>
            <TextInput 
              value={price} 
              onChangeText={setPrice} 
              keyboardType="numeric"
              placeholderTextColor="#9CA3AF"
              style={{ 
                backgroundColor: '#f3f4f6', 
                color: '#000000', // Forced Black
                padding: 15, 
                borderRadius: 15, 
                fontSize: 16,
                height: 56
              }}
            />
          </VStack>

          {/* Description - Fixed Visibility */}
          <VStack space="xs">
            <Text className="text-[12px] font-bold text-gray-400 uppercase tracking-widest ml-1">Description</Text>
            <TextInput 
              value={description} 
              onChangeText={setDescription} 
              multiline 
              placeholderTextColor="#9CA3AF"
              style={{ 
                backgroundColor: '#f3f4f6', 
                color: '#000000', // Forced Black
                padding: 15, 
                borderRadius: 15, 
                fontSize: 16, 
                minHeight: 120,
                textAlignVertical: 'top'
              }}
            />
          </VStack>

          <Button className="bg-indigo-600 rounded-full h-16 mt-6 shadow-lg shadow-indigo-200" onPress={handleUpdate}>
            <ButtonText className="font-bold text-lg">Save Changes</ButtonText>
          </Button>
          
        </VStack>
      </ScrollView>
    </Box>
  );
}