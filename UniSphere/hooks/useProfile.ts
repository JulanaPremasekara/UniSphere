import { useState, useCallback, useEffect } from 'react';
import { useRouter } from 'expo-router';
import { Alert, Platform } from 'react-native';
import apiClient from '../app/services/api';
import { AppStorage } from '../app/services/storage';

export const useProfile = () => {
  const router = useRouter();
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [isUpdating, setIsUpdating] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  const fetchProfile = useCallback(async () => {
    try {
      const token = await AppStorage.getItem('userToken');
      if (!token) {
        setUser(null);
        return;
      }
      const res = await apiClient.get('/users/me');
      if (res.data.success) {
        setUser(res.data.user);
      } else {
        await AppStorage.removeItem('userToken');
        setUser(null);
      }
    } catch {
      setUser(null);
    } finally {
      setLoading(false);
    }
  }, []);

  const logout = async () => {
    await AppStorage.removeItem('userToken');
    setUser(null);
    router.replace('/login');
  };

  const updateProfile = async (formData: any) => {
    if ((formData.password && formData.password.length < 6) || formData.password !== formData.confirmPassword) {
      setErrorMessage("Passwords do not match or are too short.");
      return false;
    }

    setIsUpdating(true);
    setErrorMessage(null);
    setSuccessMessage(null);

    try {
      const response = await apiClient.put('/users/update', {
        name: formData.name,
        phone: formData.phone,
        year: formData.year,
        major: formData.major,
        password: formData.password || undefined
      });

      if (response.data.success) {
        setSuccessMessage("Profile updated successfully!");
        if (Platform.OS !== 'web') {
          Alert.alert("Success", "Profile updated successfully!", [{ text: "OK", onPress: () => router.back() }]);
        } else {
          setTimeout(() => router.back(), 1500);
        }
        return true;
      }
    } catch (error: any) {
      setErrorMessage(error.response?.data?.message || "Update failed. Check your network.");
    } finally {
      setIsUpdating(false);
    }
    return false;
  };

  const deleteAccount = async () => {
    try {
      const res = await apiClient.delete('/users');
      if (res.data.success) {
        await AppStorage.removeItem('userToken');
        router.replace('/login');
        return true;
      }
    } catch (error: any) {
      Alert.alert("Error", error.response?.data?.message || "Could not delete account.");
    }
    return false;
  };

  useEffect(() => {
    fetchProfile();
  }, [fetchProfile]);

  return {
    user,
    loading,
    isUpdating,
    errorMessage,
    successMessage,
    logout,
    updateProfile,
    deleteAccount,
    refreshProfile: fetchProfile
  };
};
