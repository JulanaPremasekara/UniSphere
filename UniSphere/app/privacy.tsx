import { useRouter } from "expo-router";
import { ChevronLeft, ShieldCheck, Lock, Eye, FileText, Globe } from "lucide-react-native";
import React from "react";
import { ScrollView, Text, TouchableOpacity, View, Platform } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

import Footer from "./components/Footer";

export default function PrivacyPolicy() {
  const router = useRouter();

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
    <SafeAreaView edges={["left", "right"]} className="flex-1 bg-white">
      {/* Fixed Header */}
      <View className="flex-row justify-between items-center px-6 pb-4 bg-white border-b border-gray-50" style={{ paddingTop: Platform.OS === 'ios' ? 20 : 60 }}>
        <TouchableOpacity onPress={() => router.back()} className="p-2 -ml-2 w-12 h-12 justify-center items-start">
          <ChevronLeft size={28} color="#1E1B4B" />
        </TouchableOpacity>
        <Text className="text-xl font-bold text-indigo-900">Privacy & Policy</Text>
        <View className="w-12" /> {/* Spacer */}
      </View>

      {/* Scrollable Content */}
      <ScrollView 
        showsVerticalScrollIndicator={false} 
        contentContainerStyle={{ paddingHorizontal: 24, paddingTop: 30, paddingBottom: 40 }}
      >
        <View className="bg-indigo-50/50 p-8 rounded-[40px] items-center mb-10 border border-indigo-100">
          <View className="bg-white p-6 rounded-[30px] shadow-sm">
            <ShieldCheck size={50} color="#4F46E5" strokeWidth={1.5} />
          </View>
          <Text className="text-2xl font-black text-gray-900 mt-6 text-center">Your Privacy Matters</Text>
          <Text className="text-gray-500 text-center mt-3 leading-6 font-medium">
            At UniSphere, we are committed to protecting your personal information and your right to privacy.
          </Text>
        </View>

        {sections.map((section, index) => (
          <View key={index} className="mb-8">
            <View className="flex-row items-center mb-4">
              <View className="bg-indigo-600 p-2 rounded-xl">
                <section.icon size={18} color="white" />
              </View>
              <Text className="ml-4 text-lg font-bold text-gray-900">{section.title}</Text>
            </View>
            <View className="bg-gray-50 p-6 rounded-[28px] border border-gray-100">
              <Text className="text-gray-600 leading-6 text-[15px] font-medium">
                {section.content}
              </Text>
            </View>
          </View>
        ))}

        <View className="mt-10 mb-2 items-center">
          <Text className="text-gray-400 text-xs font-bold uppercase tracking-widest">Last Updated: May 2026</Text>
        </View>
      </ScrollView>

      {/* Fixed Footer */}
      <Footer />
    </SafeAreaView>
  );
}
