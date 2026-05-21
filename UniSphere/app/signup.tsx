import React, { useState } from 'react';
import { View, Text, TouchableOpacity, ScrollView, Platform, KeyboardAvoidingView } from 'react-native';
import { useRouter } from 'expo-router';
import { Button, ButtonText, ButtonSpinner } from '@/components/ui/button';
import { ChevronLeft, GraduationCap } from 'lucide-react-native';
import SignUpForm from '@/components/SignUpForm';
import { useAuth } from '@/hooks/useAuth';
import { useTheme } from '@/context/ThemeContext';

export default function SignUp() {
  const router = useRouter();
  const { signup, isLoading, errorMessage } = useAuth();
  const [showError, setShowError] = useState(false);
  const [formData, setFormData] = useState({ name: '', email: '', phone: '', year: '', major: '', password: '', confirmPassword: '' });
  const { colors } = useTheme();

  const handleSignUp = async () => {
    const success = await signup(formData);
    if (!success && !errorMessage) setShowError(true);
  };

  return (
    // KeyboardAvoidingView ensures the keyboard doesn't cover input fields
    <KeyboardAvoidingView 
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'} 
      style={{ backgroundColor: colors.bg }}
      className="flex-1"
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
            <ChevronLeft size={28} color={colors.text} />
          </TouchableOpacity>

          <View className="flex-row items-center mb-10">
            <View style={{ backgroundColor: colors.primary }} className="p-3 rounded-2xl mr-4 shadow-sm"><GraduationCap size={28} color="white" /></View>
            <View>
              <Text style={{ color: colors.primary }} className="text-2xl font-black">Join UniSphere</Text>
              <Text style={{ color: colors.textSecondary }} className="font-medium">Student Registration</Text>
            </View>
          </View>

          <View>
            <SignUpForm formData={formData} setFormData={setFormData} showError={showError} errorMessage={errorMessage} />
          </View>
          
          <Button onPress={handleSignUp} disabled={isLoading} style={{ backgroundColor: colors.primary }} className="h-16 rounded-[25px] mt-20 shadow-md">
            {isLoading && <ButtonSpinner className="mr-2" />}
            <ButtonText className="font-bold text-lg">Create Account</ButtonText>
          </Button>

          <View className="flex-row justify-center mt-8 mb-10">
            <Text style={{ color: colors.textSecondary }}>Already a member? </Text>
            <TouchableOpacity onPress={() => router.push('/login')}><Text style={{ color: colors.primary }} className="font-bold">Sign In</Text></TouchableOpacity>
          </View>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}
