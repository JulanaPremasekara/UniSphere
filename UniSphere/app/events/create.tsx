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
  const [tagInput, setTagInput] = useState('');
  const [tags, setTags] = useState(['Limited Seats', 'Certificate Provided']);
  const [image, setImage] = useState<string | null>(null);
  const [isPicking, setIsPicking] = useState(false);
  const [isPublishing, setIsPublishing] = useState(false);
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');

  const [form, setForm] = useState({ title: '', startDate: '', startTime: '', endDate: '', endTime: '', location: '', description: '', tags: tags });

  const addTag = () => { if (tagInput.trim() && !tags.includes(tagInput.trim())) { setTags([...tags, tagInput.trim()]); setTagInput(''); } };
  const removeTag = (index: number) => setTags(tags.filter((_, i) => i !== index));

  const pickImage = async () => {
    try {
      setIsPicking(true);
      const result = await ImagePicker.launchImageLibraryAsync({ mediaTypes: ['images'], allowsEditing: true, aspect: [16, 9], quality: 0.7, base64: true });
      if (!result.canceled && result.assets[0].base64) setImage(`data:image/jpeg;base64,${result.assets[0].base64}`);
    } catch { Alert.alert("Error", "Could not pick image"); } finally { setIsPicking(false); }
  };

  React.useEffect(() => {
    if (isEditing) (async () => {
      try {
        const { data: { success, event: ev } } = await apiClient.get(`/events/${editId}`);
        if (success) {
          const sDate = new Date(ev.startDate), eDate = new Date(ev.endDate);
          setForm({ title: ev.title, startDate: sDate.toLocaleDateString(), startTime: sDate.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', hour12: false }), endDate: eDate.toLocaleDateString(), endTime: eDate.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', hour12: false }), location: ev.location, description: ev.description, tags: ev.tags });
          setTags(ev.tags); if (ev.image) setImage(ev.image);
        }
      } catch { Alert.alert("Error", "Could not load event details."); }
    })();
  }, [editId]);

  const parseDate = (dStr: string, tStr: string) => {
    const parts = dStr.split('/');
    return parts.length === 3 ? new Date(`${parts[2]}/${parts[0].padStart(2, '0')}/${parts[1].padStart(2, '0')} ${tStr || '00:00'}`) : new Date(`${dStr} ${tStr || '00:00'}`);
  };

  const handlePublish = async () => {
    if (isPublishing) return;
    const showAlert = (title: string, message: string) => Platform.OS === 'web' ? alert(`${title}\n\n${message}`) : Alert.alert(title, message);

    try {
      setIsPublishing(true);
      const sDate = parseDate(form.startDate, form.startTime), eDate = parseDate(form.endDate, form.endTime);
      if (isNaN(sDate.getTime()) || isNaN(eDate.getTime())) { showAlert("Invalid Dates", "Please enter valid dates in mm/dd/yyyy format"); return; }
      
      const payload = { ...form, startDate: sDate, endDate: eDate, tags, image: image || undefined };
      const { data } = isEditing ? await apiClient.put(`/events/${editId}`, payload) : await apiClient.post('/events', payload);
      
      if (data.success) { setSuccessMessage(isEditing ? "Event updated successfully!" : "Event published successfully!"); setShowSuccessModal(true); } 
      else showAlert("Error", data.message || "Something went wrong");
    } catch (error: any) { showAlert("Error", error.response?.data?.message || "An error occurred during publishing"); } finally { setIsPublishing(false); }
  };

  const FormField = ({ label, place, val, field, icon: IconComp, multiline = false, className = "" }: any) => (
    <View className={className}>
      <Text className="text-[13px] font-bold text-gray-800 uppercase tracking-[1.5px] ml-1 mb-3">{label}</Text>
      {multiline ? (
        <View className="bg-gray-50 rounded-[22px] p-5 min-h-[120px]">
          <TextInput multiline placeholder={place} className="text-gray-900 font-semibold text-lg text-start" placeholderTextColor="#9CA3AF" textAlignVertical="top" value={val} onChangeText={(text) => setForm({ ...form, [field]: text })} />
        </View>
      ) : (
        <Input className="h-16 rounded-[22px] bg-gray-50 border-transparent px-5">
          <InputField placeholder={place} className="font-semibold text-lg text-gray-800" value={val} onChangeText={(text) => setForm({ ...form, [field]: text })} />
          {IconComp && <InputSlot className="pr-2"><IconComp size={22} color="#1F2937" /></InputSlot>}
        </Input>
      )}
    </View>
  );

  const RowField = ({ label1, place1, val1, field1, icon1, label2, place2, val2, field2 }: any) => (
    <View className="flex-row gap-4">
      <FormField label={label1} place={place1} val={val1} field={field1} icon={icon1} className="flex-1" />
      <FormField label={label2} place={place2} val={val2} field={field2} className="w-1/3" />
    </View>
  );

  return (
    <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : 'height'} className="flex-1 bg-white">
      <View className="flex-1">
        <ScrollView className="flex-1 px-6" showsVerticalScrollIndicator={false} contentContainerStyle={{ flexGrow: 1, paddingTop: Platform.OS === 'ios' ? 70 : 60, paddingBottom: 10 }}>
          <View className="flex-row justify-between items-start mb-2">
            <Text className="text-4xl font-black text-gray-900 leading-tight flex-1">{isEditing ? 'Edit Event' : 'New Event'}</Text>
            <TouchableOpacity onPress={()=> router.back()} className="bg-gray-100 p-3 rounded-full ml-4"><X size={24} color="#1F2937" strokeWidth={2.5} /></TouchableOpacity>
          </View>
          <Text className="text-gray-500 text-base mb-8">Fill in the details to curate your campus experience.</Text>

          <TouchableOpacity activeOpacity={0.8} onPress={pickImage} disabled={isPicking} className="w-full h-48 bg-gray-50 rounded-[40px] border-2 border-dashed border-gray-200 items-center justify-center mb-10 overflow-hidden">
            {image ? <Image source={{ uri: image }} className="w-full h-full" /> : <><View className="bg-indigo-600 p-4 rounded-2xl shadow-lg shadow-indigo-200 mb-2"><Camera size={28} color="white" /></View><Text className="text-gray-500 font-bold">{isPicking ? 'Loading...' : 'Add a cover photo'}</Text></>}
            {image && <View className="absolute bottom-4 right-4 bg-black/60 p-2 rounded-full"><Camera size={20} color="white" /></View>}
          </TouchableOpacity>

          <VStack space="xl">
            <FormField label="Event Title" place="e.g., Design Symposium" val={form.title} field="title" />
            <RowField label1="Start Date" place1="mm/dd/yyyy" val1={form.startDate} field1="startDate" icon1={CalendarIcon} label2="Time" place2="00:00" val2={form.startTime} field2="startTime" />
            <RowField label1="End Date" place1="mm/dd/yyyy" val1={form.endDate} field1="endDate" icon1={CalendarIcon} label2="Time" place2="00:00" val2={form.endTime} field2="endTime" />
            <FormField label="Venue / Location" place="Innovation Hub, Room 402" val={form.location} field="location" icon={MapPin} />
            <FormField label="About the Event" place="Describe your event here..." val={form.description} field="description" multiline={true} />

            <View>
              <Text className="text-[13px] font-bold text-gray-800 uppercase tracking-[1.5px] ml-1 mb-3">Event Tags</Text>
              <Input className="h-16 rounded-[22px] bg-gray-50 border-transparent px-5 mb-4"><InputField placeholder="Add tag (e.g. Workshop)" value={tagInput} onChangeText={setTagInput} onSubmitEditing={addTag} className="font-semibold text-lg text-gray-800" /><TouchableOpacity onPress={addTag} className="bg-indigo-100 p-2 rounded-xl"><Plus size={20} color="#4F46E5" /></TouchableOpacity></Input>
              <View className="flex-row flex-wrap gap-2">
                {tags.map((tag, index) => (
                  <View key={index} className="flex-row items-center bg-indigo-50 px-4 py-2 rounded-full border border-indigo-100"><Text className="text-indigo-600 font-bold mr-2">{tag}</Text><TouchableOpacity onPress={() => removeTag(index)}><X size={14} color="#4F46E5" strokeWidth={3} /></TouchableOpacity></View>
                ))}
              </View>
            </View>
          </VStack>

          <View className="px-0 mt-3 mb-5 bg-white">
            <TouchableOpacity onPress={handlePublish} activeOpacity={0.8} disabled={isPublishing} className={`${isPublishing ? 'bg-indigo-300' : 'bg-indigo-600'} p-5 rounded-[30px] shadow-indigo-300 shadow-xl`}><Text className="text-white text-center font-bold text-xl">{isPublishing ? 'Publishing...' : (isEditing ? 'Update Event' : 'Publish Event')}</Text></TouchableOpacity>
          </View>
        </ScrollView>
      </View>

      <Modal animationType="fade" transparent={true} visible={showSuccessModal} onRequestClose={() => router.replace('/events')}>
        <View className="flex-1 bg-black/60 justify-center items-center px-6">
          <View className="bg-white rounded-[40px] w-full max-w-sm p-8 shadow-2xl items-center">
            <View className="bg-emerald-50 p-6 rounded-full mb-6"><CheckCircle2 size={48} color="#10B981" strokeWidth={2.5} /></View>
            <Text className="text-3xl font-black text-gray-900 mb-3 text-center">Excellent!</Text>
            <Text className="text-gray-500 text-center text-lg mb-8 leading-relaxed">{successMessage}</Text>
            <TouchableOpacity onPress={() => router.replace('/events')} className="w-full bg-emerald-600 p-5 rounded-3xl shadow-lg shadow-emerald-100"><Text className="text-white font-bold text-center text-xl">Continue to Events</Text></TouchableOpacity>
          </View>
        </View>
      </Modal>
      <Footer />
    </KeyboardAvoidingView>
  );
}