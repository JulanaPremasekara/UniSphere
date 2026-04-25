import React, { useState } from 'react';
import { ScrollView, TouchableOpacity, Image, TextInput } from 'react-native';
import { useRouter } from 'expo-router';
import { Box } from '@/components/ui/box';
import { VStack } from '@/components/ui/vstack';
import { HStack } from '@/components/ui/hstack';
import { Text } from '@/components/ui/text';
import { Button, ButtonText, ButtonIcon } from '@/components/ui/button';
import { X, Camera, ArrowRight } from 'lucide-react-native';
import * as ImagePicker from 'expo-image-picker';
import { useMarketplace } from "@/hooks/useMarketplace";

export default function CreateListingScreen() {
  const router = useRouter();
  const { createProduct } = useMarketplace();
  const [title, setTitle] = useState('');
  const [price, setPrice] = useState('');
  const [description, setDescription] = useState('');
  const [image, setImage] = useState<string | null>(null);

  const pickImage = async () => {
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (status !== 'granted') return alert('Permission required!');
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [4, 3],
      quality: 0.5,
    });
    if (!result.canceled) setImage(result.assets[0].uri);
  };

  const handleSaveListing = async () => {
    if (!title || !price || !description) return alert("Please fill in all fields");
    try {
      await createProduct({ title, price, description, location: "Main Campus", image: image || "https://via.placeholder.com/400" });
      router.replace("/marketplace");
    } catch (error) {
      alert("Failed to save listing.");
    }
  };

  return (
    <Box className="flex-1 bg-white pt-12">
      {/* ... Keep same UI components/styling as original ... */}
      {/* Ensure the Button calls handleSaveListing */}
    </Box>
  );
}