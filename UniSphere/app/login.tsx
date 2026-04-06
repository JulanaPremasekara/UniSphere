import React, { useState } from 'react';
import { View, Text, TouchableOpacity, ScrollView } from 'react-native';
import { useRouter } from 'expo-router';
import { Button, ButtonText, ButtonSpinner } from '@/components/ui/button';
import { VStack } from '@/components/ui/vstack';
import { ChevronLeftIcon, Icon } from '@/components/ui/icon';
import LoginForm from './components/form'; 
import { GraduationCap } from 'lucide-react-native';
import apiClient from './services/api';
import { AppStorage } from './services/storage';

export default function Login() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const handleLogin = async () => {
    if (!email.includes('@')) return setErrorMessage("Enter a valid email address.");
    if (password.length < 6) return setErrorMessage("Password must be at least 6 characters.");

    setIsLoading(true);
    setErrorMessage(null);

    try {
      const response = await apiClient.post('/users/login', { email, password });
      if (response.data.token) {
        await AppStorage.setItem('userToken', response.data.token);
        router.replace('/');
      }
    } catch (error: any) {
      setErrorMessage(error.response?.data?.message || "Server unreachable. Check your connection.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <ScrollView className="flex-1 bg-white" contentContainerStyle={{ flexGrow: 1 }}>
      <View className="px-8 pt-16 pb-8">
        <TouchableOpacity onPress={() => router.back()} className="mb-8 p-2 -ml-2 w-12" activeOpacity={0.7}>
          <Icon as={ChevronLeftIcon} size="xl" className="text-gray-900" />
        </TouchableOpacity>

        <View className="items-center mb-10">
          <View className="bg-indigo-600 p-4 rounded-[22px] shadow-lg shadow-indigo-300 mb-4">
            <GraduationCap size={48} color="white" strokeWidth={2} />
          </View>
          <Text className="text-3xl font-extrabold text-indigo-900 tracking-tight">UniSphere</Text>
          <Text className="text-gray-400 font-medium mt-1">Connect. Explore. Succeed.</Text>
        </View>

        <View className="mb-10">
          <Text className="text-4xl font-bold text-gray-900 mb-2">Welcome Back</Text>
          <Text className="text-gray-500 text-lg">Sign in to continue to UniSphere</Text>
        </View>

        <VStack space="xl">
          <LoginForm email={email} setEmail={setEmail} password={password} setPassword={setPassword} errorMessage={errorMessage} />
          
          <Button onPress={handleLogin} disabled={isLoading} className="bg-indigo-600 h-16 rounded-[25px] mt-6 shadow-md shadow-indigo-200">
            {isLoading && <ButtonSpinner className="mr-2" />}
            <ButtonText className="font-bold text-lg">Sign In</ButtonText>
          </Button>

          <View className="flex-row justify-center mt-6">
            <Text className="text-gray-500">Don't have an account? </Text>
            <TouchableOpacity onPress={() => router.push('/signup')}><Text className="text-indigo-600 font-bold">Sign Up</Text></TouchableOpacity>
          </View>
        </VStack>
      </View>
    </ScrollView>
  );
}