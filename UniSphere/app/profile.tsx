import { Box } from '@/components/ui/box';
import { VStack } from '@/components/ui/vstack';
import { useFocusEffect, useRouter } from 'expo-router';
import { Camera, Bell, Calendar, ChevronLeft, ChevronRight, CircleUserRound, GraduationCap, LogOut, Mail, Settings, ShieldCheck, Users, RefreshCw } from 'lucide-react-native';
import React, { useState } from 'react';
import { ActivityIndicator, Platform, ScrollView, Text, TouchableOpacity, View, Image, Alert, Switch } from 'react-native';
import * as ImagePicker from 'expo-image-picker';

import Footer from '@/components/Footer';
import { useProfile } from '@/hooks/useProfile';
import { useTheme } from '@/context/ThemeContext';
import { checkForAppUpdates } from '@/utils/updateChecker';

export default function Profile() {
  const router = useRouter();
  const { user, loading, isUpdating, logout, refreshProfile, updateProfile, deleteProfileImage } = useProfile();
  const { isDark, colors, toggleTheme } = useTheme();

  const handleImagePick = async () => {
    const permission = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (!permission.granted) {
      Alert.alert("Permission Required", "Please allow access to your photo library to update your profile picture.");
      return;
    }

    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [1, 1],
      quality: 0.7,
    });

    if (!result.canceled && result.assets[0]) {
      const success = await updateProfile({
        name: user.name,
        phone: user.phone,
        year: user.year,
        major: user.major
      }, result.assets[0], false);
      
      if (success) {
        refreshProfile();
      }
    }
  };

  const handleDeleteImage = async () => {
    Alert.alert("Remove Photo", "Are you sure you want to remove your profile photo?", [
      { text: "Cancel", style: "cancel" },
      { text: "Remove", style: "destructive", onPress: async () => {
        await deleteProfileImage();
        refreshProfile();
      }}
    ]);
  };

  useFocusEffect(React.useCallback(() => { refreshProfile(); }, [refreshProfile]));

  if (loading) return (
    <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: colors.bg }}>
      <ActivityIndicator size="large" color={colors.primary} />
    </View>
  );

  if (!user) return (
    <View style={{ flex: 1, backgroundColor: colors.bg }}>
      <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center', paddingHorizontal: 40 }}>
        <View style={{ backgroundColor: colors.primaryLight, padding: 40, borderRadius: 50, marginBottom: 32 }}>
          <CircleUserRound size={100} color={colors.primary} strokeWidth={1} />
        </View>
        <Text style={{ fontSize: 28, fontWeight: '900', color: colors.text, textAlign: 'center', marginBottom: 12 }}>Hello there!</Text>
        <Text style={{ color: colors.textMuted, textAlign: 'center', fontSize: 18, lineHeight: 24, marginBottom: 40 }}>
          Please sign in to your UniSphere account to view and manage your profile details.
        </Text>
        <TouchableOpacity
          onPress={() => router.push('/login')}
          style={{ backgroundColor: colors.primary, width: '100%', height: 64, borderRadius: 25, alignItems: 'center', justifyContent: 'center' }}
        >
          <Text style={{ color: 'white', fontWeight: 'bold', fontSize: 18 }}>Sign In Now</Text>
        </TouchableOpacity>
      </View>
      <Footer />
    </View>
  );

  const avatarUri = user.image
    ? user.image.startsWith('http') ? user.image : `${process.env.EXPO_PUBLIC_API_URL}${user.image}`
    : null;

  return (
    <View style={{ flex: 1, backgroundColor: colors.bg }}>
      {/* Header */}
      <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingHorizontal: 24, paddingBottom: 16, backgroundColor: colors.navBg, paddingTop: Platform.OS === 'ios' ? 70 : 60, borderBottomWidth: 1, borderBottomColor: colors.navBorder }}>
        <TouchableOpacity onPress={() => router.back()} style={{ padding: 8, marginLeft: -8, width: 48, height: 48, justifyContent: 'center', alignItems: 'flex-start' }}>
          <ChevronLeft size={28} color={colors.text} />
        </TouchableOpacity>
        <Text style={{ fontSize: 20, fontWeight: 'bold', color: colors.primary }}>My Profile</Text>
        <TouchableOpacity onPress={() => router.push('/update-profile')} style={{ backgroundColor: colors.bgInput, padding: 8, borderRadius: 999 }}>
          <Settings size={22} color={colors.text} />
        </TouchableOpacity>
      </View>

      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingBottom: 140 }}>
        {/* Avatar */}
        <View style={{ alignItems: 'center', marginTop: 24 }}>
          <View style={{ position: 'relative' }}>
            <TouchableOpacity onPress={handleImagePick} onLongPress={user.image ? handleDeleteImage : undefined} activeOpacity={0.9}>
              <View style={{ backgroundColor: colors.primaryLight, padding: 4, borderRadius: 45, borderWidth: 2, borderColor: colors.border }}>
                <View style={{ backgroundColor: colors.white, width: 128, height: 128, borderRadius: 40, alignItems: 'center', justifyContent: 'center', overflow: 'hidden' }}>
                  {avatarUri ? (
                    <Image source={{ uri: avatarUri }} style={{ width: '100%', height: '100%' }} />
                  ) : (
                    <CircleUserRound size={80} color={colors.primary} strokeWidth={1.5} />
                  )}
                  {isUpdating && (
                    <View style={{ position: 'absolute', top: 0, left: 0, right: 0, bottom: 0, backgroundColor: 'rgba(0,0,0,0.3)', alignItems: 'center', justifyContent: 'center' }}>
                      <ActivityIndicator color="white" />
                    </View>
                  )}
                </View>
              </View>
              <View style={{ position: 'absolute', bottom: 8, right: 8, backgroundColor: colors.primary, padding: 10, borderRadius: 16, borderWidth: 2, borderColor: colors.navBg }}>
                <Camera size={18} color="white" />
              </View>
            </TouchableOpacity>
          </View>
          <Text style={{ fontSize: 28, fontWeight: '900', color: colors.text, marginTop: 20 }}>{user?.name || 'User'}</Text>
          <View style={{ flexDirection: 'row', alignItems: 'center', marginTop: 8, backgroundColor: colors.bgInput, paddingHorizontal: 16, paddingVertical: 6, borderRadius: 999, borderWidth: 1, borderColor: colors.border }}>
            <GraduationCap size={16} color={colors.primary} />
            <Text style={{ color: colors.textMuted, fontWeight: 'bold', marginLeft: 8, fontSize: 12, textTransform: 'uppercase', letterSpacing: 2 }}>{user?.major || 'Student'} • Year {user?.year || 'N/A'}</Text>
          </View>
        </View>

        {/* Stats */}
        <View style={{ paddingHorizontal: 24, marginTop: 40 }}>
          <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', backgroundColor: colors.bgCard, padding: 24, borderRadius: 32, borderWidth: 1, borderColor: colors.border }}>
            <View style={{ alignItems: 'center', flex: 1 }}>
              <Text style={{ fontSize: 24, fontWeight: '900', color: colors.primary }}>{user?.groupCount || 0}</Text>
              <Text style={{ color: colors.textMuted, fontSize: 10, fontWeight: 'bold', textTransform: 'uppercase', letterSpacing: 2, marginTop: 4 }}>Groups</Text>
            </View>
            <View style={{ width: 1, height: 40, backgroundColor: colors.border }} />
            <View style={{ alignItems: 'center', flex: 1 }}>
              <Text style={{ fontSize: 24, fontWeight: '900', color: colors.primary }}>{user?.eventCount || 0}</Text>
              <Text style={{ color: colors.textMuted, fontSize: 10, fontWeight: 'bold', textTransform: 'uppercase', letterSpacing: 2, marginTop: 4 }}>Events</Text>
            </View>
            <View style={{ width: 1, height: 40, backgroundColor: colors.border }} />
            <View style={{ alignItems: 'center', flex: 1 }}>
              <Text style={{ fontSize: 24, fontWeight: '900', color: colors.primary }}>
                {user?.year ? new Date().getFullYear() + (4 - parseInt(user.year.match(/\d+/)?.[0] || "0")) : "N/A"}
              </Text>
              <Text style={{ color: colors.textMuted, fontSize: 10, fontWeight: 'bold', textTransform: 'uppercase', letterSpacing: 2, marginTop: 4 }}>Graduation</Text>
            </View>
          </View>
        </View>

        {/* Activity & Security */}
        <View style={{ paddingHorizontal: 24, marginTop: 48 }}>
          <Text style={{ color: colors.textMuted, fontWeight: 'bold', fontSize: 11, textTransform: 'uppercase', letterSpacing: 2, marginLeft: 16, marginBottom: 20 }}>
            Activity &amp; Security
          </Text>
          <VStack space="md">
            <ProfileMenuItem icon={Users} label="Joined Study Groups" onPress={() => router.push("/studyGroup/joined")} colors={colors} />
            <ProfileMenuItem icon={Calendar} label="Registered Events" onPress={() => router.push("/events/registrations")} colors={colors} />
            <ProfileMenuItem icon={ShieldCheck} label="Privacy & Security" onPress={() => router.push("./privacy")} colors={colors} />

            {/* Dark Mode Toggle */}
            <TouchableOpacity
              activeOpacity={0.8}
              style={{ flexDirection: 'row', alignItems: 'center', backgroundColor: colors.bgCard, padding: 20, borderRadius: 28, borderWidth: 1, borderColor: colors.border, marginBottom: 8 }}
            >
              <View style={{ backgroundColor: colors.white, padding: 12, borderRadius: 16 }}>
                <Bell size={22} color={colors.primary} />
              </View>
              <View style={{ flex: 1, marginLeft: 16 }}>
                <Text style={{ fontWeight: 'bold', color: colors.text, fontSize: 16 }}>Dark Mode</Text>
                <Text style={{ color: colors.textMuted, fontSize: 12, marginTop: 4, fontWeight: '500' }}>
                  {isDark ? 'Dark theme enabled' : 'Light theme enabled'}
                </Text>
              </View>
              <Switch
                value={isDark}
                onValueChange={toggleTheme}
                trackColor={{ false: '#E5E7EB', true: '#6366F1' }}
                thumbColor={isDark ? '#ffffff' : '#f3f4f6'}
                ios_backgroundColor="#E5E7EB"
              />
            </TouchableOpacity>

            <ProfileMenuItem icon={Mail} label="Email Address" value={user?.email || "No email provided"} colors={colors} />
            <ProfileMenuItem icon={RefreshCw} label="Check for Updates" onPress={() => checkForAppUpdates()} colors={colors} />

            <TouchableOpacity
              onPress={logout}
              style={{ flexDirection: 'row', alignItems: 'center', backgroundColor: isDark ? 'rgba(239,68,68,0.15)' : '#FEF2F2', padding: 20, borderRadius: 28, marginTop: 32, borderWidth: 1, borderColor: isDark ? 'rgba(239,68,68,0.3)' : '#FEE2E2' }}
            >
              <LogOut size={22} color="#EF4444" />
              <Text style={{ marginLeft: 16, fontWeight: 'bold', color: '#EF4444', fontSize: 18 }}>Log Out</Text>
            </TouchableOpacity>
          </VStack>
        </View>
      </ScrollView>
      <Footer />
    </View>
  );
}

function ProfileMenuItem({ icon: IconComp, label, value, onPress, colors }: { icon: any; label: string; value?: string; onPress?: () => void; colors: any }) {
  return (
    <TouchableOpacity
      onPress={onPress}
      style={{ flexDirection: 'row', alignItems: 'center', backgroundColor: colors.bgCard, padding: 20, borderRadius: 28, borderWidth: 1, borderColor: colors.border, marginBottom: 8 }}
    >
      <View style={{ backgroundColor: colors.white, padding: 12, borderRadius: 16 }}>
        <IconComp size={22} color={colors.primary} />
      </View>
      <View style={{ flex: 1, marginLeft: 16 }}>
        <Text style={{ fontWeight: 'bold', color: colors.text, fontSize: 16 }}>{label}</Text>
        {value && <Text style={{ color: colors.textMuted, fontSize: 12, marginTop: 4, fontWeight: '500' }}>{value}</Text>}
      </View>
      {label !== "Email Address" && <ChevronRight size={20} color={colors.textMuted} />}
      {label !== "Check for Updates" && <ChevronRight size={20} color={colors.textMuted} />}
    </TouchableOpacity>
  );
}
