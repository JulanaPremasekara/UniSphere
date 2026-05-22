import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  Image,
  ActivityIndicator,
  Modal,
} from "react-native";
import {
  ShoppingBasket,
  Users,
  Calendar,
  GraduationCap,
  Bookmark,
  BookOpen,
  HomeIcon,
  HelpCircle,
} from "lucide-react-native";
import { useRouter } from "expo-router";
import { SafeAreaView, useSafeAreaInsets } from "react-native-safe-area-context";

import Footer from "@/components/Footer";
import AppHeader from "@/components/AppHeader";
import { useEvents } from "@/app/events/hooks/useEvents";
import { AppStorage } from "@/services/storage";
import GlobalSearch from "@/components/GlobalSearch";
import { useTheme } from "@/context/ThemeContext";

const categories = [
  {
    name: "Marketplace",
    icon: ShoppingBasket,
    color: "#EEF2FF",
    iconColor: "#4338CA",
    route: "/marketplace",
  },
  {
    name: "Study Groups",
    icon: Users,
    color: "#F5F3FF",
    iconColor: "#5B21B6",
    route: "/studyGroup",
  },
  {
    name: "Events",
    icon: Calendar,
    color: "#F0F9FF",
    iconColor: "#0369A1",
    route: "/events",
  },
  {
    name: "Lost &\n Found",
    icon: HelpCircle,
    color: "#FFF7ED",
    iconColor: "#C2410C",
    route: "/lost",
  },
  {
    name: "Housing",
    icon: HomeIcon,
    color: "#ECFDF5",
    iconColor: "#047857",
    route: "/housing",
  },
  {
    name: "Tutors",
    icon: BookOpen,
    color: "#FEF2F2",
    iconColor: "#B91C1C",
    route: "/tutors",
  },
];

export default function Home() {
  const insets = useSafeAreaInsets();
  const router = useRouter();
  const { events, loading } = useEvents();
  const { isDark, colors } = useTheme();

  const [showWelcome, setShowWelcome] = useState(false);
  const [searchActive, setSearchActive] = useState(false);
  const footerPadding = Math.max(insets.bottom, 16);
  const totalFooterHeight = 70 + footerPadding;

  useEffect(() => {
    const checkUser = async () => {
      const token = await AppStorage.getItem("userToken");
      const hasSeenWelcome = await AppStorage.getItem("hasSeenWelcome");

      if (!token && !hasSeenWelcome) {
        setShowWelcome(true);
        await AppStorage.setItem("hasSeenWelcome", "true");

        setTimeout(() => {
          setShowWelcome(false);
          router.replace("/login");
        }, 3000);
      }
    };

    checkUser();
  }, []);

  const renderHeader = () => (
    <View>
      <AppHeader title="UniSphere" subtitle="Campus Connection" />
    </View>
  );

  const FeaturedEventCard = ({ event, onPress }: any) => (
    <TouchableOpacity
      onPress={onPress}
      activeOpacity={0.9}
      style={{
        width: 300,
        backgroundColor: colors.white,
        borderRadius: 35,
        borderWidth: 1,
        borderColor: colors.border,
        marginRight: 20,
        overflow: "hidden",
      }}
    >
      <Image
        source={{
          uri:
            event.image ||
            "https://images.unsplash.com/photo-1501281668745-f7f57925c3b4?q=80&w=1000",
        }}
        className="w-full h-48"
      />

      <View className="p-5">
        <View className="flex-row justify-between items-center mb-2">
          <View style={{ backgroundColor: colors.primaryLight }} className="px-3 py-1 rounded-full">
            <Text style={{ color: colors.primary }} className="text-[10px] font-bold uppercase tracking-wider">
              {event.month} {event.day}
            </Text>
          </View>

          <Bookmark size={18} color={colors.primary} />
        </View>

        <Text
          style={{ color: colors.text }}
          className="text-lg font-bold mb-1"
          numberOfLines={1}
        >
          {event.title}
        </Text>

        <Text style={{ color: colors.textSecondary }} className="text-xs leading-4" numberOfLines={2}>
          Hosted by {event.organizer} • {event.location}
        </Text>
      </View>
    </TouchableOpacity>
  );

  return (
    <SafeAreaView edges={["top"]} style={{ flex: 1, backgroundColor: colors.bg }}>
      <View className="flex-1">
        {renderHeader()}

        <GlobalSearch onSearchActiveChange={setSearchActive} />

        <ScrollView
          scrollEnabled={!searchActive}
          showsVerticalScrollIndicator={false}
          contentContainerStyle={{
            paddingTop: 8,
            // Add the total footer height + some breathing room (e.g., 20px)
            paddingBottom: totalFooterHeight + 20, 
          }}
        >
          <View className="flex-row flex-wrap justify-between px-5 mt-2">
            {categories.map((item, index) => (
              <TouchableOpacity
                key={index}
                style={{
                  backgroundColor: isDark ? colors.bgCard : item.color,
                  borderWidth: isDark ? 1 : 0,
                  borderColor: colors.border,
                }}
                onPress={() => router.push(item.route as any)}
                className="w-[47%] aspect-square rounded-[40px] items-center justify-center mb-4"
              >
                <View style={{ backgroundColor: isDark ? colors.white : "#ffffff" }} className="p-3 rounded-2xl mb-2 shadow-sm">
                  <item.icon size={29} color={isDark ? colors.primary : item.iconColor} />
                </View>

                <Text style={{ color: colors.text }} className="font-bold text-[14px] text-center px-2 leading-[16px]">
                  {item.name}
                </Text>
              </TouchableOpacity>
            ))}
          </View>

          <View style={{ marginTop: -60 }} className="px-6 flex-row justify-between items-end">
            <Text style={{ color: colors.text }} className="text-2xl font-bold">
              Featured Events
            </Text>

            <TouchableOpacity onPress={() => router.push("/events")}>
              <Text style={{ color: colors.primary }} className="font-bold text-base">
                View all
              </Text>
            </TouchableOpacity>
          </View>

          <ScrollView
            horizontal
            scrollEnabled={!searchActive}
            showsHorizontalScrollIndicator={false}
            className="mt-2 pl-6"
            contentContainerStyle={{ paddingRight: 24 }}
          >
            {loading ? (
              <View className="w-[300px] h-64 items-center justify-center">
                <ActivityIndicator size="large" color={colors.primary} />
              </View>
            ) : (
              events.slice(0, 5).map((event: any) => (
                <FeaturedEventCard
                  key={event.id}
                  event={event}
                  onPress={() => router.push(`/events/${event.id}`)}
                />
              ))
            )}

            {!loading && events.length === 0 && (
              <View style={{ backgroundColor: colors.bgCard, borderColor: colors.border }} className="w-[300px] h-64 rounded-[35px] border border-dashed items-center justify-center">
                <Calendar size={32} color={colors.textMuted} />

                <Text style={{ color: colors.textMuted }} className="font-bold mt-2">
                  No featured events
                </Text>
              </View>
            )}
          </ScrollView>
        </ScrollView>

        <Footer />

        <Modal visible={showWelcome} animationType="fade" transparent={false}>
          <View style={{ backgroundColor: colors.bg }} className="flex-1 items-center justify-center px-10">
            <View style={{ backgroundColor: colors.primaryLight }} className="p-10 rounded-[45px] mb-10 shadow-sm">
              <GraduationCap size={100} color={colors.primary} strokeWidth={1.5} />
            </View>

            <Text style={{ color: colors.text }} className="text-4xl font-black text-center mb-5">
              Welcome to UniSphere
            </Text>

            <Text style={{ color: colors.textSecondary }} className="text-center text-lg leading-relaxed font-medium px-4">
              Your all-in-one campus hub for events, marketplace, and community
              connections.
            </Text>

            <View className="absolute bottom-20 items-center">
              <ActivityIndicator color={colors.primary} size="large" />

              <Text style={{ color: colors.primary }} className="mt-6 font-bold uppercase tracking-[3px] text-[10px] text-center">
                Initializing your experience
              </Text>
            </View>
          </View>
        </Modal>
      </View>
    </SafeAreaView>
  );
}