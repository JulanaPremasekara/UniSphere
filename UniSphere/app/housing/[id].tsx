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

import Footer from "@/components/Footer";
import apiClient from "@/services/api";
import { useUser } from "@/hooks/useUser";
import { useTheme } from "@/context/ThemeContext";

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
  const { colors, isDark } = useTheme();

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
      <SafeAreaView style={{ backgroundColor: colors.bg }} className="flex-1 items-center justify-center">
        <ActivityIndicator size="large" color={colors.primary} />
      </SafeAreaView>
    );
  }

  if (!housing && (notFound || hasFetched)) {
    return (
      <SafeAreaView style={{ backgroundColor: colors.bg }} className="flex-1 justify-center items-center px-6">
        <Text style={{ color: colors.text }} className="text-lg font-bold">
          Listing not found
        </Text>

        <TouchableOpacity
          onPress={() => router.back()}
          style={{ backgroundColor: colors.primary }}
          className="mt-4 px-6 py-3 rounded-full"
        >
          <Text className="text-white font-bold">Go Back</Text>
        </TouchableOpacity>
      </SafeAreaView>
    );
  }

  if (!housing) {
    return (
      <SafeAreaView style={{ backgroundColor: colors.bg }} className="flex-1 items-center justify-center">
        <ActivityIndicator size="large" color={colors.primary} />
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
    <SafeAreaView edges={["left", "right"]} style={{ backgroundColor: colors.bg }} className="flex-1">
      <ScrollView showsVerticalScrollIndicator={false} style={{ backgroundColor: colors.bg }}>
        <View style={{ backgroundColor: colors.bg }} className="flex-row justify-between items-center px-5 pt-14 pb-4">
          <View className="flex-row items-center gap-4">
            <TouchableOpacity onPress={() => router.back()}>
              <ChevronLeft size={28} color={colors.text} />
            </TouchableOpacity>

            <Text style={{ color: colors.primary }} className="text-lg font-bold">Housing</Text>
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
              <View style={{ backgroundColor: colors.bgCard }} className="w-full h-64 items-center justify-center">
                <Text style={{ color: colors.textMuted }}>No image</Text>
              </View>
            )}

            <View style={{ backgroundColor: isDark ? "rgba(30, 27, 75, 0.9)" : "rgba(255, 255, 255, 0.9)" }} className="absolute top-4 left-4 px-3 py-1.5 rounded-full">
              <Text style={{ color: colors.primary }} className="text-[10px] font-black uppercase">
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
            <View style={{ backgroundColor: colors.primary }} className="w-2 h-2 rounded-full" />
            <Text style={{ color: colors.primary }} className="text-xs font-bold uppercase tracking-tighter">
              Status: {housing.availabilityStatus}
            </Text>
          </View>

          <View className="flex-row justify-between items-start gap-4">
            <Text style={{ color: colors.text }} className="text-3xl font-extrabold leading-tight flex-1">
              {housing.title}
            </Text>

            <Text style={{ color: colors.primary }} className="text-2xl font-black">
              LKR {housing.rentPrice}
            </Text>
          </View>

          <View className="mt-4 gap-y-2">
            <View style={{ backgroundColor: colors.bgCard }} className="flex-row items-center p-3 rounded-2xl self-start">
              <MapPin size={17} color={colors.primary} />
              <Text style={{ color: colors.textSecondary }} className="ml-2 text-sm font-medium">
                {housing.address}
              </Text>
            </View>

            {housing.availableFrom && (
              <View style={{ backgroundColor: colors.bgCard }} className="flex-row items-center p-3 rounded-2xl self-start">
                <Calendar size={17} color={colors.primary} />
                <Text style={{ color: colors.textSecondary }} className="ml-2 text-sm font-medium">
                  Available from{" "}
                  {new Date(housing.availableFrom).toLocaleDateString()}
                </Text>
              </View>
            )}

            {housing.deposit && (
              <View style={{ backgroundColor: colors.bgCard }} className="flex-row items-center p-3 rounded-2xl self-start">
                <Text style={{ color: colors.primary }} className="font-bold">Deposit</Text>
                <Text style={{ color: colors.textSecondary }} className="ml-2 text-sm font-medium">
                  LKR {housing.deposit}
                </Text>
              </View>
            )}
          </View>

          <View className="mt-6">
            <Text style={{ color: colors.text }} className="text-base font-bold mb-2">
              About
            </Text>

            <Text style={{ color: colors.textSecondary }} className="text-sm leading-5">
              {housing.description}
            </Text>
          </View>

          <View className="mt-6">
            <Text style={{ color: colors.text }} className="text-base font-bold mb-3">
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
                  style={{ backgroundColor: feature.value ? colors.primaryLight : colors.bgCard }}
                  className="px-4 py-3 rounded-2xl flex-row items-center"
                >
                  <feature.icon
                    size={18}
                    color={feature.value ? colors.primary : colors.textMuted}
                  />
                  <Text
                    style={{ color: feature.value ? colors.primary : colors.textSecondary }}
                    className="ml-2 text-xs font-bold"
                  >
                    {feature.label}
                  </Text>
                </View>
              ))}
            </View>
          </View>

          {housing.isMine ? (
            <View style={{ backgroundColor: colors.bgCard }} className="mx-5 my-6 p-6 rounded-[40px]">
              <Text style={{ color: colors.textMuted }} className="text-[10px] font-bold text-center tracking-[2px] mb-5 uppercase">
                Admin Controls
              </Text>

              <TouchableOpacity
                onPress={handleEdit}
                style={{ backgroundColor: colors.white, borderColor: colors.border, borderWidth: 1 }}
                className="w-full p-5 rounded-3xl items-center mb-3"
              >
                <Text style={{ color: colors.text }} className="font-bold">Edit Listing</Text>
              </TouchableOpacity>

              <TouchableOpacity
                onPress={handleDelete}
                style={{ backgroundColor: colors.white, borderColor: colors.border, borderWidth: 1 }}
                className="w-full p-5 rounded-3xl items-center"
              >
                <Text className="font-bold text-red-500">Remove Listing</Text>
              </TouchableOpacity>
            </View>
          ) : (
            <View className="mt-6">
              <Text style={{ color: colors.text }} className="text-base font-bold mb-3">
                Posted By
              </Text>

              <View style={{ backgroundColor: colors.bgCard }} className="rounded-[25px] p-5">
                <Text style={{ color: colors.text }} className="font-bold text-base mb-3">
                  {housing.contactName}
                </Text>

                <View className="flex-row gap-2">
                  {housing.contactPhone && (
                    <TouchableOpacity
                      onPress={() => handleContact("phone")}
                      style={{ backgroundColor: colors.primary }}
                      className="flex-1 rounded-2xl py-3 flex-row items-center justify-center"
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
                      style={{ backgroundColor: colors.primary }}
                      className="flex-1 rounded-2xl py-3 flex-row items-center justify-center"
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
          <View style={{ backgroundColor: colors.white }} className="rounded-[40px] w-full max-w-sm p-8 shadow-2xl">
            <Text style={{ color: colors.text }} className="text-2xl font-black mb-4">
              Contact Landlord
            </Text>

            <View className="gap-3">
              {housing.contactPhone && (
                <TouchableOpacity
                  onPress={() => {
                    handleContact("phone");
                    setContactModalVisible(false);
                  }}
                  style={{ backgroundColor: colors.primary }}
                  className="p-4 rounded-2xl flex-row items-center justify-between"
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
                  style={{ backgroundColor: colors.primary }}
                  className="p-4 rounded-2xl flex-row items-center justify-between"
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
              style={{ backgroundColor: colors.bgInput }}
              className="mt-4 p-4 rounded-2xl items-center"
            >
              <Text style={{ color: colors.text }} className="font-bold">Close</Text>
            </TouchableOpacity>
          </View>
        </TouchableOpacity>
      </Modal>
    </SafeAreaView>
  );
}