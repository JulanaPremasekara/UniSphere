import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, ScrollView, Platform, KeyboardAvoidingView, Alert, ActivityIndicator, Modal } from 'react-native';
import { useRouter } from 'expo-router';
import { Button, ButtonText, ButtonSpinner } from '@/components/ui/button';
import { ChevronLeft, GraduationCap, Trash2 } from 'lucide-react-native';
import { UpdateProfileForm } from './components/UpdateProfileForm';
import apiClient from './services/api';
import { AppStorage } from './services/storage';

export default function UpdateProfile() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [fetchingUser, setFetchingUser] = useState(true);
  const [showError, setShowError] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [deleteModalVisible, setDeleteModalVisible] = useState(false);


  const [formData, setFormData] = useState({
    name: '',
    email: '',
    year: '',
    major: '',
    password: '',
    confirmPassword: ''
  });

  useEffect(() => {
    fetchUserData();
  }, []);

  const fetchUserData = async () => {
    try {
      const response = await apiClient.get('/users/me');
      if (response.data.success) {
        const u = response.data.user;
        setFormData({
          name: u.name || '',
          email: u.email || '',
          year: u.year || '',
          major: u.major || '',
          password: '',
          confirmPassword: ''
        });
      }
    } catch (error) {
      console.error("Error fetching user data:", error);
      setErrorMessage("Failed to load user profile");
    } finally {
      setFetchingUser(false);
    }
  };

  const handleUpdate = async () => {
    const passwordsMatch = formData.password === formData.confirmPassword;
    const isPasswordValid = !formData.password || formData.password.length >= 6;

    if (!isPasswordValid || !passwordsMatch) {
      setShowError(true);
      return;
    }

    setShowError(false);
    setIsLoading(true);
    setErrorMessage(null);

    try {
      const response = await apiClient.put('/users/update', {
        name: formData.name,
        year: formData.year,
        major: formData.major,
        password: formData.password || undefined // Only send password if changed
      });
      
      if (response.data.success) {
        setSuccessMessage("Profile updated successfully!");
        console.log(">>> Profile updated successfully.");
        
        // Only show native Alert on non-web platforms
        if (Platform.OS !== 'web') {
          Alert.alert(
            "Success", 
            "Profile updated successfully!",
            [{ text: "OK", onPress: () => router.back() }]
          );
        } else {
          // On web, simply navigate back after a short delay so they can see the banner
          setTimeout(() => {
            router.back();
          }, 1500);
        }
      }
    } catch (error: any) {
      const msg = error.response?.data?.message || "Update failed. Check your network.";
      setErrorMessage(msg);
      console.error("Update Error:", msg);
    } finally {
      setIsLoading(false);
    }
  };

  const handleDeleteAccount = () => {
    console.log(">>> Account deletion icon pressed");
    setDeleteModalVisible(true);
  };

  const confirmDelete = async () => {
    try {
      console.log(">>> Performing account deletion...");
      const response = await apiClient.delete('/users');
      if (response.data.success) {
        setDeleteModalVisible(false);
        await AppStorage.removeItem('userToken');
        router.replace('/login');
      }
    } catch (error: any) {
      const msg = error.response?.data?.message || "Could not delete account.";
      console.error("Delete Account Error:", msg);
      Alert.alert("Error", msg);
      setDeleteModalVisible(false);
    }
  };

  if (fetchingUser) {
    return (
      <View className="flex-1 justify-center items-center bg-white">
        <ActivityIndicator size="large" color="#4F46E5" />
      </View>
    );
  }

  return (
    <KeyboardAvoidingView 
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'} 
      className="flex-1 bg-white"
    >
      <ScrollView 
        className="flex-1" 
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ flexGrow: 1, paddingBottom: 60 }}
      >
        <View className="px-8" style={{ paddingTop: Platform.OS === 'ios' ? 70 : 60 }}>
          
          {/* Header */}
          <View className="flex-row justify-between items-center mb-6">
            <TouchableOpacity onPress={() => router.back()} className="p-2 -ml-2 w-12">
              <ChevronLeft size={28} color="#1E1B4B" />
            </TouchableOpacity>
            
            <TouchableOpacity 
              onPress={handleDeleteAccount}
              className="bg-red-50 p-3 rounded-2xl"
            >
              <Trash2 size={24} color="#EF4444" />
            </TouchableOpacity>
          </View>

          {/* Branding */}
          <View className="flex-row items-center mb-10">
            <View className="bg-indigo-600 p-3 rounded-2xl mr-4 shadow-sm">
              <GraduationCap size={28} color="white" />
            </View>
            <View>
              <Text className="text-2xl font-black text-indigo-900">Edit Profile</Text>
              <Text className="text-gray-400 font-medium">Update your account details</Text>
            </View>
          </View>

          {/* --- Success MESSAGE --- */}
          {successMessage && (
            <View className="bg-emerald-50 border border-emerald-200 p-4 rounded-2xl mb-4 flex-row items-center">
              <Text className="text-emerald-700 font-bold flex-1 text-center">{successMessage}</Text>
            </View>
          )}

          {/* Form Container */}
          <View>
            <UpdateProfileForm 
              formData={formData} 
              setFormData={setFormData} 
              showError={showError} 
              errorMessage={errorMessage}
            />
          </View>

          <View className="mt-12 mb-8">
            <Button 
              onPress={handleUpdate}
              disabled={isLoading}
              className="h-16 rounded-[25px] shadow-md shadow-indigo-200"
              style={{ backgroundColor: '#4F46E5' }}
            >
              {isLoading ? <ButtonSpinner className="mr-2" /> : null}
              <ButtonText className="font-bold text-lg" style={{ color: 'white' }}>Update Changes</ButtonText>
            </Button>
          </View>

          <Text className="text-center text-gray-400 text-sm mb-6">
            UniSphere Account Management
          </Text>
        </View>
      </ScrollView>
      
      {/* CUSTOM DELETE CONFIRMATION MODAL */}
      <Modal
        animationType="fade"
        transparent={true}
        visible={deleteModalVisible}
        onRequestClose={() => setDeleteModalVisible(false)}
      >
        <TouchableOpacity 
          activeOpacity={1} 
          onPress={() => setDeleteModalVisible(false)} 
          className="flex-1 bg-black/60 justify-center items-center px-6"
        >
          <View className="bg-white rounded-[40px] w-full max-w-sm p-8 shadow-2xl items-center">
            <View className="bg-red-50 p-6 rounded-full mb-6">
              <Trash2 size={40} color="#EF4444" />
            </View>
            <Text className="text-2xl font-black text-gray-900 mb-2">Delete Account?</Text>
            <Text className="text-gray-500 text-center text-lg mb-8 leading-relaxed">
              This will permanently remove your UniSphere account and all associated data. This action cannot be undone.
            </Text>
            
            <View className="flex-row gap-4 w-full">
              <TouchableOpacity 
                onPress={() => setDeleteModalVisible(false)}
                className="flex-1 bg-gray-50 p-5 rounded-3xl"
              >
                <Text className="text-gray-900 font-bold text-center text-lg">Cancel</Text>
              </TouchableOpacity>
              
              <TouchableOpacity 
                onPress={confirmDelete}
                className="flex-1 bg-red-600 p-5 rounded-3xl shadow-lg shadow-red-200"
              >
                <Text className="text-white font-bold text-center text-lg">Delete</Text>
              </TouchableOpacity>
            </View>
          </View>
        </TouchableOpacity>
      </Modal>
    </KeyboardAvoidingView>
  );
}
