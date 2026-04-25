import React, { useState, useEffect } from 'react';
import { ScrollView, TouchableOpacity, TextInput, ActivityIndicator } from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { Box } from '@/components/ui/box';
import { VStack } from '@/components/ui/vstack';
import { HStack } from '@/components/ui/hstack';
import { Text } from '@/components/ui/text';
import { Button, ButtonText } from '@/components/ui/button';
import { X } from 'lucide-react-native';
import { useMarketplace } from "@/hooks/useMarketplace";

export default function EditListingScreen() {
  const { id } = useLocalSearchParams(); 
  const router = useRouter();
  const { product, loading, fetchProductById, updateProduct } = useMarketplace();
  
  const [title, setTitle] = useState("");
  const [price, setPrice] = useState("");
  const [description, setDescription] = useState("");

  useEffect(() => {
    if (id) fetchProductById(id as string);
  }, [id, fetchProductById]);

  useEffect(() => {
    if (product) {
      setTitle(product.title);
      setPrice(product.price.toString());
      setDescription(product.description);
    }
  }, [product]);

  const handleUpdate = async () => {
    try {
      await updateProduct(id as string, { title, price, description });
      alert("Updated successfully!");
      router.back();
    } catch (error) {
      alert("Failed to save changes.");
    }
  };

  if (loading) return <Box className="flex-1 justify-center items-center bg-white"><ActivityIndicator size="large" color="#4F46E5" /></Box>;

  return (
    <Box className="flex-1 bg-white pt-12">
       {/* ... Keep same UI components/styling as original ... */}
    </Box>
  );
}