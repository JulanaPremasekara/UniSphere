import React, { useState, useEffect } from 'react';
import { 
  ScrollView, 
  TouchableOpacity, 
  TextInput, 
  ActivityIndicator, 
  Alert, 
  KeyboardAvoidingView, 
  Platform, 
  TouchableWithoutFeedback, 
  Keyboard 
} from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { Box } from '@/components/ui/box';
import { VStack } from '@/components/ui/vstack';
import { HStack } from '@/components/ui/hstack';
import { Text } from '@/components/ui/text';
import { Button, ButtonText } from '@/components/ui/button';
import { X, Save } from 'lucide-react-native';
import apiClient from "@/services/api";

const CONDITIONS = ["New", "Used", "Like New"];

export default function EditListingScreen() {
  const { id } = useLocalSearchParams(); 
  const router = useRouter();
  
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [title, setTitle] = useState("");
  const [price, setPrice] = useState("");
  const [description, setDescription] = useState("");
  const [location, setLocation] = useState("");
  const [contactNumber, setContactNumber] = useState("");
  const [condition, setCondition] = useState("Used");

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const response = await apiClient.get(`/api/marketplace/${id}`);
        const data = response.data.data;
        setTitle(data.title);
        setPrice(data.price.toString());
        setDescription(data.description);
        setLocation(data.location || "");
        setContactNumber(data.contactNumber || "");
        setCondition(data.condition || "Used");
      } catch (error) { Alert.alert("Error", "Could not load data."); } 
      finally { setLoading(false); }
    };
    if (id) fetchProduct();
  }, [id]);

  const handleUpdate = async () => {
    if (!title || !price || !description || !location || !contactNumber) return Alert.alert("Wait", "Fill all fields.");
    try {
      setSaving(true);
      await apiClient.put(`/api/marketplace/${id}`, { title, price, description, location, contactNumber, condition });
      router.back();
    } catch (error) { Alert.alert("Error", "Update failed."); } 
    finally { setSaving(false); }
  };

  if (loading) return <Box className="flex-1 justify-center items-center bg-white"><ActivityIndicator size="large" color="#4F46E5" /></Box>;

  return (
    <KeyboardAvoidingView 
      behavior={Platform.OS === "ios" ? "padding" : "height"} 
      style={{ flex: 1, backgroundColor: 'white' }}
    >
      <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
        <Box className="flex-1 pt-12">
          <HStack className="px-6 py-4 justify-between border-b border-gray-50">
            <TouchableOpacity onPress={() => router.back()}><X size={28} color="#1f2937" /></TouchableOpacity>
            <Text className="text-xl font-bold text-indigo-700">Edit Listing</Text>
            <Box className="w-8" />
          </HStack>

          <ScrollView 
            showsVerticalScrollIndicator={false} 
            className="px-6"
            contentContainerStyle={{ paddingBottom: 250 }} 
            keyboardShouldPersistTaps="handled"
          >
            <VStack space="xl" className="mt-8">
              <TextInput placeholder="Title" value={title} onChangeText={setTitle} className="bg-gray-50 p-5 rounded-2xl text-lg font-bold border border-gray-100" />
              <TextInput placeholder="Price ($)" keyboardType="numeric" value={price} onChangeText={setPrice} className="bg-gray-50 p-5 rounded-2xl text-lg font-bold text-indigo-600 border border-gray-100" />
              
              <VStack space="sm">
                <Text className="text-[11px] font-black text-gray-400 uppercase ml-2">Condition</Text>
                <HStack space="xs">
                  {CONDITIONS.map((c) => (
                    <TouchableOpacity key={c} onPress={() => setCondition(c)} className={`px-4 py-2 rounded-full border ${condition === c ? 'bg-indigo-600 border-indigo-600' : 'bg-white border-gray-200'}`}>
                      <Text className={`font-bold text-xs ${condition === c ? 'text-white' : 'text-gray-500'}`}>{c}</Text>
                    </TouchableOpacity>
                  ))}
                </HStack>
              </VStack>

              <TextInput placeholder="Contact Number" value={contactNumber} onChangeText={setContactNumber} keyboardType="phone-pad" className="bg-gray-50 p-5 rounded-2xl text-lg font-bold border border-gray-100" />
              <TextInput placeholder="Location" value={location} onChangeText={setLocation} className="bg-gray-50 p-5 rounded-2xl text-lg font-bold border border-gray-100" />
              <TextInput placeholder="Description" multiline numberOfLines={6} value={description} onChangeText={setDescription} textAlignVertical="top" className="bg-gray-50 p-5 rounded-3xl text-base h-40 border border-gray-100" />
            </VStack>
          </ScrollView>

          {/* Footer Area - Removed 'border-t' */}
          <Box className="absolute bottom-0 w-full p-6 bg-white">
            <Button onPress={handleUpdate} disabled={saving} className="bg-indigo-600 rounded-full h-16 shadow-lg shadow-indigo-100">
              {saving ? (
                <ActivityIndicator color="white" />
              ) : (
                <HStack space="sm" className="items-center">
                  <Save size={20} color="white" />
                  <ButtonText className="text-white font-bold text-lg">Save Changes</ButtonText>
                </HStack>
              )}
            </Button>
          </Box>
        </Box>
      </TouchableWithoutFeedback>
    </KeyboardAvoidingView>
  );
}