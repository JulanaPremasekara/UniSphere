import { useRouter } from "expo-router";
import React, { useState, useEffect } from "react";
import { ScrollView, TouchableOpacity, ActivityIndicator, View } from "react-native";
import { ChevronLeft, Plus, User } from 'lucide-react-native'; 
import axios from "axios";

import { Box } from "@/components/ui/box";
import { HStack } from "@/components/ui/hstack";
import { Icon } from "@/components/ui/icon";
import { Input, InputField } from "@/components/ui/input";
import { Text } from "@/components/ui/text";
import { VStack } from "@/components/ui/vstack";
import { Avatar } from "@/components/ui/avatar"; 
import Footer from '../components/Footer';

export default function FindTutor() {
  const router = useRouter();

  // --- STATE MANAGEMENT ---
  const [tutorList, setTutorList] = useState<any[]>([]);
  const [filteredTutors, setFilteredTutors] = useState<any[]>([]); // New state for search results
  const [searchQuery, setSearchQuery] = useState(""); // New state for search text
  const [loading, setLoading] = useState(true);

  // YOUR IP AND PORT
  const API_URL = `http://192.168.8.123:3000/tutors`;

  // --- FETCH DATA FROM BACKEND ---
  useEffect(() => {
    const fetchAllTutors = async () => {
      try {
        setLoading(true); 
        const response = await axios.get(API_URL);
        
        if (response.data && response.data.data) {
          setTutorList(response.data.data);
          setFilteredTutors(response.data.data); // Initialize filtered list with all data
        }
      } catch (error) {
        console.error("Error fetching tutors:", error);
      } finally {
        setLoading(false); 
      }
    };

    fetchAllTutors();
  }, []);

  // --- SEARCH LOGIC ---
  const handleSearch = (text: string) => {
    setSearchQuery(text);
    if (!text.trim()) {
      setFilteredTutors(tutorList); // Reset to full list if search is empty
      return;
    }

    const query = text.toLowerCase();
    const filtered = tutorList.filter((tutor) => 
      tutor.name.toLowerCase().includes(query) || 
      tutor.subject.toLowerCase().includes(query)
    );
    setFilteredTutors(filtered);
  };

  return (
    <ScrollView className="flex-1 bg-white">
      <VStack space="md" className="p-6 mt-10">
        
        {/* Header Section */}
        <HStack className="items-center justify-between mb-2">
          <HStack space="md" className="items-center">
            <TouchableOpacity onPress={() => router.back()}>
              <Icon as={ChevronLeft} size="xl" className="text-black" />
            </TouchableOpacity>
            <Text className="text-3xl font-bold text-black">Find a Tutor</Text>
          </HStack>

          <TouchableOpacity 
            onPress={() => router.push('/Tutors/setup' as any)}
            className="bg-[#4338CA] p-2 rounded-full"
          >
            <Icon as={Plus} size="sm" className="text-white" />
          </TouchableOpacity>
        </HStack>

        {/* Search Bar */}
        <Input  variant="outline" 
         className="bg-white border-indigo-300 h-14 rounded-2xl px-4" 
         style={{ zIndex: 1 }}
>
           <InputField 
            placeholder="Search subjects..." 
            placeholderTextColor="#9CA3AF" // Light gray placeholder
            className="text-black text-lg" // High-visibility black text
            value={searchQuery}
            onChangeText={handleSearch}
          />
        </Input>
        

        {/* Categories */}
        <HStack space="sm" className="mt-2">
          <Box className="bg-[#4338CA] px-4 py-1.5 rounded-full">
            <Text className="text-white font-bold text-xs">All Subjects</Text>
          </Box>

        </HStack>

        {/* List of Tutors */}
        {loading ? (
          <View className="mt-20">
            <ActivityIndicator size="large" color="#4338CA" />
            <Text className="text-center text-gray-400 mt-4">Finding tutors...</Text>
          </View>
        ) : (
          <VStack space="lg" className="mt-4">
            {filteredTutors.length > 0 ? (
              filteredTutors.map((tutor) => (
                <TouchableOpacity 
                  key={tutor._id} 
                  onPress={() => router.push(`/Tutors/${tutor._id}` as any)}
                  className="bg-white rounded-[25px] shadow-sm border border-gray-100 p-4"
                >
                  <HStack space="md" className="items-center">
                    <Avatar className="bg-indigo-600 w-16 h-16">
                      <Icon as={User} size="xl" className="text-white" />
                    </Avatar>

                    <VStack className="flex-1" space="xs">
                      <Text className="font-bold text-xl text-black">{tutor.name}</Text>
                      <Text className="text-gray-400 text-sm">{tutor.subject}</Text>
                      
                      <HStack className="justify-between items-center mt-1">
                        <Text className="font-bold text-[#4338CA] text-lg">
                           {tutor.price}<Text className="text-gray-400 text-sm font-normal">/hr</Text>
                        </Text>
                        <Box className={`w-3 h-3 rounded-full ${tutor.isOnline !== false ? 'bg-green-500' : 'bg-gray-300'}`} />
                      </HStack>
                    </VStack>
                  </HStack>
                </TouchableOpacity>
              ))
            ) : (
              <View className="mt-10 items-center">
                <Text className="text-gray-400">No tutors found.</Text>
              </View>
            )}

      
          </VStack>
        )}
      </VStack>
    </ScrollView>
    
  );
}