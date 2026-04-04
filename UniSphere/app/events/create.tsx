import React, { useState } from 'react';
import { View, Text, TouchableOpacity, ScrollView, Platform, KeyboardAvoidingView, TextInput } from 'react-native';
import { useRouter } from 'expo-router';
import { X, Camera, Calendar as CalendarIcon, MapPin, Plus } from 'lucide-react-native';
import { Input, InputField, InputSlot } from '@/components/ui/input';
import { VStack } from '@/components/ui/vstack';
import Footer from '../components/Footer';

export default function CreateEvent() {
  const router = useRouter();
  
  // Tag Logic State
  const [tagInput, setTagInput] = useState('');
  const [tags, setTags] = useState(['Limited Seats', 'Certificate Provided']);

  const addTag = () => {
    if (tagInput.trim() && !tags.includes(tagInput.trim())) {
      setTags([...tags, tagInput.trim()]);
      setTagInput('');
    }
  };

  const removeTag = (index: number) => {
    setTags(tags.filter((_, i) => i !== index));
  };

  const handleBack = () => {
    if (router.canGoBack()) router.back();
    else router.replace('/');
  };

  return (
    <KeyboardAvoidingView 
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'} 
      className="flex-1 bg-white"
    >
      <View className="flex-1">
        <ScrollView 
          className="flex-1 px-6" 
          showsVerticalScrollIndicator={false}
          contentContainerStyle={{ 
            flexGrow: 1,
            paddingTop: Platform.OS === 'ios' ? 70 : 60, 
            paddingBottom: 160
          }}
        >
          {/* Header */}
          <View className="flex-row justify-between items-start mb-2">
            <Text className="text-4xl font-black text-gray-900 leading-tight flex-1">New Event</Text>
            <TouchableOpacity onPress={handleBack} className="bg-gray-100 p-3 rounded-full ml-4">
              <X size={24} color="#1F2937" strokeWidth={2.5} />
            </TouchableOpacity>
          </View>
          <Text className="text-gray-500 text-base mb-8">Fill in the details to curate your campus experience.</Text>

          {/* Cover Photo */}
          <TouchableOpacity activeOpacity={0.8} className="w-full h-48 bg-gray-50 rounded-[40px] border-2 border-dashed border-gray-200 items-center justify-center mb-10">
            <View className="bg-indigo-600 p-4 rounded-2xl shadow-lg shadow-indigo-200 mb-2">
              <Camera size={28} color="white" />
            </View>
            <Text className="text-gray-500 font-bold">Add a cover photo</Text>
          </TouchableOpacity>

          <VStack space="xl">
            {/* Event Title */}
            <View>
              <Text className="text-[13px] font-bold text-gray-400 uppercase tracking-[1.5px] ml-1 mb-3">Event Title</Text>
              <Input className="h-16 rounded-[22px] bg-gray-50 border-transparent px-5">
                <InputField placeholder="e.g., Design Symposium" className="font-semibold text-lg" />
              </Input>
            </View>

            {/* Start Date & Time */}
            <View>
              <Text className="text-[13px] font-bold text-gray-400 uppercase tracking-[1.5px] ml-1 mb-3">Start Date & Time</Text>
              <Input className="h-16 rounded-[22px] bg-gray-50 border-transparent px-5">
                <InputField placeholder="mm/dd/yyyy, --:-- --" className="font-semibold text-lg" />
                <InputSlot className="pr-2"><CalendarIcon size={22} color="#1F2937" /></InputSlot>
              </Input>
            </View>

            {/* End Date & Time */}
            <View>
              <Text className="text-[13px] font-bold text-gray-400 uppercase tracking-[1.5px] ml-1 mb-3">End Date & Time</Text>
              <Input className="h-16 rounded-[22px] bg-gray-50 border-transparent px-5">
                <InputField placeholder="mm/dd/yyyy, --:-- --" className="font-semibold text-lg" />
                <InputSlot className="pr-2"><CalendarIcon size={22} color="#1F2937" /></InputSlot>
              </Input>
            </View>

            {/* Venue */}
            <View>
              <Text className="text-[13px] font-bold text-gray-400 uppercase tracking-[1.5px] ml-1 mb-3">Venue / Location</Text>
              <Input className="h-16 rounded-[22px] bg-gray-50 border-transparent px-5">
                <InputField placeholder="Innovation Hub, Room 402" className="font-semibold text-lg" />
                <InputSlot className="pr-2"><MapPin size={22} color="#1F2937" /></InputSlot>
              </Input>
            </View>

            {/* About the Event (Description) */}
            <View>
              <Text className="text-[13px] font-bold text-gray-400 uppercase tracking-[1.5px] ml-1 mb-3">About the Event</Text>
              <View className="bg-gray-50 rounded-[22px] p-5 min-h-[120px]">
                <TextInput 
                  multiline 
                  placeholder="Describe your event here..." 
                  className="text-gray-900 font-semibold text-lg text-start"
                  placeholderTextColor="#9CA3AF"
                  textAlignVertical="top"
                />
              </View>
            </View>

            {/* Event Tags */}
            <View>
              <Text className="text-[13px] font-bold text-gray-400 uppercase tracking-[1.5px] ml-1 mb-3">Event Tags</Text>
              <Input className="h-16 rounded-[22px] bg-gray-50 border-transparent px-5 mb-4">
                <InputField 
                  placeholder="Add tag (e.g. Workshop)" 
                  value={tagInput}
                  onChangeText={setTagInput}
                  onSubmitEditing={addTag}
                  className="font-semibold text-lg" 
                />
                <TouchableOpacity onPress={addTag} className="bg-indigo-100 p-2 rounded-xl">
                    <Plus size={20} color="#4F46E5" />
                </TouchableOpacity>
              </Input>
              
              {/* Tag Pills Display */}
              <View className="flex-row flex-wrap gap-2">
                {tags.map((tag, index) => (
                  <View key={index} className="flex-row items-center bg-indigo-50 px-4 py-2 rounded-full border border-indigo-100">
                    <Text className="text-indigo-600 font-bold mr-2">{tag}</Text>
                    <TouchableOpacity onPress={() => removeTag(index)}>
                      <X size={14} color="#4F46E5" strokeWidth={3} />
                    </TouchableOpacity>
                  </View>
                ))}
              </View>
            </View>
          </VStack>

          {/* Action Button - Pulled slightly away from tags */}
          <View className="px-6 py-4 bg-white shadow-2xl border-t border-gray-50">
          <TouchableOpacity 
            activeOpacity={0.8}
            className="bg-indigo-600 p-5 rounded-[30px] shadow-indigo-300 shadow-xl"
          >
            <Text className="text-white text-center font-bold text-xl">Publish Event</Text>
          </TouchableOpacity>
        </View>
        </ScrollView>
        <Footer />
      </View>
    </KeyboardAvoidingView>
  );
}