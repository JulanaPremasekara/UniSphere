import { useState, useEffect } from 'react';
import { Alert, Platform } from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import apiClient from '@/services/api';

export const useEventForm = (editId?: string | string[]) => {
  const isEditing = !!editId;
  const [isPicking, setIsPicking] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [image, setImage] = useState<string | null>(null);
  const [tags, setTags] = useState(['Limited Seats', 'Certificate Provided']);
  const [form, setForm] = useState({
    title: '',
    startDate: '',
    startTime: '',
    endDate: '',
    endTime: '',
    location: '',
    description: '',
  });

  useEffect(() => {
    if (isEditing) {
      (async () => {
        try {
          const { data: { success, event: ev } } = await apiClient.get(`/events/${editId}`);
          if (success) {
            const sDate = new Date(ev.startDate);
            const eDate = new Date(ev.endDate);
            setForm({
              title: ev.title,
              startDate: sDate.toLocaleDateString(),
              startTime: sDate.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', hour12: false }),
              endDate: eDate.toLocaleDateString(),
              endTime: eDate.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', hour12: false }),
              location: ev.location,
              description: ev.description,
            });
            setTags(ev.tags || []);
            if (ev.image) setImage(ev.image);
          }
        } catch {
          Alert.alert("Error", "Could not load event details.");
        }
      })();
    }
  }, [editId, isEditing]);

  const pickImage = async () => {
    try {
      setIsPicking(true);
      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ['images'],
        allowsEditing: true,
        aspect: [16, 9],
        quality: 0.7,
        base64: true,
      });
      if (!result.canceled && result.assets[0].base64) {
        setImage(`data:image/jpeg;base64,${result.assets[0].base64}`);
      }
    } catch {
      Alert.alert("Error", "Could not pick image");
    } finally {
      setIsPicking(false);
    }
  };

  const parseDate = (dStr: string, tStr: string) => {
    const parts = dStr.split('/');
    if (parts.length === 3) {
      return new Date(`${parts[2]}/${parts[0].padStart(2, '0')}/${parts[1].padStart(2, '0')} ${tStr || '00:00'}`);
    }
    return new Date(`${dStr} ${tStr || '00:00'}`);
  };

  const submit = async () => {
    if (isSubmitting) return { success: false };
    
    const showAlert = (title: string, message: string) => 
      Platform.OS === 'web' ? alert(`${title}\n\n${message}`) : Alert.alert(title, message);

    try {
      setIsSubmitting(true);
      const sDate = parseDate(form.startDate, form.startTime);
      const eDate = parseDate(form.endDate, form.endTime);
      
      if (isNaN(sDate.getTime()) || isNaN(eDate.getTime())) {
        showAlert("Invalid Dates", "Please enter valid dates in mm/dd/yyyy format");
        return { success: false };
      }
      
      const payload = {
        ...form,
        startDate: sDate,
        endDate: eDate,
        tags,
        image: image || undefined
      };

      const { data } = isEditing 
        ? await apiClient.put(`/events/${editId}`, payload) 
        : await apiClient.post('/events', payload);
      
      if (data.success) {
        return { success: true, message: isEditing ? "Event updated successfully!" : "Event published successfully!" };
      } else {
        showAlert("Error", data.message || "Something went wrong");
        return { success: false };
      }
    } catch (error: any) {
      showAlert("Error", error.response?.data?.message || "An error occurred during publishing");
      return { success: false };
    } finally {
      setIsSubmitting(false);
    }
  };

  return {
    form,
    setForm,
    image,
    setImage,
    tags,
    setTags,
    isPicking,
    isSubmitting,
    pickImage,
    submit,
    isEditing
  };
};
