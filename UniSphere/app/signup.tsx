import React, { useState } from 'react';
import { View, Text, TouchableOpacity, ScrollView, Platform, KeyboardAvoidingView } from 'react-native';
import { useRouter } from 'expo-router';
import { Button, ButtonText, ButtonSpinner } from '@/components/ui/button';
import { ChevronLeft, GraduationCap } from 'lucide-react-native';
import { SignUpForm } from './components/SignUpForm';
import apiClient from './services/api';

export default function SignUp() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [showError, setShowError] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    year: '',
    major: '',
    password: '',
    confirmPassword: ''
  });

  const handleSignUp = async () => {
    // 1. Local Validation Errors
    const passwordsMatch = formData.password === formData.confirmPassword;
    const isEmailValid = formData.email.includes('@');
    const isPasswordValid = formData.password.length >= 6;

    if (!isEmailValid || !isPasswordValid || !passwordsMatch) {
      setShowError(true);
      setErrorMessage(null); // Clear server error if local validation fails
      return;
    }

    setShowError(false);
    setIsLoading(true);
    setErrorMessage(null);

    try {
      const response = await apiClient.post('/users/signup', formData);
      
      if (response.status === 201) {
        // Optionally auto-login or redirect to login page
        router.replace('/login');
      }
    } catch (error: any) {
      // 2. Capture Server-Side Error (e.g., "User already exists")
      const msg = error.response?.data?.message || "Registration failed. Check your network.";
      setErrorMessage(msg);
      setShowError(false); // Don't show local red outlines for server errors
      console.error("Signup Error:", msg);
    } finally {
      setIsLoading(false);
    }
  };

  


  return (
    // KeyboardAvoidingView ensures the keyboard doesn't cover input fields
    <KeyboardAvoidingView 
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'} 
      className="flex-1 bg-white"
    >
      <ScrollView 
        className="flex-1" 
        showsVerticalScrollIndicator={false}
        // contentContainerStyle is key for making the whole area scrollable with padding at the end
        contentContainerStyle={{ flexGrow: 1, paddingBottom: 20 }}
      >
        <View className="px-8" style={{ paddingTop: Platform.OS === 'ios' ? 50 : 50 }}>
          
          {/* Back Button */}
          <TouchableOpacity onPress={() => router.back()} className="p-2 -ml-2 w-12 mb-4">
            <ChevronLeft size={28} color="#1E1B4B" />
          </TouchableOpacity>

          {/* Branding */}
          <View className="flex-row items-center mb-10">
            <View className="bg-indigo-600 p-3 rounded-2xl mr-4 shadow-sm">
              <GraduationCap size={28} color="white" />
            </View>
            <View>
              <Text className="text-2xl font-black text-indigo-900">Join UniSphere</Text>
              <Text className="text-gray-400 font-medium">Student Registration</Text>
            </View>
          </View>

          {/* Form Container */}
          <View>
            <SignUpForm 
              formData={formData} 
              setFormData={setFormData} 
              showError={showError} 
              errorMessage={errorMessage}
            />
          </View>
          {/* SPACING FIX: 
             mt-20 adds significant space between the "Confirm Password" and "Create Account" 
          */}
          <Button 
            onPress={handleSignUp}
            disabled={isLoading}
            className="bg-indigo-600 h-16 rounded-[25px] mt-20 shadow-md shadow-indigo-200"
          >
            {isLoading ? <ButtonSpinner className="mr-2" /> : null}
            <ButtonText className="font-bold text-lg">Create Account</ButtonText>
          </Button>

          {/* Footer Link */}
          <View className="flex-row justify-center mt-8 mb-10">
            <Text className="text-gray-500">Already a member? </Text>
            <TouchableOpacity onPress={() => router.push('/login')}>
              <Text className="text-indigo-600 font-bold">Sign In</Text>
            </TouchableOpacity>
          </View>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}