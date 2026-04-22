import { useState } from 'react';
import { useRouter } from 'expo-router';
import apiClient from '../app/services/api';
import { AppStorage } from '../app/services/storage';

export const useAuth = () => {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const login = async (email: string, password: string) => {
    if (!email.includes('@')) {
      setErrorMessage("Enter a valid email address.");
      return false;
    }
    if (password.length < 6) {
      setErrorMessage("Password must be at least 6 characters.");
      return false;
    }

    setIsLoading(true);
    setErrorMessage(null);

    try {
      const response = await apiClient.post('/users/login', { email, password });
      if (response.data.token) {
        await AppStorage.setItem('userToken', response.data.token);
        router.replace('/');
        return true;
      }
    } catch (error: any) {
      setErrorMessage(error.response?.data?.message || "Server unreachable. Check your connection.");
    } finally {
      setIsLoading(false);
    }
    return false;
  };

  const signup = async (formData: any) => {
    if (!formData.email.includes('@') || formData.password.length < 6 || formData.password !== formData.confirmPassword) {
      setErrorMessage("Invalid registration details. Please check your inputs.");
      return false;
    }

    setIsLoading(true);
    setErrorMessage(null);

    try {
      const response = await apiClient.post('/users/signup', formData);
      if (response.status === 201) {
        router.replace('/login');
        return true;
      }
    } catch (error: any) {
      setErrorMessage(error.response?.data?.message || "Registration failed. Check your network.");
    } finally {
      setIsLoading(false);
    }
    return false;
  };

  return { login, signup, isLoading, errorMessage, setErrorMessage };
};
