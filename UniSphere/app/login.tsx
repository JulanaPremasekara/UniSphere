import React, { useEffect, useState } from 'react';
import { View, Text, TouchableOpacity, ScrollView } from 'react-native';
import { useRouter } from 'expo-router';
import { Button, ButtonText, ButtonSpinner } from '@/components/ui/button';
import { VStack } from '@/components/ui/vstack';
import { ChevronLeftIcon, Icon } from '@/components/ui/icon';
import LoginForm from '@/components/form'; 
import { GraduationCap } from 'lucide-react-native';
import { useAuth } from '@/hooks/useAuth';
import { AppStorage } from '@/services/storage';
import { useTheme } from '@/context/ThemeContext';

export default function Login() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const { login, isLoading, errorMessage } = useAuth();
  const { colors } = useTheme();

  useEffect(() => {
    // Mark welcome as seen when reaching login to avoid loops
    AppStorage.setItem("hasSeenWelcome", "true");
  }, []);

  return (
    <ScrollView style={{ backgroundColor: colors.bg }} className="flex-1" contentContainerStyle={{ flexGrow: 1 }}>
      <View className="px-8 pt-16 pb-8">
        <TouchableOpacity onPress={() => router.replace('/')} className="mb-8 p-2 -ml-2 w-12" activeOpacity={0.7}>
          <Icon as={ChevronLeftIcon} size="xl" style={{ color: colors.text }} />
        </TouchableOpacity>

        <View className="items-center mb-10">
          <View style={{ backgroundColor: colors.primary }} className="p-4 rounded-[22px] shadow-lg mb-4">
            <GraduationCap size={48} color="white" strokeWidth={2} />
          </View>
          <Text style={{ color: colors.primary }} className="text-3xl font-extrabold tracking-tight">UniSphere</Text>
          <Text style={{ color: colors.textSecondary }} className="font-medium mt-1">Connect. Explore. Succeed.</Text>
        </View>

        <View className="mb-10">
          <Text style={{ color: colors.text }} className="text-4xl font-bold mb-2">Welcome Back</Text>
          <Text style={{ color: colors.textSecondary }} className="text-lg">Sign in to continue to UniSphere</Text>
        </View>

        <VStack space="xl">
          <LoginForm email={email} setEmail={setEmail} password={password} setPassword={setPassword} errorMessage={errorMessage} />
          
          <Button onPress={() => login(email, password)} disabled={isLoading} style={{ backgroundColor: colors.primary }} className="h-16 rounded-[25px] mt-6 shadow-md">
            {isLoading && <ButtonSpinner className="mr-2" />}
            <ButtonText className="font-bold text-lg">Sign In</ButtonText>
          </Button>

          <View className="flex-row justify-center mt-6">
            <Text style={{ color: colors.textSecondary }}>Don't have an account? </Text>
            <TouchableOpacity onPress={() => router.push('/signup')}><Text style={{ color: colors.primary }} className="font-bold">Sign Up</Text></TouchableOpacity>
          </View>
        </VStack>
      </View>
    </ScrollView>
  );
}
