import { useRouter } from "expo-router";
import { ChevronLeft, Plus, User } from 'lucide-react-native'; 
import React, { useEffect, useState } from "react";
import { ActivityIndicator, ScrollView, TouchableOpacity, View } from "react-native";

import { Avatar, AvatarImage } from "@/components/ui/avatar";
import { Box } from "@/components/ui/box";
import { HStack } from "@/components/ui/hstack";
import { Icon } from "@/components/ui/icon";
import { Text } from "@/components/ui/text";
import { VStack } from "@/components/ui/vstack";
import apiClient from "../services/api";
import Footer from "../components/Footer";
import SearchInput from "../components/SearchInput"; 
import Header from "../components/Header"; 

export default function FindTutor() {
  const router = useRouter();

  // --- STATE MANAGEMENT ---
  const [tutorList, setTutorList] = useState<any[]>([]);
  const [filteredTutors, setFilteredTutors] = useState<any[]>([]); 
  const [searchQuery, setSearchQuery] = useState(""); 
  const [loading, setLoading] = useState(true);

  // --- FETCH DATA FROM BACKEND ---
  useEffect(() => {
    const fetchAllTutors = async () => {
      try {
        setLoading(true); 
        const response = await apiClient.get(`/tutors`);
        if (response.data && response.data.data) {
          setTutorList(response.data.data);
          setFilteredTutors(response.data.data); 
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
      setFilteredTutors(tutorList); 
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
    <View className="flex-1 bg-white">
      {/* Added Header Component */}
      <Header title="UniSphere" />

      <ScrollView className="flex-1 bg-white">
        <VStack space="md" className="p-6 mt-4">
          
          {/* --- SEARCH BAR --- */}
          <SearchInput 
            value={searchQuery}
            onChangeText={handleSearch}
            placeholder="Search subjects..."
          />
          
          {/* Categories */}
          <HStack space="sm" className="mt-2">
            <Box className="bg-[#4338CA] px-8 py-2 rounded-full">
              <Text className="text-white font-bold text-sm">All Tutors</Text>
            </Box>
          </HStack>

          {/* List of Tutors */}
          {loading ? (
            <View className="mt-20">
              <ActivityIndicator size="large" color="#4338CA" />
              <Text className="text-center text-gray-400 mt-4">Finding tutors...</Text>
            </View>
          ) : (
            <VStack space="lg" className="mt-4 mb-32"> 
              {filteredTutors.length > 0 ? (
                filteredTutors.map((tutor) => (
                  <TouchableOpacity 
                    key={tutor._id} 
                    onPress={() => router.push(`/Tutors/${tutor._id}` as any)}
                    className="bg-white rounded-[25px] shadow-sm border border-gray-100 p-4"
                  >
                    <HStack space="md" className="items-center">
                      
                      <View className="relative">
                        <Avatar className="bg-indigo-600 w-16 h-16">
                          {tutor.image ? (
                            <AvatarImage 
                              source={{ uri: tutor.image }} 
                              className="w-full h-full rounded-full" 
                            />
                          ) : (
                            <Icon as={User} size="xl" className="text-white" />
                          )}
                        </Avatar>
                        <Box 
                          className={`absolute bottom-0 right-0 w-4 h-4 rounded-full border-2 border-white ${
                            tutor.isOnline !== false ? 'bg-green-500' : 'bg-gray-300'
                          }`} 
                        />
                      </View>

                      <VStack className="flex-1" space="xs">
                        <Text className="font-bold text-xl text-black">{tutor.name}</Text>
                        <Text className="text-gray-400 text-sm">{tutor.subject}</Text>
                        
                        <HStack className="justify-between items-center mt-1">
                          <Text className="font-bold text-[#4338CA] text-lg">
                             {tutor.price}<Text className="text-gray-400 text-sm font-normal">/hr</Text>
                          </Text>
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

      {/* --- FLOATING ACTION BUTTON --- */}
      <TouchableOpacity 
        onPress={() => router.push('/Tutors/setup' as any)}
        activeOpacity={0.8}
        className="absolute bottom-28 right-6 bg-[#5B50E6] w-16 h-16 rounded-full items-center justify-center shadow-lg"
        style={{ elevation: 5 }}
      >
        <Icon as={Plus} size="xl" className="text-white" />
      </TouchableOpacity>

      <Footer />
    </View>
  );
}