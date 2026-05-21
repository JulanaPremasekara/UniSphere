import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, ScrollView, Platform, KeyboardAvoidingView, ActivityIndicator, Modal } from 'react-native';
import { useRouter } from 'expo-router';
import { Button, ButtonText, ButtonSpinner } from '@/components/ui/button';
import { ChevronLeft, GraduationCap, Trash2 } from 'lucide-react-native';
import UpdateProfileForm from '@/components/UpdateProfileForm';
import { useProfile } from '@/hooks/useProfile';
import { useTheme } from '@/context/ThemeContext';

export default function UpdateProfile() {
  const router = useRouter();
  const { user, loading, isUpdating, errorMessage, successMessage, updateProfile, deleteAccount } = useProfile();
  const [showError, setShowError] = useState(false);
  const [deleteModalVisible, setDeleteModalVisible] = useState(false);
  const [formData, setFormData] = useState({ name: '', email: '', phone: '', year: '', major: '', password: '', confirmPassword: '' });
  const { colors } = useTheme();

  useEffect(() => {
    if (user) setFormData({ name: user.name || '', email: user.email || '', phone: user.phone || '', year: user.year || '', major: user.major || '', password: '', confirmPassword: '' });
  }, [user]);

  const handleUpdate = async () => {
    const success = await updateProfile(formData);
    if (!success && !errorMessage) setShowError(true);
  };

  if (loading) return <View style={{ backgroundColor: colors.bg }} className="flex-1 justify-center items-center"><ActivityIndicator size="large" color={colors.primary} /></View>;

  return (
    <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : 'height'} style={{ backgroundColor: colors.bg }} className="flex-1">
      <ScrollView className="flex-1" showsVerticalScrollIndicator={false} contentContainerStyle={{ flexGrow: 1, paddingBottom: 60 }}>
        <View className="px-8" style={{ paddingTop: Platform.OS === 'ios' ? 70 : 60 }}>
          <View className="flex-row justify-between items-center mb-6">
            <TouchableOpacity onPress={() => router.back()} className="p-2 -ml-2 w-12"><ChevronLeft size={28} color={colors.text} /></TouchableOpacity>
            <TouchableOpacity onPress={() => setDeleteModalVisible(true)} style={{ backgroundColor: 'rgba(239, 68, 68, 0.15)' }} className="p-3 rounded-2xl"><Trash2 size={24} color="#EF4444" /></TouchableOpacity>
          </View>

          <View className="flex-row items-center mb-10">
            <View style={{ backgroundColor: colors.primaryLight }} className="p-3 rounded-2xl mr-4 shadow-sm"><GraduationCap size={28} color={colors.primary} /></View>
            <View>
              <Text style={{ color: colors.text }} className="text-2xl font-black">Edit Profile</Text>
              <Text style={{ color: colors.textSecondary }} className="font-medium">Update your account details</Text>
            </View>
          </View>

          {successMessage && (
            <View className="bg-emerald-50 border border-emerald-200 p-4 rounded-2xl mb-4 flex-row items-center">
              <Text className="text-emerald-700 font-bold flex-1 text-center">{successMessage}</Text>
            </View>
          )}

          <UpdateProfileForm formData={formData} setFormData={setFormData} showError={showError} errorMessage={errorMessage} />

          <View className="mt-12 mb-8">
            <Button onPress={handleUpdate} disabled={isUpdating} className="h-16 rounded-[25px] shadow-md" style={{ backgroundColor: colors.primary }}>
              {isUpdating && <ButtonSpinner className="mr-2" />}
              <ButtonText className="font-bold text-lg" style={{ color: 'white' }}>Update Changes</ButtonText>
            </Button>
          </View>

          <Text style={{ color: colors.textMuted }} className="text-center text-sm mb-6">UniSphere Account Management</Text>
        </View>
      </ScrollView>

      <Modal animationType="fade" transparent={true} visible={deleteModalVisible} onRequestClose={() => setDeleteModalVisible(false)}>
        <TouchableOpacity activeOpacity={1} onPress={() => setDeleteModalVisible(false)} className="flex-1 bg-black/60 justify-center items-center px-6">
          <View style={{ backgroundColor: colors.white }} className="rounded-[40px] w-full max-w-sm p-8 shadow-2xl items-center">
            <View style={{ backgroundColor: 'rgba(239, 68, 68, 0.15)' }} className="p-6 rounded-full mb-6"><Trash2 size={40} color="#EF4444" /></View>
            <Text style={{ color: colors.text }} className="text-2xl font-black mb-2">Delete Account?</Text>
            <Text style={{ color: colors.textSecondary }} className="text-center text-lg mb-8 leading-relaxed">This will permanently remove your UniSphere account and all associated data. This action cannot be undone.</Text>
            <View className="flex-row gap-4 w-full">
              <TouchableOpacity onPress={() => setDeleteModalVisible(false)} style={{ backgroundColor: colors.bgInput }} className="flex-1 p-5 rounded-3xl"><Text style={{ color: colors.text }} className="font-bold text-center text-lg">Cancel</Text></TouchableOpacity>
              <TouchableOpacity onPress={async () => { await deleteAccount(); setDeleteModalVisible(false); }} className="flex-1 bg-red-600 p-5 rounded-3xl shadow-lg"><Text className="text-white font-bold text-center text-lg">Delete</Text></TouchableOpacity>
            </View>
          </View>
        </TouchableOpacity>
      </Modal>
    </KeyboardAvoidingView>
  );
}

