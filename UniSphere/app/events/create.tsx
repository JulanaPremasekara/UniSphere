import React, { useState } from 'react';
import { View, Text, TouchableOpacity, ScrollView, Platform, KeyboardAvoidingView, TextInput, Alert, Image, Modal } from 'react-native';
import * as ImagePicker from 'expo-image-picker';

import { useRouter, useLocalSearchParams } from 'expo-router';
import { X, Camera, Calendar as CalendarIcon, MapPin, Plus, CheckCircle2 } from 'lucide-react-native';
import { Input, InputField, InputSlot } from '@/components/ui/input';
import { VStack } from '@/components/ui/vstack';
import Footer from '../components/Footer';
import apiClient from '../services/api';

export default function CreateEvent() {
  const router = useRouter();
  const { editId } = useLocalSearchParams();
  const isEditing = !!editId;
  // Tag Logic State
  const [tagInput, setTagInput] = useState('');
  const [tags, setTags] = useState(['Limited Seats', 'Certificate Provided']);
  const [image, setImage] = useState<string | null>(null);
  const [isPicking, setIsPicking] = useState(false);
  const [isPublishing, setIsPublishing] = useState(false);
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');



  const addTag = () => {
    if (tagInput.trim() && !tags.includes(tagInput.trim())) {
      setTags([...tags, tagInput.trim()]);
      setTagInput('');
    }
  };

  const removeTag = (index: number) => {
    setTags(tags.filter((_, i) => i !== index));
  };

  const pickImage = async () => {
    try {
      setIsPicking(true);
      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ['images'],
        allowsEditing: true,
        aspect: [16, 9],
        quality: 0.7,
        base64: true,
      });

      if (!result.canceled && result.assets[0].base64) {
        const base64Image = `data:image/jpeg;base64,${result.assets[0].base64}`;
        setImage(base64Image);
      }
    } catch (error) {
      console.error("ImagePicker Error:", error);
      Alert.alert("Error", "Could not pick image");
    } finally {
      setIsPicking(false);
    }
  };


    const [form, setForm] = useState({
    title: '',
    startDate: '',
    startTime: '',
    endDate: '',
    endTime: '',
    location: '',
    description: '',
    tags: tags,
  });

  // 2. If editing, fetch existing event details
  React.useEffect(() => {
    if (isEditing) {
      fetchEventData();
    }
  }, [editId]);

  const fetchEventData = async () => {
    try {
      const response = await apiClient.get(`/events/${editId}`);
      if (response.data.success) {
        const ev = response.data.event;
        const sDate = new Date(ev.startDate);
        const eDate = new Date(ev.endDate);

        setForm({
          title: ev.title,
          startDate: sDate.toLocaleDateString(),
          startTime: sDate.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', hour12: false }),
          endDate: eDate.toLocaleDateString(),
          endTime: eDate.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', hour12: false }),
          location: ev.location,
          description: ev.description,
          tags: ev.tags,
        });
        setTags(ev.tags);
        if (ev.image) setImage(ev.image);
      }
    } catch (error) {
      Alert.alert("Error", "Could not load event details.");
    }
  };

  const parseDate = (dateStr: string, timeStr: string) => {
    // If user typed mm/dd/yyyy, convert to yYYY/MM/DD for cross-browser parsing
    const parts = dateStr.split('/');
    if (parts.length === 3) {
      const [m, d, y] = parts;
      const formattedDate = `${y}/${m.padStart(2, '0')}/${d.padStart(2, '0')}`;
      return new Date(`${formattedDate} ${timeStr || '00:00'}`);
    }
    return new Date(`${dateStr} ${timeStr || '00:00'}`);
  };

  const handlePublish = async () => {
    if (isPublishing) return;
    
    // Proper Alert wrapper for web/mobile
    const showAlert = (title: string, message: string) => {
      if (Platform.OS === 'web') alert(`${title}\n\n${message}`);
      else Alert.alert(title, message);
    };

    try {
      setIsPublishing(true);
      console.log("Starting publish with payload...", form);
      
      const sDate = parseDate(form.startDate, form.startTime);
      const eDate = parseDate(form.endDate, form.endTime);

      if (isNaN(sDate.getTime()) || isNaN(eDate.getTime())) {
        showAlert("Invalid Dates", "Please enter valid dates in mm/dd/yyyy format (e.g., 04/15/2026)");
        setIsPublishing(false);
        return;
      }

      const payload = { 
        ...form, 
        startDate: sDate, 
        endDate: eDate,
        tags,
        image: image || undefined 
      };

      console.log("Sending API request to:", isEditing ? `/events/${editId}` : '/events');
      const response = isEditing 
        ? await apiClient.put(`/events/${editId}`, payload)
        : await apiClient.post('/events', payload);

      console.log("API Response received:", response.data);

      if (response.data.success) {
        setSuccessMessage(isEditing ? "Event updated successfully!" : "Event published successfully!");
        setShowSuccessModal(true);
      } else {
        showAlert("Error", response.data.message || "Something went wrong");
      }
    } catch (error: any) {
      console.error("Publish Error Detail:", error.response?.data || error.message);
      showAlert("Error", error.response?.data?.message || error.message || "An error occurred during publishing");
    } finally {
      setIsPublishing(false);
    }
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
            paddingBottom: 10
          }}
        >
          {/* Header */}
          <View className="flex-row justify-between items-start mb-2">
            <Text className="text-4xl font-black text-gray-900 leading-tight flex-1">
              {isEditing ? 'Edit Event' : 'New Event'}
            </Text>
            <TouchableOpacity onPress={()=> router.back()} className="bg-gray-100 p-3 rounded-full ml-4">
              <X size={24} color="#1F2937" strokeWidth={2.5} />
            </TouchableOpacity>
          </View>
          <Text className="text-gray-500 text-base mb-8">Fill in the details to curate your campus experience.</Text>

          {/* Cover Photo */}
          <TouchableOpacity 
            activeOpacity={0.8} 
            onPress={pickImage}
            disabled={isPicking}
            className="w-full h-48 bg-gray-50 rounded-[40px] border-2 border-dashed border-gray-200 items-center justify-center mb-10 overflow-hidden"
          >
            {image ? (
              <Image source={{ uri: image }} className="w-full h-full" />
            ) : (
              <>
                <View className="bg-indigo-600 p-4 rounded-2xl shadow-lg shadow-indigo-200 mb-2">
                  <Camera size={28} color="white" />
                </View>
                <Text className="text-gray-500 font-bold">{isPicking ? 'Loading...' : 'Add a cover photo'}</Text>
              </>
            )}
            
            {image && (
              <View className="absolute bottom-4 right-4 bg-black/60 p-2 rounded-full">
                <Camera size={20} color="white" />
              </View>
            )}
          </TouchableOpacity>

          <VStack space="xl">
            {/* Event Title */}
            <View>
              <Text className="text-[13px] font-bold text-gray-800 uppercase tracking-[1.5px] ml-1 mb-3">Event Title</Text>
              <Input className="h-16 rounded-[22px] bg-gray-50 border-transparent px-5">
                <InputField placeholder="e.g., Design Symposium" className="font-semibold text-lg text-gray-800" value={form.title} onChangeText={(text) => setForm({...form, title: text})} />
              </Input>
            </View>

            {/* Start Date & Time */}
            <View className="flex-row gap-4">
              <View className="flex-1">
                <Text className="text-[13px] font-bold text-gray-800 uppercase tracking-[1.5px] ml-1 mb-3">Start Date</Text>
                <Input className="h-16 rounded-[22px] bg-gray-50 border-transparent px-5">
                  <InputField placeholder="mm/dd/yyyy" className="font-semibold text-lg text-gray-800" value={form.startDate} onChangeText={(text) => setForm({...form, startDate: text})} />
                  <InputSlot className="pr-2"><CalendarIcon size={22} color="#1F2937" /></InputSlot>
                </Input>
              </View>
              <View className="w-1/3">
                <Text className="text-[13px] font-bold text-gray-800 uppercase tracking-[1.5px] ml-1 mb-3">Time</Text>
                <Input className="h-16 rounded-[22px] bg-gray-50 border-transparent px-5">
                  <InputField placeholder="00:00" className="font-semibold text-lg text-gray-800" value={form.startTime} onChangeText={(text) => setForm({...form, startTime: text})} />
                </Input>
              </View>
            </View>

            {/* End Date & Time */}
            <View className="flex-row gap-4">
              <View className="flex-1">
                <Text className="text-[13px] font-bold text-gray-800 uppercase tracking-[1.5px] ml-1 mb-3">End Date</Text>
                <Input className="h-16 rounded-[22px] bg-gray-50 border-transparent px-5">
                  <InputField placeholder="mm/dd/yyyy" className="font-semibold text-lg text-gray-800" value={form.endDate} onChangeText={(text) => setForm({...form, endDate: text})} />
                  <InputSlot className="pr-2"><CalendarIcon size={22} color="#1F2937" /></InputSlot>
                </Input>
              </View>
              <View className="w-1/3">
                <Text className="text-[13px] font-bold text-gray-800 uppercase tracking-[1.5px] ml-1 mb-3">Time</Text>
                <Input className="h-16 rounded-[22px] bg-gray-50 border-transparent px-5">
                  <InputField placeholder="00:00" className="font-semibold text-lg text-gray-800" value={form.endTime} onChangeText={(text) => setForm({...form, endTime: text})} />
                </Input>
              </View>
            </View>

            {/* Venue */}
            <View>
              <Text className="text-[13px] font-bold text-gray-800 uppercase tracking-[1.5px] ml-1 mb-3">Venue / Location</Text>
              <Input className="h-16 rounded-[22px] bg-gray-50 border-transparent px-5">
                <InputField placeholder="Innovation Hub, Room 402" className="font-semibold text-lg text-gray-800" value={form.location} onChangeText={(text) => setForm({...form, location: text})} />
                <InputSlot className="pr-2"><MapPin size={22} color="#1F2937" /></InputSlot>
              </Input>
            </View>

            {/* About the Event (Description) */}
            <View>
              <Text className="text-[13px] font-bold text-gray-800 uppercase tracking-[1.5px] ml-1 mb-3">About the Event</Text>
              <View className="bg-gray-50 rounded-[22px] p-5 min-h-[120px]">
                <TextInput 
                  multiline 
                  placeholder="Describe your event here..." 
                  className="text-gray-900 font-semibold text-lg text-start"
                  placeholderTextColor="#9CA3AF"
                  textAlignVertical="top"
                  value={form.description}
                  onChangeText={(text) => setForm({...form, description: text})}
                />
              </View>
            </View>

            {/* Event Tags */}
            <View>
              <Text className="text-[13px] font-bold text-gray-800 uppercase tracking-[1.5px] ml-1 mb-3">Event Tags</Text>
              <Input className="h-16 rounded-[22px] bg-gray-50 border-transparent px-5 mb-4">
                <InputField 
                  placeholder="Add tag (e.g. Workshop)" 
                  value={tagInput}
                  onChangeText={(text) => setTagInput(text)}
                  onSubmitEditing={addTag}
                  className="font-semibold text-lg text-gray-800" 
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

          <View className="px-0 mt-3 mb-5 bg-white">
            <TouchableOpacity 
              onPress ={handlePublish}
              activeOpacity={0.8}
              disabled={isPublishing}
              className={`${isPublishing ? 'bg-indigo-300' : 'bg-indigo-600'} p-5 rounded-[30px] shadow-indigo-300 shadow-xl`}
            >
              <Text className="text-white text-center font-bold text-xl">
                {isPublishing ? 'Publishing...' : (isEditing ? 'Update Event' : 'Publish Event')}
              </Text>
            </TouchableOpacity>
          </View>
        </ScrollView>
      </View>

      {/* SUCCESS MODAL */}
      <Modal
        animationType="fade"
        transparent={true}
        visible={showSuccessModal}
        onRequestClose={() => router.replace('/events')}
      >
        <View className="flex-1 bg-black/60 justify-center items-center px-6">
          <View className="bg-white rounded-[40px] w-full max-w-sm p-8 shadow-2xl items-center">
            <View className="bg-emerald-50 p-6 rounded-full mb-6">
              <CheckCircle2 size={48} color="#10B981" strokeWidth={2.5} />
            </View>
            <Text className="text-3xl font-black text-gray-900 mb-3 text-center">Excellent!</Text>
            <Text className="text-gray-500 text-center text-lg mb-8 leading-relaxed">
              {successMessage}
            </Text>
            
            <TouchableOpacity 
              onPress={() => router.replace('/events')}
              className="w-full bg-emerald-600 p-5 rounded-3xl shadow-lg shadow-emerald-100"
            >
              <Text className="text-white font-bold text-center text-xl">Continue to Events</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
      <Footer />
    </KeyboardAvoidingView>
  );
}