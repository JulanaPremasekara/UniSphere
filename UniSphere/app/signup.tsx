import React, { useState } from 'react';
import { View, Text, TouchableOpacity, ScrollView, Platform, KeyboardAvoidingView } from 'react-native';
import { useRouter } from 'expo-router';
import { Button, ButtonText, ButtonSpinner } from '@/components/ui/button';
import { ChevronLeft, GraduationCap } from 'lucide-react-native';
import SignUpForm from './components/SignUpForm';
import { useAuth } from '../hooks/useAuth';

export default function SignUp() {
  const router = useRouter();
  const { signup, isLoading, errorMessage } = useAuth();
  const [showError, setShowError] = useState(false);
  const [formData, setFormData] = useState({ name: '', email: '', phone: '', year: '', major: '', password: '', confirmPassword: '' });

  const handleSignUp = async () => {
    const success = await signup(formData);
    if (!success && !errorMessage) setShowError(true);
  };

  return (
    <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : 'height'} className="flex-1 bg-white">
      <ScrollView className="flex-1" showsVerticalScrollIndicator={false} contentContainerStyle={{ flexGrow: 1, paddingBottom: 60 }}>
        <View className="px-8" style={{ paddingTop: Platform.OS === 'ios' ? 70 : 60 }}>
          <TouchableOpacity onPress={() => router.back()} className="p-2 -ml-2 w-12 mb-4">
            <ChevronLeft size={28} color="#1E1B4B" />
          </TouchableOpacity>

          <View className="flex-row items-center mb-10">
            <View className="bg-indigo-600 p-3 rounded-2xl mr-4 shadow-sm"><GraduationCap size={28} color="white" /></View>
            <View>
              <Text className="text-2xl font-black text-indigo-900">Join UniSphere</Text>
              <Text className="text-gray-400 font-medium">Student Registration</Text>
            </View>
          </View>

          <View>
            <SignUpForm formData={formData} setFormData={setFormData} showError={showError} errorMessage={errorMessage} />
          </View>
          
          <Button onPress={handleSignUp} disabled={isLoading} className="bg-indigo-600 h-16 rounded-[25px] mt-20 shadow-md shadow-indigo-200">
            {isLoading && <ButtonSpinner className="mr-2" />}
            <ButtonText className="font-bold text-lg">Create Account</ButtonText>
          </Button>

          <View className="flex-row justify-center mt-8 mb-10">
            <Text className="text-gray-500">Already a member? </Text>
            <TouchableOpacity onPress={() => router.push('/login')}><Text className="text-indigo-600 font-bold">Sign In</Text></TouchableOpacity>
          </View>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}
