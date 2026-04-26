import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, ScrollView, Platform, Image, ActivityIndicator, Alert, Modal, Linking } from 'react-native';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { ArrowLeft, MapPin, DollarSign, Calendar, Wifi, Home, Zap, Phone, Mail, Edit, MessageCircle, ChevronRight, ChevronLeft } from 'lucide-react-native';
import Footer from '../components/Footer';
import apiClient from '../services/api';
import { useUser } from '../../hooks/useUser';

interface HousingDetail {
  id: string;
  title: string;
  description: string;
  address: string;
  roomType: string;
  rentPrice: number;
  deposit?: number;
  availableFrom?: string;
  availabilityStatus: string;
  furnished: boolean;
  wifi: boolean;
  parking: boolean;
  images: string[];
  contactName: string;
  contactPhone: string;
  contactEmail: string;
  postedBy: string;
  isMine: boolean;
}

export default function HousingDetail() {
  const router = useRouter();
  const { id } = useLocalSearchParams();
  const { userId } = useUser();
  const [housing, setHousing] = useState<HousingDetail | null>(null);
  const [loading, setLoading] = useState(true);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [contactModalVisible, setContactModalVisible] = useState(false);

  useEffect(() => {
    if (id) {
      (async () => {
        try {
          setLoading(true);
          const { data: { success, housing: h } } = await apiClient.get(`/housing/${id}`);
          if (success) {
            setHousing({
              id: h._id || id,
              title: h.title,
              description: h.description,
              address: h.address,
              roomType: h.roomType,
              rentPrice: h.rentPrice,
              deposit: h.deposit,
              availableFrom: h.availableFrom,
              availabilityStatus: h.availabilityStatus,
              furnished: h.furnished,
              wifi: h.wifi,
              parking: h.parking,
              images: h.images,
              contactName: h.contactName,
              contactPhone: h.contactPhone,
              contactEmail: h.contactEmail,
              postedBy: h.postedBy,
              isMine: h.postedBy === userId,
            });
          }
        } catch (error) {
          Alert.alert("Error", "Could not load housing details.");
        } finally {
          setLoading(false);
        }
      })();
    }
  }, [id, userId]);

  if (loading) {
    return (
      <View className="flex-1 justify-center items-center bg-white">
        <ActivityIndicator size="large" color="#059669" />
      </View>
    );
  }

  if (!housing) {
    return (
      <View className="flex-1 bg-white justify-center items-center">
        <Text className="text-gray-600 text-lg">Listing not found</Text>
        <TouchableOpacity onPress={() => router.back()} className="mt-4 bg-emerald-600 px-6 py-3 rounded-[20px]">
          <Text className="text-white font-bold">Go Back</Text>
        </TouchableOpacity>
      </View>
    );
  }

  const nextImage = () => {
    setCurrentImageIndex((prev) => (prev + 1) % housing.images.length);
  };

  const prevImage = () => {
    setCurrentImageIndex((prev) => (prev - 1 + housing.images.length) % housing.images.length);
  };

  const handleContact = (type: 'phone' | 'email') => {
    if (type === 'phone' && housing.contactPhone) {
      Linking.openURL(`tel:${housing.contactPhone}`);
    } else if (type === 'email' && housing.contactEmail) {
      Linking.openURL(`mailto:${housing.contactEmail}`);
    }
  };

  return (
    <View className="flex-1 bg-white">
      <View className="px-6 pt-4 pb-4" style={{ paddingTop: Platform.OS === 'ios' ? 60 : 50 }}>
        <View className="flex-row justify-between items-center">
          <TouchableOpacity onPress={() => router.back()} className="bg-gray-100 p-2 rounded-full">
            <ArrowLeft size={24} color="#1F2937" />
          </TouchableOpacity>
          {housing.isMine && (
            <TouchableOpacity onPress={() => router.push({ pathname: '/housing/create', params: { editId: housing.id } })} className="bg-emerald-600 px-4 py-2 rounded-full">
              <View className="flex-row items-center gap-2">
                <Edit size={16} color="white" />
                <Text className="text-white font-bold text-sm">Edit</Text>
              </View>
            </TouchableOpacity>
          )}
        </View>
      </View>

      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingBottom: 80 }}>
        {/* Image Carousel */}
        {housing.images.length > 0 && (
          <View className="relative mb-6">
            <Image source={{ uri: housing.images[currentImageIndex] }} className="w-full h-64" />
            {housing.images.length > 1 && (
              <>
                <TouchableOpacity onPress={prevImage} className="absolute left-4 top-1/2 bg-black/50 p-2 rounded-full">
                  <ChevronLeft size={24} color="white" />
                </TouchableOpacity>
                <TouchableOpacity onPress={nextImage} className="absolute right-4 top-1/2 bg-black/50 p-2 rounded-full">
                  <ChevronRight size={24} color="white" />
                </TouchableOpacity>
                <View className="absolute bottom-4 left-0 right-0 flex-row justify-center gap-2">
                  {housing.images.map((_, idx) => (
                    <View key={idx} className={`w-2 h-2 rounded-full ${idx === currentImageIndex ? 'bg-emerald-600' : 'bg-white/50'}`} />
                  ))}
                </View>
              </>
            )}
          </View>
        )}

        <View className="px-6">
          {/* Title & Room Type */}
          <View className="mb-4">
            <Text className="text-3xl font-bold text-gray-900 mb-2">{housing.title}</Text>
            <View className="flex-row items-center gap-2">
              <View className="bg-emerald-100 px-3 py-1 rounded-full">
                <Text className="text-emerald-700 text-sm font-bold">{housing.roomType}</Text>
              </View>
              <View className="bg-blue-100 px-3 py-1 rounded-full">
                <Text className="text-blue-700 text-sm font-bold">{housing.availabilityStatus}</Text>
              </View>
            </View>
          </View>

          {/* Price Section */}
          <View className="bg-emerald-50 rounded-[20px] p-4 mb-6">
            <View className="flex-row items-end gap-2 mb-2">
              <Text className="text-emerald-600 text-sm font-bold">RENT PRICE</Text>
              <DollarSign size={16} color="#059669" />
            </View>
            <Text className="text-3xl font-bold text-emerald-700">${housing.rentPrice}/month</Text>
            {housing.deposit && <Text className="text-gray-600 text-sm mt-2">Deposit: ${housing.deposit}</Text>}
          </View>

          {/* Location */}
          <View className="flex-row gap-3 mb-6 p-4 bg-gray-50 rounded-[20px]">
            <MapPin size={24} color="#059669" />
            <View className="flex-1">
              <Text className="text-xs font-bold text-gray-500 uppercase mb-1">Location</Text>
              <Text className="text-gray-800 font-semibold text-base">{housing.address}</Text>
            </View>
          </View>

          {/* Description */}
          <View className="mb-6">
            <Text className="text-lg font-bold text-gray-900 mb-3">About</Text>
            <Text className="text-gray-600 text-base leading-relaxed">{housing.description}</Text>
          </View>

          {/* Features */}
          <View className="mb-6">
            <Text className="text-lg font-bold text-gray-900 mb-4">Features</Text>
            <View className="grid grid-cols-3 gap-3">
              {[
                { icon: Home, label: 'Furnished', value: housing.furnished },
                { icon: Wifi, label: 'WiFi', value: housing.wifi },
                { icon: Zap, label: 'Parking', value: housing.parking },
              ].map((feature, idx) => (
                <View key={idx} className={`p-4 rounded-[15px] items-center ${feature.value ? 'bg-emerald-100' : 'bg-gray-100'}`}>
                  <feature.icon size={24} color={feature.value ? '#059669' : '#9CA3AF'} />
                  <Text className={`text-xs font-bold mt-2 ${feature.value ? 'text-emerald-700' : 'text-gray-500'}`}>{feature.label}</Text>
                </View>
              ))}
            </View>
          </View>

          {/* Availability */}
          {housing.availableFrom && (
            <View className="flex-row gap-3 mb-6 p-4 bg-blue-50 rounded-[20px]">
              <Calendar size={24} color="#0369A1" />
              <View className="flex-1">
                <Text className="text-xs font-bold text-blue-600 uppercase mb-1">Available From</Text>
                <Text className="text-blue-900 font-semibold">{new Date(housing.availableFrom).toLocaleDateString()}</Text>
              </View>
            </View>
          )}

          {/* Contact Info */}
          <View className="mb-6">
            <Text className="text-lg font-bold text-gray-900 mb-4">Posted By</Text>
            <View className="bg-gray-50 rounded-[20px] p-4">
              <Text className="text-gray-800 font-bold text-base mb-4">{housing.contactName}</Text>
              <View className="flex-row gap-2">
                {housing.contactPhone && (
                  <TouchableOpacity onPress={() => handleContact('phone')} className="flex-1 bg-blue-600 rounded-[12px] py-3 flex-row items-center justify-center gap-2">
                    <Phone size={18} color="white" />
                    <Text className="text-white font-bold text-sm">Call</Text>
                  </TouchableOpacity>
                )}
                {housing.contactEmail && (
                  <TouchableOpacity onPress={() => handleContact('email')} className="flex-1 bg-emerald-600 rounded-[12px] py-3 flex-row items-center justify-center gap-2">
                    <Mail size={18} color="white" />
                    <Text className="text-white font-bold text-sm">Email</Text>
                  </TouchableOpacity>
                )}
              </View>
            </View>
          </View>
        </View>
      </ScrollView>

      {!housing.isMine && (
        <View className="absolute bottom-0 left-0 right-0 bg-white border-t border-gray-100 px-6 py-4">
          <TouchableOpacity onPress={() => setContactModalVisible(true)} className="bg-emerald-600 p-4 rounded-[20px] flex-row items-center justify-center gap-2">
            <MessageCircle color="white" size={20} />
            <Text className="text-white font-bold text-lg">Contact Landlord</Text>
          </TouchableOpacity>
        </View>
      )}

      <Footer />

      <Modal animationType="fade" transparent={true} visible={contactModalVisible} onRequestClose={() => setContactModalVisible(false)}>
        <TouchableOpacity activeOpacity={1} onPress={() => setContactModalVisible(false)} className="flex-1 bg-black/60 justify-center items-center px-6">
          <View className="bg-white rounded-[40px] w-full max-w-sm p-8 shadow-2xl">
            <Text className="text-2xl font-bold text-gray-900 mb-4">Contact Landlord</Text>
            <View className="gap-3">
              {housing.contactPhone && (
                <TouchableOpacity onPress={() => { handleContact('phone'); setContactModalVisible(false); }} className="bg-blue-600 p-4 rounded-[16px] flex-row items-center justify-between">
                  <View className="flex-row items-center gap-3">
                    <Phone size={20} color="white" />
                    <Text className="text-white font-bold">Call</Text>
                  </View>
                  <Text className="text-white text-sm">{housing.contactPhone}</Text>
                </TouchableOpacity>
              )}
              {housing.contactEmail && (
                <TouchableOpacity onPress={() => { handleContact('email'); setContactModalVisible(false); }} className="bg-emerald-600 p-4 rounded-[16px] flex-row items-center justify-between">
                  <View className="flex-row items-center gap-3">
                    <Mail size={20} color="white" />
                    <Text className="text-white font-bold">Email</Text>
                  </View>
                  <Text className="text-white text-sm truncate">{housing.contactEmail}</Text>
                </TouchableOpacity>
              )}
            </View>
            <TouchableOpacity onPress={() => setContactModalVisible(false)} className="mt-4 bg-gray-100 p-4 rounded-[16px] items-center">
              <Text className="text-gray-800 font-bold">Close</Text>
            </TouchableOpacity>
          </View>
        </TouchableOpacity>
      </Modal>
    </View>
  );
}
