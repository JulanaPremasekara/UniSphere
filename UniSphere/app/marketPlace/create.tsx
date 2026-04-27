import React, { useState } from "react";
import { 
  ScrollView, 
  TouchableOpacity, 
  Image, 
  TextInput, 
  ActivityIndicator, 
  Alert, 
  KeyboardAvoidingView, 
  Platform, 
  TouchableWithoutFeedback, 
  Keyboard 
} from "react-native";
import { useRouter } from "expo-router";
import * as ImagePicker from 'expo-image-picker';
import { ChevronLeft, Camera } from "lucide-react-native";
import { Box } from "@/components/ui/box";
import { VStack } from "@/components/ui/vstack";
import { HStack } from "@/components/ui/hstack";
import { Text } from "@/components/ui/text";
import { Button, ButtonText } from "@/components/ui/button";
import apiClient from "../services/api";

const CONDITIONS = ["New", "Used", "Like New"];

export default function CreateListingScreen() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  const [title, setTitle] = useState("");
  const [price, setPrice] = useState("");
  const [description, setDescription] = useState("");
  const [location, setLocation] = useState("");
  const [contactNumber, setContactNumber] = useState("");
  const [condition, setCondition] = useState("Used");
  const [image, setImage] = useState<string | null>(null);

  const pickImage = async () => {
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [1, 1],
      quality: 0.8,
    });
    if (!result.canceled) setImage(result.assets[0].uri);
  };

  const handleSave = async () => {
    if (!title || !price || !description || !location || !contactNumber) {
      return Alert.alert("Required", "All fields are mandatory.");
    }

    setLoading(true);
    try {
      const formData = new FormData();
      formData.append('title', title);
      formData.append('price', price);
      formData.append('description', description);
      formData.append('location', location);
      formData.append('contactNumber', contactNumber);
      formData.append('condition', condition);

      if (image) {
        const filename = image.split('/').pop() || 'upload.jpg';
        const match = /\.(\w+)$/.exec(filename);
        const type = match ? `image/${match[1]}` : `image/jpeg`;
        // @ts-ignore
        formData.append('image', { uri: image, name: filename, type });
      }

      await apiClient.post('/api/marketplace', formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });

      router.replace("/marketplace");
    } catch (error) {
      Alert.alert("Error", "Could not save listing.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <KeyboardAvoidingView 
      behavior={Platform.OS === "ios" ? "padding" : "height"} 
      style={{ flex: 1, backgroundColor: 'white' }}
    >
      <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
        <Box className="flex-1 pt-12">
          <HStack className="px-6 py-4 items-center">
            <TouchableOpacity onPress={() => router.back()}><ChevronLeft size={28} color="#1f2937" /></TouchableOpacity>
            <Text className="ml-4 text-xl font-bold">New Listing</Text>
          </HStack>

          <ScrollView 
            showsVerticalScrollIndicator={false} 
            className="px-6"
            contentContainerStyle={{ paddingBottom: 250 }} 
            keyboardShouldPersistTaps="handled"
          >
            <VStack space="xl" className="mt-4">
              <TouchableOpacity onPress={pickImage} className="h-64 bg-gray-100 rounded-[40px] border-2 border-dashed border-gray-200 items-center justify-center overflow-hidden">
                {image ? <Image source={{ uri: image }} className="w-full h-full" /> : <VStack className="items-center"><Camera size={40} color="#9CA3AF" /><Text className="text-gray-400 mt-2">Add Photo</Text></VStack>}
              </TouchableOpacity>

              <TextInput placeholder="Title" value={title} onChangeText={setTitle} className="bg-gray-50 p-5 rounded-2xl text-lg font-bold border border-gray-100" />
              <TextInput placeholder="Price ($)" value={price} onChangeText={setPrice} keyboardType="numeric" className="bg-gray-50 p-5 rounded-2xl text-lg font-bold text-indigo-600 border border-gray-100" />

              <VStack space="xs">
                <Text className="text-[11px] font-black text-gray-400 uppercase ml-2">Condition</Text>
                <HStack space="sm">
                  {CONDITIONS.map((c) => (
                    <TouchableOpacity key={c} onPress={() => setCondition(c)} className={`px-5 py-3 rounded-full border ${condition === c ? 'bg-indigo-600 border-indigo-600' : 'bg-white border-gray-200'}`}>
                      <Text className={`font-bold ${condition === c ? 'text-white' : 'text-gray-500'}`}>{c}</Text>
                    </TouchableOpacity>
                  ))}
                </HStack>
              </VStack>

              <TextInput placeholder="Phone Number" value={contactNumber} onChangeText={setContactNumber} keyboardType="phone-pad" className="bg-gray-50 p-5 rounded-2xl text-lg font-bold border border-gray-100" />
              <TextInput placeholder="Location" value={location} onChangeText={setLocation} className="bg-gray-50 p-5 rounded-2xl text-lg font-bold border border-gray-100" />
              <TextInput placeholder="Description" value={description} onChangeText={setDescription} multiline numberOfLines={5} textAlignVertical="top" className="bg-gray-50 p-5 rounded-3xl text-base h-40 border border-gray-100" />
            </VStack>
          </ScrollView>

          {/* Footer Area - No border-t */}
          <Box className="absolute bottom-0 w-full p-6 bg-white">
            <Button onPress={handleSave} disabled={loading} className="bg-indigo-600 rounded-full h-16 shadow-lg shadow-indigo-100">
              {loading ? <ActivityIndicator color="white" /> : <ButtonText className="text-white font-bold text-lg">List Now</ButtonText>}
            </Button>
          </Box>
        </Box>
      </TouchableWithoutFeedback>
    </KeyboardAvoidingView>
  );
}