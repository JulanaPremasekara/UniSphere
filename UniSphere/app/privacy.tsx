import { useRouter } from "expo-router";
import { ChevronLeft, ShieldCheck, Lock, Eye, FileText, Globe } from "lucide-react-native";
import React from "react";
import { ScrollView, Text, TouchableOpacity, View, Platform } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

import Footer from "@/components/Footer";
import { useTheme } from "@/context/ThemeContext";

export default function PrivacyPolicy() {
  const router = useRouter();
  const { colors } = useTheme();

  const sections = [
    {
      title: "Data Collection",
      icon: Eye,
      content: "UniSphere collects minimal data necessary to provide our campus hub services. This includes your student email, name, and profile information you choose to share with the community."
    },
    {
      title: "Information Usage",
      icon: Globe,
      content: "Your data is used to facilitate event registrations, marketplace connections, and study group interactions. We do not sell your personal information to third parties."
    },
    {
      title: "Security Measures",
      icon: Lock,
      content: "We implement industry-standard security protocols to protect your data. This includes encrypted storage for passwords and secure communication channels for all API requests."
    },
    {
      title: "Your Rights",
      icon: ShieldCheck,
      content: "You have the right to access, update, or delete your profile information at any time. For full account deletion requests, please contact our support team."
    },
    {
      title: "Policy Updates",
      icon: FileText,
      content: "We may update this privacy policy from time to time to reflect changes in our services. Users will be notified of any significant changes via the app."
    }
  ];

  return (
    <SafeAreaView edges={["left", "right"]} style={{ backgroundColor: colors.bg }} className="flex-1">
      <View
        style={{ backgroundColor: colors.bg, borderBottomColor: colors.border, borderBottomWidth: 1, paddingTop: Platform.OS === "ios" ? 20 : 60 }}
        className="flex-row justify-between items-center px-6 pb-4"
      >
        <TouchableOpacity onPress={() => router.back()} className="p-2 -ml-2 w-12 h-12 justify-center items-start">
          <ChevronLeft size={28} color={colors.text} />
        </TouchableOpacity>
        <Text style={{ color: colors.text }} className="text-xl font-bold">Privacy &amp; Policy</Text>
        <View className="w-12" />
      </View>

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingHorizontal: 24, paddingTop: 30, paddingBottom: 40 }}
        style={{ backgroundColor: colors.bg }}
      >
        <View style={{ backgroundColor: colors.primaryLight, borderColor: colors.border, borderWidth: 1 }} className="p-8 rounded-[40px] items-center mb-10">
          <View style={{ backgroundColor: colors.white }} className="p-6 rounded-[30px] shadow-sm">
            <ShieldCheck size={50} color={colors.primary} strokeWidth={1.5} />
          </View>
          <Text style={{ color: colors.text }} className="text-2xl font-black mt-6 text-center">Your Privacy Matters</Text>
          <Text style={{ color: colors.textSecondary }} className="text-center mt-3 leading-6 font-medium">
            At UniSphere, we are committed to protecting your personal information and your right to privacy.
          </Text>
        </View>

        {sections.map((section, index) => (
          <View key={index} className="mb-8">
            <View className="flex-row items-center mb-4">
              <View style={{ backgroundColor: colors.primary }} className="p-2 rounded-xl">
                <section.icon size={18} color="white" />
              </View>
              <Text style={{ color: colors.text }} className="ml-4 text-lg font-bold">{section.title}</Text>
            </View>
            <View style={{ backgroundColor: colors.bgCard, borderColor: colors.border, borderWidth: 1 }} className="p-6 rounded-[28px]">
              <Text style={{ color: colors.textSecondary }} className="leading-6 text-[15px] font-medium">
                {section.content}
              </Text>
            </View>
          </View>
        ))}

        <View className="mt-10 mb-2 items-center">
          <Text style={{ color: colors.textMuted }} className="text-xs font-bold uppercase tracking-widest">Last Updated: May 2026</Text>
        </View>
      </ScrollView>

      <Footer />
    </SafeAreaView>
  );
}
