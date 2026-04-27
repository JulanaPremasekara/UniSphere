import React, { useState } from 'react';
import { View, Text, TouchableOpacity, ScrollView, Platform, KeyboardAvoidingView, TextInput, Alert, Image, Modal } from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { X, Camera, MapPin, Plus, CheckCircle2, Trash2 } from 'lucide-react-native';
import { Input, InputField, InputSlot } from '@/components/ui/input';
import Footer from '../components/Footer';
import apiClient from '../services/api';

const FormField = ({ label, place, val, field, icon: IconComp, multiline = false, className = "", updateForm, keyboardType = "default" }: any) => {
  return (
    <View className={className}>
      <Text className="text-[13px] font-bold text-gray-800 uppercase tracking-[1.5px] ml-1 mb-3">{label}</Text>
      {multiline ? (
        <View className="bg-gray-50 rounded-[22px] p-5 min-h-[120px]">
          <TextInput multiline placeholder={place} className="text-gray-900 font-semibold text-lg text-start" placeholderTextColor="#9CA3AF" textAlignVertical="top" value={val} onChangeText={(text) => updateForm(field, text)} />
        </View>
      ) : (
        <Input className="h-16 rounded-[22px] bg-gray-50 border-transparent px-5">
          <InputField placeholder={place} keyboardType={keyboardType} className="font-semibold text-lg text-gray-800" value={val} onChangeText={(text) => updateForm(field, text)} />
          {IconComp && <InputSlot className="pr-2"><IconComp size={22} color="#1F2937" /></InputSlot>}
        </Input>
      )}
    </View>
  );
};

const ToggleField = ({ label, options, selected, onSelect, className = "" }: any) => (
  <View className={className}>
    <Text className="text-[13px] font-bold text-gray-800 uppercase tracking-[1.5px] ml-1 mb-3">{label}</Text>
    <View className="flex-row gap-2">
      {options.map((opt: string) => (
        <TouchableOpacity 
          key={opt} 
          onPress={() => onSelect(opt)} 
          className={`flex-1 p-3 rounded-[18px] items-center justify-center ${selected === opt ? 'bg-emerald-600' : 'bg-gray-100'}`}
        >
          <Text className={`font-bold ${selected === opt ? 'text-white' : 'text-gray-600'}`}>{opt}</Text>
        </TouchableOpacity>
      ))}
    </View>
  </View>
);

const CheckboxField = ({ label, value, onChange, className = "" }: any) => (
  <TouchableOpacity 
    className={`flex-row items-center p-3 rounded-[18px] ${className} ${value ? 'bg-emerald-50' : 'bg-gray-50'}`}
    onPress={() => onChange(!value)}
  >
    <View className={`w-6 h-6 rounded-lg mr-3 items-center justify-center ${value ? 'bg-emerald-600' : 'bg-gray-200'}`}>
      {value && <Text className="text-white font-bold">✓</Text>}
    </View>
    <Text className="text-gray-800 font-semibold">{label}</Text>
  </TouchableOpacity>
);

const RowField = ({ label1, place1, val1, field1, icon1, label2, place2, val2, field2, updateForm, keyboardType1 = "default", keyboardType2 = "default" }: any) => (
  <View className="flex-row gap-4">
    <FormField label={label1} place={place1} val={val1} field={field1} icon={icon1} className="flex-1" updateForm={updateForm} keyboardType={keyboardType1} />
    <FormField label={label2} place={place2} val={val2} field={field2} className="flex-1" updateForm={updateForm} keyboardType={keyboardType2} />
  </View>
);

export default function CreateHousing() {
  const router = useRouter();
  const { editId } = useLocalSearchParams();
  const isEditing = !!editId;
  const [images, setImages] = useState<string[]>([]);
  const [isPicking, setIsPicking] = useState(false);
  const [isPublishing, setIsPublishing] = useState(false);
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');

  const [form, setForm] = useState({
    title: '',
    description: '',
    address: '',
    roomType: 'Single',
    rentPrice: '',
    deposit: '',
    availableFrom: '',
    availabilityStatus: 'Available',
    furnished: false,
    wifi: false,
    parking: false,
    contactName: '',
    contactPhone: '',
    contactEmail: '',
  });

  const pickImage = async () => {
    try {
      setIsPicking(true);
      const result = await ImagePicker.launchImageLibraryAsync({ 
        mediaTypes: ['images'], 
        allowsMultiple: true,
        allowsEditing: true, 
        aspect: [1, 1], 
        quality: 0.7, 
        base64: true 
      });
      if (!result.canceled) {
        const newImages = result.assets.map((asset: any) => 
          asset.base64 ? `data:image/jpeg;base64,${asset.base64}` : ''
        ).filter(Boolean);
        setImages([...images, ...newImages]);
      }
    } catch { Alert.alert("Error", "Could not pick images"); } 
    finally { setIsPicking(false); }
  };

  const removeImage = (index: number) => {
    setImages(images.filter((_, i) => i !== index));
  };

  React.useEffect(() => {
    if (isEditing) (async () => {
      try {
        const { data: { success, housing: h } } = await apiClient.get(`/housing/${editId}`);
        if (success) {
          setForm({
            title: h.title || '',
            description: h.description || '',
            address: h.address || '',
            roomType: h.roomType || 'Single',
            rentPrice: h.rentPrice?.toString() || '',
            deposit: h.deposit?.toString() || '',
            availableFrom: h.availableFrom ? new Date(h.availableFrom).toLocaleDateString() : '',
            availabilityStatus: h.availabilityStatus || 'Available',
            furnished: h.furnished || false,
            wifi: h.wifi || false,
            parking: h.parking || false,
            contactName: h.contactName || '',
            contactPhone: h.contactPhone || '',
            contactEmail: h.contactEmail || '',
          });
          if (h.images) setImages(h.images);
        }
      } catch { Alert.alert("Error", "Could not load housing details."); }
    })();
  }, [editId]);

  const handlePublish = async () => {
    if (isPublishing) return;
    const showAlert = (title: string, message: string) => Platform.OS === 'web' ? alert(`${title}\n\n${message}`) : Alert.alert(title, message);

    // Validation
    if (!form.title.trim()) { showAlert("Required Field", "Please enter a room title"); return; }
    if (!form.address.trim()) { showAlert("Required Field", "Please enter an address/location"); return; }
    if (!form.rentPrice.trim()) { showAlert("Required Field", "Please enter a rent price"); return; }
    if (!form.contactName.trim()) { showAlert("Required Field", "Please enter your name"); return; }
    if (!form.contactPhone.trim() && !form.contactEmail.trim()) { showAlert("Required Field", "Please enter phone or email"); return; }
    if (images.length === 0) { showAlert("Required Field", "Please upload at least one room photo"); return; }

    try {
      setIsPublishing(true);

      const payload = {
        title: form.title,
        description: form.description,
        address: form.address,
        roomType: form.roomType,
        rentPrice: parseFloat(form.rentPrice),
        deposit: form.deposit ? parseFloat(form.deposit) : undefined,
        availableFrom: form.availableFrom ? new Date(form.availableFrom) : undefined,
        availabilityStatus: form.availabilityStatus,
        furnished: form.furnished,
        wifi: form.wifi,
        parking: form.parking,
        contactName: form.contactName,
        contactPhone: form.contactPhone,
        contactEmail: form.contactEmail,
        images: images,
      };

      const { data } = isEditing ? await apiClient.put(`/housing/${editId}`, payload) : await apiClient.post('/housing', payload);

      if (data.success) { 
        setSuccessMessage(isEditing ? "Listing updated successfully!" : "Listing posted successfully!"); 
        setShowSuccessModal(true);
        setTimeout(() => router.back(), 1500);
      }
      else showAlert("Error", data.message || "Something went wrong");
    } catch (error: any) { 
      showAlert("Error", error.response?.data?.message || "An error occurred during publishing"); 
    } finally { 
      setIsPublishing(false); 
    }
  };

  const updateForm = (field: string, text: string) => {
    setForm({ ...form, [field]: text });
  };

  const toggleFeature = (feature: string) => {
    setForm({ ...form, [feature]: !form[feature] });
  };

  return (
    <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : 'height'} className="flex-1 bg-white">
      <View className="px-6 pb-4 bg-white" style={{ paddingTop: Platform.OS === 'ios' ? 60 : 50 }}>
        <View className="flex-row justify-between items-center">
          <Text className="text-2xl font-bold text-emerald-900">{isEditing ? 'Edit Listing' : 'Post a Room'}</Text>
          <TouchableOpacity onPress={() => router.back()} className="bg-gray-100 p-2 rounded-full">
            <X size={24} color="#6B7280" />
          </TouchableOpacity>
        </View>
      </View>

      <ScrollView className="flex-1 px-6 pb-4" contentContainerStyle={{ paddingBottom: 100 }}>
        
        {/* BASIC INFO SECTION */}
        <Text className="text-lg font-bold text-gray-900 mt-8 mb-5">Basic Information</Text>
        <FormField label="Room Title" place="e.g., Single Room Near Campus" val={form.title} field="title" multiline={false} updateForm={updateForm} className="mb-4" />
        <FormField label="Description" place="Tell more about the room..." val={form.description} field="description" multiline={true} updateForm={updateForm} className="mb-4" />
        <FormField label="Address / Location" place="Street address, area, near landmarks" val={form.address} field="address" icon={MapPin} updateForm={updateForm} className="mb-4" />
        <ToggleField label="Room Type" options={['Single', 'Shared', 'Apartment']} selected={form.roomType} onSelect={(val: string) => updateForm('roomType', val)} className="mb-4" />

        {/* PRICING SECTION */}
        <Text className="text-lg font-bold text-gray-900 mt-8 mb-5">Pricing</Text>
        <RowField 
          label1="Rent Price" place1="Enter amount" val1={form.rentPrice} field1="rentPrice" keyboardType1="numeric"
          label2="Deposit (Optional)" place2="Enter amount" val2={form.deposit} field2="deposit" keyboardType2="numeric"
          updateForm={updateForm} 
        />

        {/* AVAILABILITY SECTION */}
        <Text className="text-lg font-bold text-gray-900 mt-8 mb-5">Availability</Text>
        <FormField label="Available From (Date)" place="mm/dd/yyyy" val={form.availableFrom} field="availableFrom" updateForm={updateForm} className="mb-4" keyboardType="numeric" />
        <ToggleField label="Availability Status" options={['Available', 'Not Available']} selected={form.availabilityStatus} onSelect={(val: string) => updateForm('availabilityStatus', val)} className="mb-4" />

        {/* FEATURES SECTION */}
        <Text className="text-lg font-bold text-gray-900 mt-8 mb-5">Features</Text>
        <CheckboxField label="Furnished" value={form.furnished} onChange={(val: boolean) => toggleFeature('furnished')} className="mb-3" />
        <CheckboxField label="WiFi Available" value={form.wifi} onChange={(val: boolean) => toggleFeature('wifi')} className="mb-3" />
        <CheckboxField label="Parking Available" value={form.parking} onChange={(val: boolean) => toggleFeature('parking')} className="mb-4" />

        {/* IMAGES SECTION */}
        <Text className="text-lg font-bold text-gray-900 mt-8 mb-5">Room Photos</Text>
        <TouchableOpacity onPress={pickImage} disabled={isPicking} className="bg-emerald-50 border-2 border-dashed border-emerald-300 rounded-[20px] p-8 items-center justify-center mb-4">
          <Camera size={40} color="#059669" />
          <Text className="text-emerald-700 font-bold text-lg mt-2">{isPicking ? 'Picking...' : 'Tap to Upload Photos'}</Text>
          <Text className="text-gray-500 text-sm mt-1">Select one or multiple images</Text>
        </TouchableOpacity>

        {images.length > 0 && (
          <View className="mb-6">
            <Text className="text-sm font-bold text-gray-600 mb-3">Uploaded Photos ({images.length})</Text>
            <View className="flex-row flex-wrap gap-3">
              {images.map((img, idx) => (
                <View key={idx} className="relative">
                  <Image source={{ uri: img }} className="w-[80px] h-[80px] rounded-[15px]" />
                  <TouchableOpacity onPress={() => removeImage(idx)} className="absolute -top-2 -right-2 bg-red-500 rounded-full p-1">
                    <X size={16} color="white" />
                  </TouchableOpacity>
                </View>
              ))}
            </View>
          </View>
        )}

        {/* CONTACT INFO SECTION */}
        <Text className="text-lg font-bold text-gray-900 mt-8 mb-5">Contact Information</Text>
        <FormField label="Your Name" place="Full name" val={form.contactName} field="contactName" updateForm={updateForm} className="mb-4" />
        <FormField label="Phone Number" place="Your phone" val={form.contactPhone} field="contactPhone" updateForm={updateForm} className="mb-4" keyboardType="phone-pad" />
        <FormField label="Email Address" place="Your email" val={form.contactEmail} field="contactEmail" updateForm={updateForm} className="mb-6" keyboardType="email-address" />

      </ScrollView>

      <View className="absolute bottom-0 left-0 right-0 bg-white border-t border-gray-100 px-6 py-4">
        <TouchableOpacity 
          onPress={handlePublish} 
          disabled={isPublishing}
          className={`p-4 rounded-[20px] items-center justify-center ${isPublishing ? 'bg-gray-300' : 'bg-emerald-600'}`}
        >
          <Text className="text-white font-bold text-lg">{isPublishing ? 'Publishing...' : isEditing ? 'Update Listing' : 'Post Listing'}</Text>
        </TouchableOpacity>
      </View>

      <Modal animationType="fade" transparent={true} visible={showSuccessModal} onRequestClose={() => setShowSuccessModal(false)}>
        <TouchableOpacity activeOpacity={1} onPress={() => { setShowSuccessModal(false); router.back(); }} className="flex-1 bg-black/60 justify-center items-center px-6">
          <View className="bg-white rounded-[40px] w-full max-w-sm p-8 shadow-2xl items-center">
            <View className="bg-emerald-50 p-6 rounded-full mb-6"><CheckCircle2 size={50} color="#059669" /></View>
            <Text className="text-2xl font-black text-gray-900 mb-2">Success!</Text>
            <Text className="text-gray-500 text-center text-lg mb-8">{successMessage}</Text>
            <TouchableOpacity onPress={() => { setShowSuccessModal(false); router.back(); }} className="bg-emerald-600 px-8 py-4 rounded-[20px]">
              <Text className="text-white font-bold">Done</Text>
            </TouchableOpacity>
          </View>
        </TouchableOpacity>
      </Modal>
    </KeyboardAvoidingView>
  );
}
