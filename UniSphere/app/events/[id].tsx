import { useLocalSearchParams, useRouter } from 'expo-router';
import { ChevronLeft, Calendar, Clock, MapPin, Verified, CheckCheck, CheckCircle2 } from 'lucide-react-native';
import { Modal, Image,  ScrollView, Text, TouchableOpacity, View, Platform, ActivityIndicator } from 'react-native';
import { SafeAreaView } from "react-native-safe-area-context"; // ✅ Modern
import React, { useState } from 'react';
import Footer from '../components/Footer';
import { useEventDetail } from '../../hooks/useEventDetail';

export default function EventDetail() {
  const { id } = useLocalSearchParams();
  const router = useRouter();
  const { event, loading, isRegistered, registering, register } = useEventDetail(id);
  const [confirmModalVisible, setConfirmModalVisible] = useState(false);

  if (loading) return <View className="flex-1 justify-center items-center bg-white"><ActivityIndicator size="large" color="#4F46E5" /></View>;
  if (!event) return <View className="flex-1 justify-center items-center"><Text>Event not found.</Text><TouchableOpacity onPress={() => router.back()} className="mt-4 bg-indigo-600 px-6 py-2 rounded-full"><Text className="text-white">Go Back</Text></TouchableOpacity></View>;

  const start = new Date(event.startDate), end = new Date(event.endDate);

  const InfoRow = ({ icon: IconComp, label, val, noBorder = false }: any) => (
    <View className={`flex-row items-center ${noBorder ? '' : 'pt-4 mt-4 border-t border-gray-200/50'}`}>
      <View className="bg-white p-3 rounded-2xl shadow-sm"><IconComp color="#4F46E5" size={20} /></View>
      <View className="ml-4 flex-1">
        <Text className="text-gray-400 text-[10px] font-bold uppercase">{label}</Text>
        <Text className="text-gray-900 font-bold">{val}</Text>
      </View>
    </View>
  );

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: '#fff' }}>
      <View className="flex-row justify-between items-center px-6 bg-white" style={{ paddingTop: Platform.OS === 'ios' ? 60 : 50, paddingBottom: 15 }}>
        <TouchableOpacity onPress={() => router.back()}><ChevronLeft color="#000" size={28} /></TouchableOpacity>
        <Text className="text-xl font-bold text-indigo-900">UniSphere</Text>
        <View style={{ width: 28 }} />
      </View>

      <ScrollView className="flex-1" showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingBottom: 120 }}>
        <View className="px-4 mt-4">
          <View className="relative h-64 w-full rounded-[40px] overflow-hidden bg-indigo-900 shadow-lg">
            <Image source={{ uri: event.image || 'https://images.unsplash.com/photo-1635070041078-e363dbe005cb' }} className="absolute inset-0 opacity-70 w-full h-full" />
            <View className="flex-1 items-center justify-center">
              <MapPin color="white" size={32} />
              <View className="bg-white/20 px-4 py-2 mt-4 rounded-xl border border-white/30"><Text className="text-white font-bold tracking-widest text-center">{start.getDate()} {start.toLocaleString('en-US', { month: 'short' }).toUpperCase()}</Text></View>
            </View>
          </View>
        </View>

        <View className="px-6 mt-6">
          <Text className="text-3xl font-black text-gray-900 leading-tight">{event.title}</Text>
          <View className="flex-row items-center mt-2"><Verified color="#4F46E5" size={18} /><Text className="text-gray-600 font-medium ml-2">Hosted by {event.organizerName}</Text></View>
        </View>  

        <View className="mx-6 mt-8 bg-gray-100/60 p-6 rounded-[35px]">
          <InfoRow icon={Calendar} label="Start Time" val={start.toLocaleString()} noBorder={true} />
          <InfoRow icon={Clock} label="End Time" val={end.toLocaleString()} />
        </View>

        <View className="mx-6 mt-4 bg-gray-100/60 p-6 rounded-[35px]">
          <InfoRow icon={MapPin} label="Venue" val={event.location} noBorder={true} />
        </View>

        <View className="px-6 mt-8"><Text className="text-xl font-bold text-gray-900">About the Event</Text><Text className="text-gray-600 mt-3 leading-6 text-[15px]">{event.description}</Text></View>

        <View className="flex-row flex-wrap px-6 mt-6">
          {event.tags?.map((tag: any, index: any) => <View key={index} className="bg-indigo-100 px-5 py-2 rounded-full mr-2 mb-2"><Text className="text-indigo-700 text-xs font-bold">{tag}</Text></View>)}
        </View>
      </ScrollView>

      <View className="absolute bottom-28 left-0 right-0 px-6">
        <TouchableOpacity onPress={() => !isRegistered && !registering && setConfirmModalVisible(true)} disabled={isRegistered || registering} className={`${isRegistered ? 'bg-emerald-600' : 'bg-indigo-700'} py-5 rounded-[30px] flex-row items-center justify-center`}>
          {isRegistered && <CheckCheck color="white" size={20} className="mr-2" />}
          <Text className="text-white font-black text-lg">{registering ? 'Registering...' : isRegistered ? 'Registered' : 'RSVP / Register'}</Text>
        </TouchableOpacity>
      </View>
      

      <Modal animationType="fade" transparent={true} visible={confirmModalVisible} onRequestClose={() => setConfirmModalVisible(false)}>
        <TouchableOpacity activeOpacity={1} onPress={() => setConfirmModalVisible(false)} className="flex-1 bg-black/60 justify-center items-center px-6">
          <View className="bg-white rounded-[40px] w-full max-w-sm p-8 shadow-2xl items-center">
            <View className="bg-indigo-50 p-6 rounded-full mb-6"><CheckCircle2 size={40} color="#4F46E5" /></View>
            <Text className="text-2xl font-black text-gray-900 mb-2">Confirm Attendance?</Text>
            <Text className="text-gray-500 text-center text-lg mb-8 leading-relaxed">Are you sure you want to register for "{event.title}"? Your attendance will be confirmed.</Text>
            <View className="flex-row gap-4 w-full">
              <TouchableOpacity onPress={() => setConfirmModalVisible(false)} className="flex-1 bg-gray-50 p-5 rounded-3xl"><Text className="text-gray-900 font-bold text-center text-lg">Cancel</Text></TouchableOpacity>
              <TouchableOpacity onPress={async () => { setConfirmModalVisible(false); await register(); }} className="flex-1 bg-indigo-600 p-5 rounded-3xl shadow-lg shadow-indigo-200"><Text className="text-white font-bold text-center text-lg">Register</Text></TouchableOpacity>
            </View>
          </View>
        </TouchableOpacity>
      </Modal>
      <Footer />
    </SafeAreaView>
  );
}

