import axios from "axios";
import { useRouter } from "expo-router";
import { CircleX, User, X } from "lucide-react-native"; // Swapped UserCircle2 for User
import React, { useState } from "react";
import { Alert, KeyboardAvoidingView, Platform, ScrollView, TouchableOpacity, View } from "react-native";

// UI Components
import { Avatar } from "@/components/ui/avatar";
import { HStack } from "@/components/ui/hstack";
import { Icon } from "@/components/ui/icon";
import { Input, InputField, InputSlot } from "@/components/ui/input";
import { Text } from "@/components/ui/text";
import { VStack } from "@/components/ui/vstack";


export default function ProfileSetup() {
  const router = useRouter();

  // --- STATE MANAGEMENT ---
  const [fullName, setFullName] = useState("");
  const [hourlyRate, setHourlyRate] = useState("");
  const [subjects, setSubjects] = useState("");
  const [bio, setBio] = useState("");
  const [loading, setLoading] = useState(false);
  const [phone, setPhone] = useState(""); 

  const API_URL = `http://192.168.8.123:3000/tutors/setup`; 

  // --- SAVE FUNCTION ---
  const handleSaveProfile = async () => {
    if (!fullName || !hourlyRate || !subjects) {
      Alert.alert("Error", "Please fill in all required fields.");
      return;
    }

    setLoading(true);
    try {
      const payload = {
        name: fullName,
        subject: subjects,
        price: `Rs.${hourlyRate}`, 
        bio: bio,
        phone: phone,
        isOnline: true 
      };

      const response = await axios.post(API_URL, payload);
      
      if (response.status === 201 || response.status === 200) {
        Alert.alert("Success", "Tutor profile created successfully!");
        router.push('/Tutors'); 
      }
    } catch (error) {
      console.error("Save Profile Error:", error);
      Alert.alert("Connection Failed", "Could not reach the server. Make sure your backend is running.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <KeyboardAvoidingView 
      behavior={Platform.OS === "ios" ? "padding" : "height"} 
      style={{ flex: 1 }}
    >
      <ScrollView 
        className="flex-1 bg-gray-50" 
        keyboardShouldPersistTaps="handled"
        showsVerticalScrollIndicator={false}
      >
        <View className="bg-white rounded-t-[40px] mt-20 p-8 flex-1 min-h-[800px]">
          <HStack className="justify-between items-center mb-2">
            <Text className="text-3xl font-bold text-black">Profile Setup</Text>
            <TouchableOpacity onPress={() => router.back()}>
              <Icon as={X} size="xl" className="text-gray-400" />
            </TouchableOpacity>
          </HStack>
          
          <Text className="text-gray-500 mb-6">Tell us about your academic expertise.</Text>

          {/* UPDATED AVATAR SECTION */}
          <View className="items-center mb-8">
            <Avatar className="bg-indigo-600 w-24 h-24">
              <Icon as={User} size="xl" className="text-white" />
            </Avatar>
            <Text className="text-gray-400 text-xs mt-3 font-medium uppercase tracking-tighter">Tutor Identity</Text>
          </View>

          <VStack space="xl">
            {/* Full Name */}
            <VStack space="xs">
              <Text className="text-xs font-bold uppercase tracking-wider text-black">
                Full Name
              </Text>
              <Input variant="rounded" className="bg-gray-100 border-0 h-14 px-2">
                <InputField 
                  placeholder="Dr. Julian Sterling" 
                  className="text-black"
                  value={fullName}
                  onChangeText={(text) => setFullName(text)}
                />
                {fullName.length > 0 && (
                  <InputSlot className="pr-3" onPress={() => setFullName("")}>
                    <Icon as={CircleX} size="sm" />
                  </InputSlot>
                )}
              </Input>
            </VStack>

            {/* Hourly Rate */}
            <VStack space="xs">
              <Text className="text-xs font-bold uppercase tracking-wider text-black">
                Hourly Rate (LKR)
              </Text>
              <Input variant="rounded" className="bg-gray-100 border-0 h-14 px-2">
                <InputSlot className="pl-3">
                  <Text className="text-gray-400 mr-1">Rs.</Text>
                </InputSlot>
                <InputField 
                  placeholder="1000" 
                  keyboardType="numeric" 
                  className="text-black"
                  value={hourlyRate}
                  onChangeText={(text) => setHourlyRate(text)}
                />
              </Input>
            </VStack>

            {/* Subjects Input */}
            <VStack space="xs">
              <Text className="text-xs font-bold uppercase tracking-wider text-black">
                Subjects
              </Text>
              <Input variant="rounded" className="bg-gray-100 border-0 h-14 px-2">
                <InputField 
                  placeholder="Physics, Calculus, Ethics"
                  className="text-black" 
                  value={subjects}        
                  onChangeText={(text) => setSubjects(text)}
                />
              </Input>
            </VStack>

            {/* Bio Textarea */}
            <VStack space="xs">
              <Text className="text-xs font-bold uppercase tracking-wider text-black">
                Bio & Experience
              </Text>
              <Input variant="rounded" className="bg-gray-100 border-0 h-14 px-4">
                <InputField
                  placeholder="Share your academic background..." 
                  className="text-black flex-1" 
                  style={{ textAlignVertical: 'top' }} 
                  value={bio}
                  onChangeText={(text) => setBio(text)}
                />
              </Input>
            </VStack>

            {/* contact number */}
            <VStack space="xs">
              <Text className="text-xs font-bold uppercase tracking-wider text-black">
                Contact Number
              </Text>
              <Input variant="rounded" className="bg-gray-100 border-0 h-14 px-2">
                <InputField 
                  placeholder="0771234567" 
                  keyboardType="numeric" 
                  className="text-black"
                  value={phone}
                  onChangeText={(text) => setPhone(text)}
                />
              </Input>
            </VStack>

            <TouchableOpacity 
              className={`bg-[#4338CA] p-4 rounded-full mt-4 ${loading ? 'opacity-50' : 'active:opacity-80'}`}
              onPress={handleSaveProfile}
              disabled={loading}
            >
               <Text className="text-white text-center font-bold text-lg">
                 {loading ? "Saving..." : "Save Profile"}
               </Text>
            </TouchableOpacity>
          </VStack>
          
          <View className="h-20" />
        
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}