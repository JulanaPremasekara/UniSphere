import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  Image,
  ActivityIndicator,
  Alert,
  Modal,
  Linking,
} from "react-native";
import { useRouter, useLocalSearchParams } from "expo-router";
import {
  ChevronLeft,
  ChevronRight,
  MapPin,
  Calendar,
  Wifi,
  Home,
  Zap,
  Phone,
  Mail,
  MessageCircle,
} from "lucide-react-native";
import { SafeAreaView } from "react-native-safe-area-context";

import Footer from "../components/Footer";
import apiClient from "../services/api";
import { useUser } from "../../hooks/useUser";

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
  const params = useLocalSearchParams();
  const housingId = typeof params.id === "string" ? params.id : undefined;

  const { userId } = useUser();

  const [housing, setHousing] = useState<HousingDetail | null>(null);
  const [loading, setLoading] = useState(true);
  const [hasFetched, setHasFetched] = useState(false);
  const [notFound, setNotFound] = useState(false);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [contactModalVisible, setContactModalVisible] = useState(false);

  useEffect(() => {
    if (!housingId) return;

    (async () => {
      try {
        setLoading(true);
        setNotFound(false);
        setHasFetched(false);

        const { data } = await apiClient.get(`/housing/${housingId}`);

        if (data.success && data.data) {
          const h = data.data;
          const postedBy =
            typeof h.postedBy === "object" ? h.postedBy?._id : h.postedBy;

          setHousing({
            id:
              typeof h._id === "string"
                ? h._id
                : typeof h.id === "string"
                ? h.id
                : housingId,
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
            images: h.images || [],
            contactName: h.contactName,
            contactPhone: h.contactPhone,
            contactEmail: h.contactEmail,
            postedBy,
            isMine: postedBy === userId,
          });

          setNotFound(false);
        } else {
          setHousing(null);
          setNotFound(true);
        }
      } catch (error) {
        setHousing(null);
        setNotFound(true);
        Alert.alert("Error", "Could not load housing details.");
      } finally {
        setLoading(false);
        setHasFetched(true);
      }
    })();
  }, [housingId, userId]);

  if (loading) {
    return (
      <SafeAreaView className="flex-1 items-center justify-center bg-white">
        <ActivityIndicator size="large" color="#4F46E5" />
      </SafeAreaView>
    );
  }

  if (!housing && (notFound || hasFetched)) {
    return (
      <SafeAreaView className="flex-1 bg-white justify-center items-center px-6">
        <Text className="text-lg font-bold text-gray-800">
          Listing not found
        </Text>

        <TouchableOpacity
          onPress={() => router.back()}
          className="mt-4 bg-indigo-600 px-6 py-3 rounded-full"
        >
          <Text className="text-white font-bold">Go Back</Text>
        </TouchableOpacity>
      </SafeAreaView>
    );
  }

  if (!housing) {
    return (
      <SafeAreaView className="flex-1 items-center justify-center bg-white">
        <ActivityIndicator size="large" color="#4F46E5" />
      </SafeAreaView>
    );
  }

  const nextImage = () => {
    setCurrentImageIndex((prev) => (prev + 1) % housing.images.length);
  };

  const prevImage = () => {
    setCurrentImageIndex(
      (prev) => (prev - 1 + housing.images.length) % housing.images.length
    );
  };

  const handleContact = (type: "phone" | "email") => {
    if (type === "phone" && housing.contactPhone) {
      Linking.openURL(`tel:${housing.contactPhone}`);
    } else if (type === "email" && housing.contactEmail) {
      Linking.openURL(`mailto:${housing.contactEmail}`);
    }
  };

  const handleEdit = () => {
    router.push({
      pathname: "/housing/create",
      params: { editId: housing.id },
    });
  };

  const handleDelete = () => {
    Alert.alert("Delete Listing", "This action cannot be undone!", [
      { text: "Cancel", style: "cancel" },
      {
        text: "Delete",
        style: "destructive",
        onPress: async () => {
          try {
            await apiClient.delete(`/housing/${housing.id}`);
            router.replace("/housing");
          } catch {
            Alert.alert("Error", "Failed to delete housing listing.");
          }
        },
      },
    ]);
  };

  return (
    <SafeAreaView edges={["left", "right"]} className="flex-1 bg-white">
      <ScrollView showsVerticalScrollIndicator={false} className="bg-white">
        <View className="flex-row justify-between items-center px-5 pt-14 pb-4 bg-white">
          <View className="flex-row items-center gap-4">
            <TouchableOpacity onPress={() => router.back()}>
              <ChevronLeft size={28} color="#4B5563" />
            </TouchableOpacity>

            <Text className="text-lg font-bold text-indigo-600">Housing</Text>
          </View>
        </View>

        <View className="p-5">
          <View className="relative rounded-[30px] overflow-hidden">
            {housing.images.length > 0 ? (
              <Image
                source={{ uri: housing.images[currentImageIndex] }}
                className="w-full h-64"
                resizeMode="cover"
              />
            ) : (
              <View className="w-full h-64 bg-gray-100 items-center justify-center">
                <Text className="text-gray-400">No image</Text>
              </View>
            )}

            <View className="absolute top-4 left-4 bg-white/90 px-3 py-1.5 rounded-full">
              <Text className="text-[10px] font-black text-indigo-900 uppercase">
                {housing.roomType}
              </Text>
            </View>

            {housing.images.length > 1 && (
              <>
                <TouchableOpacity
                  onPress={prevImage}
                  className="absolute left-4 top-1/2 bg-black/40 p-2 rounded-full"
                >
                  <ChevronLeft size={24} color="white" />
                </TouchableOpacity>

                <TouchableOpacity
                  onPress={nextImage}
                  className="absolute right-4 top-1/2 bg-black/40 p-2 rounded-full"
                >
                  <ChevronRight size={24} color="white" />
                </TouchableOpacity>

                <View className="absolute bottom-4 left-0 right-0 flex-row justify-center gap-2">
                  {housing.images.map((_, idx) => (
                    <View
                      key={idx}
                      className={`w-2 h-2 rounded-full ${
                        idx === currentImageIndex
                          ? "bg-indigo-600"
                          : "bg-white/60"
                      }`}
                    />
                  ))}
                </View>
              </>
            )}
          </View>

          <View className="flex-row items-center mt-4 mb-2 gap-2">
            <View className="w-2 h-2 rounded-full bg-indigo-500" />
            <Text className="text-xs font-bold text-indigo-500 uppercase tracking-tighter">
              Status: {housing.availabilityStatus}
            </Text>
          </View>

          <View className="flex-row justify-between items-start gap-4">
            <Text className="text-3xl font-extrabold text-gray-800 leading-tight flex-1">
              {housing.title}
            </Text>

            <Text className="text-2xl font-black text-indigo-600">
              LKR {housing.rentPrice}
            </Text>
          </View>

          <View className="mt-4 gap-y-2">
            <View className="flex-row items-center bg-gray-50 p-3 rounded-2xl self-start">
              <MapPin size={17} color="#4F46E5" />
              <Text className="ml-2 text-sm text-gray-600 font-medium">
                {housing.address}
              </Text>
            </View>

            {housing.availableFrom && (
              <View className="flex-row items-center bg-gray-50 p-3 rounded-2xl self-start">
                <Calendar size={17} color="#4F46E5" />
                <Text className="ml-2 text-sm text-gray-600 font-medium">
                  Available from{" "}
                  {new Date(housing.availableFrom).toLocaleDateString()}
                </Text>
              </View>
            )}

            {housing.deposit && (
              <View className="flex-row items-center bg-gray-50 p-3 rounded-2xl self-start">
                <Text className="text-indigo-600 font-bold">Deposit</Text>
                <Text className="ml-2 text-sm text-gray-600 font-medium">
                  LKR {housing.deposit}
                </Text>
              </View>
            )}
          </View>

          <View className="mt-6">
            <Text className="text-base font-bold text-gray-800 mb-2">
              About
            </Text>

            <Text className="text-sm text-gray-500 leading-5">
              {housing.description}
            </Text>
          </View>

          <View className="mt-6">
            <Text className="text-base font-bold text-gray-800 mb-3">
              Features
            </Text>

            <View className="flex-row flex-wrap gap-3">
              {[
                { icon: Home, label: "Furnished", value: housing.furnished },
                { icon: Wifi, label: "WiFi", value: housing.wifi },
                { icon: Zap, label: "Parking", value: housing.parking },
              ].map((feature, idx) => (
                <View
                  key={idx}
                  className={`px-4 py-3 rounded-2xl flex-row items-center ${
                    feature.value ? "bg-indigo-50" : "bg-gray-100"
                  }`}
                >
                  <feature.icon
                    size={18}
                    color={feature.value ? "#4F46E5" : "#9CA3AF"}
                  />
                  <Text
                    className={`ml-2 text-xs font-bold ${
                      feature.value ? "text-indigo-700" : "text-gray-500"
                    }`}
                  >
                    {feature.label}
                  </Text>
                </View>
              ))}
            </View>
          </View>

          
          {housing.isMine ? (
            <View className="mx-5 my-6 p-6 bg-gray-100 rounded-[40px]">
              <Text className="text-[10px] font-bold text-gray-400 text-center tracking-[2px] mb-5 uppercase">
                Admin Controls
              </Text>

              {/* <TouchableOpacity className="w-full bg-white p-5 rounded-3xl shadow-sm items-center mb-3">
                <Text className="font-bold text-gray-800">
                  Mark Unavailable
                </Text>
              </TouchableOpacity> */}

              <TouchableOpacity
                onPress={handleEdit}
                className="w-full bg-white p-5 rounded-3xl shadow-sm items-center mb-3"
              >
                <Text className="font-bold text-gray-800">Edit Listing</Text>
              </TouchableOpacity>

              <TouchableOpacity
                onPress={handleDelete}
                className="w-full bg-white p-5 rounded-3xl shadow-sm items-center"
              >
                <Text className="font-bold text-red-500">Remove Listing</Text>
              </TouchableOpacity>
            </View>
          ) : (
            <View className="mt-6">
            <Text className="text-base font-bold text-gray-800 mb-3">
              Posted By
            </Text>

            <View className="bg-gray-50 rounded-[25px] p-5">
              <Text className="text-gray-800 font-bold text-base mb-3">
                {housing.contactName}
              </Text>

              <View className="flex-row gap-2">
                {housing.contactPhone && (
                  <TouchableOpacity
                    onPress={() => handleContact("phone")}
                    className="flex-1 bg-indigo-600 rounded-2xl py-3 flex-row items-center justify-center"
                  >
                    <Phone size={18} color="white" />
                    <Text className="text-white font-bold text-sm ml-2">
                      Call
                    </Text>
                  </TouchableOpacity>
                )}

                {housing.contactEmail && (
                  <TouchableOpacity
                    onPress={() => handleContact("email")}
                    className="flex-1 bg-indigo-500 rounded-2xl py-3 flex-row items-center justify-center"
                  >
                    <Mail size={18} color="white" />
                    <Text className="text-white font-bold text-sm ml-2">
                      Email
                    </Text>
                  </TouchableOpacity>
                )}
              </View>
            </View>
          </View>

          )}
        </View>
      </ScrollView>
      <Footer />

      <Modal
        animationType="fade"
        transparent={true}
        visible={contactModalVisible}
        onRequestClose={() => setContactModalVisible(false)}
      >
        <TouchableOpacity
          activeOpacity={1}
          onPress={() => setContactModalVisible(false)}
          className="flex-1 bg-black/60 justify-center items-center px-6"
        >
          <View className="bg-white rounded-[40px] w-full max-w-sm p-8 shadow-2xl">
            <Text className="text-2xl font-black text-gray-900 mb-4">
              Contact Landlord
            </Text>

            <View className="gap-3">
              {housing.contactPhone && (
                <TouchableOpacity
                  onPress={() => {
                    handleContact("phone");
                    setContactModalVisible(false);
                  }}
                  className="bg-indigo-600 p-4 rounded-2xl flex-row items-center justify-between"
                >
                  <View className="flex-row items-center gap-3">
                    <Phone size={20} color="white" />
                    <Text className="text-white font-bold">Call</Text>
                  </View>

                  <Text className="text-white text-sm">
                    {housing.contactPhone}
                  </Text>
                </TouchableOpacity>
              )}

              {housing.contactEmail && (
                <TouchableOpacity
                  onPress={() => {
                    handleContact("email");
                    setContactModalVisible(false);
                  }}
                  className="bg-indigo-500 p-4 rounded-2xl flex-row items-center justify-between"
                >
                  <View className="flex-row items-center gap-3">
                    <Mail size={20} color="white" />
                    <Text className="text-white font-bold">Email</Text>
                  </View>

                  <Text className="text-white text-sm">
                    {housing.contactEmail}
                  </Text>
                </TouchableOpacity>
              )}
            </View>

            <TouchableOpacity
              onPress={() => setContactModalVisible(false)}
              className="mt-4 bg-gray-100 p-4 rounded-2xl items-center"
            >
              <Text className="text-gray-800 font-bold">Close</Text>
            </TouchableOpacity>
          </View>
        </TouchableOpacity>
      </Modal>
    </SafeAreaView>
  );
}