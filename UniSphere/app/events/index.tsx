import React, { useState } from 'react';
import { View, Text, TouchableOpacity, ScrollView, Platform, Alert, ActivityIndicator, Modal, TextInput } from 'react-native';
import { router } from 'expo-router';
import { Calendar, Search, Plus, Trash2, X } from 'lucide-react-native';
import EventCard from '../components/EventCard';
import Footer from '../components/Footer';
import apiClient from '../services/api';
import { useEvents, Event } from '../../hooks/useEvents';
import { useUser } from '../../hooks/useUser';

export default function EventsPage() {
  const [activeFilter, setActiveFilter] = useState('All');
  const { events, loading, refreshEvents } = useEvents();
  const { userId } = useUser();
  const [deleteModalVisible, setDeleteModalVisible] = useState(false);
  const [eventToDelete, setEventToDelete] = useState<string | null>(null);
  const [loginModalVisible, setLoginModalVisible] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [isSearching, setIsSearching] = useState(false);

  const confirmDelete = async () => {
    if (!eventToDelete) return;
    try {
      if ((await apiClient.delete(`/events/${eventToDelete}`)).data.success) refreshEvents();
    } catch { Alert.alert("Error", "Failed to delete event."); } finally { setDeleteModalVisible(false); setEventToDelete(null); }
  };

  const filteredEvents = (events || []).filter((e: Event) => {
    if (!e) return false;
    const matchesFilter = activeFilter === 'All' ? true : activeFilter === 'Mine' ? e.isMine : !e.isMine;
    const matchesSearch = (e.title || '').toLowerCase().startsWith((searchQuery || '').toLowerCase());
    return matchesFilter && matchesSearch;
  });


  if (loading) return <View className="flex-1 justify-center items-center bg-white"><ActivityIndicator size="large" color="#4F46E5" /></View>;

  return (
    <View className="flex-1 bg-gray-50">
      <View className="px-6 pb-4 bg-white" style={{ paddingTop: Platform.OS === 'ios' ? 60 : 50 }}>
        <View className="flex-row justify-between items-center h-12">
          {isSearching ? (
            <View className="flex-1 bg-gray-100 rounded-full flex-row items-center px-4 h-full">
              <Search size={20} color="#6B7280" />
              <TextInput value={searchQuery} onChangeText={setSearchQuery} placeholder="Search events..." className="flex-1 ml-2 text-base text-gray-800" autoFocus />
              <TouchableOpacity onPress={() => { setIsSearching(false); setSearchQuery(''); }}><X size={20} color="#6B7280" /></TouchableOpacity>
            </View>
          ) : (
            <>
              <View className="flex-row items-center"><Calendar size={28} color="#4F46E5" /><Text className="text-2xl font-bold ml-2 text-indigo-900">UniSphere</Text></View>
              <TouchableOpacity onPress={() => setIsSearching(true)} className="bg-gray-100 p-2 rounded-full"><Search size={22} color="#6B7280" /></TouchableOpacity>
            </>
          )}
        </View>
      </View>

      <View className="bg-white pb-4 px-6 border-b border-gray-100">
        <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={{ paddingVertical: 4 }}>
          {['All', 'Mine', 'Others'].map(f => (
            <TouchableOpacity 
              key={f} 
              onPress={() => setActiveFilter(f)} 
              className={`mr-3 px-6 py-2.5 rounded-2xl border ${activeFilter === f ? 'bg-indigo-600 border-indigo-600 shadow-sm' : 'bg-white border-gray-200'}`}
            >
              <Text className={`font-bold text-sm ${activeFilter === f ? 'text-white' : 'text-gray-600'}`}>
                {f === 'Mine' ? 'My Events' : f === 'Others' ? 'By Others' : 'All Events'}
              </Text>
            </TouchableOpacity>
          ))}
        </ScrollView>
      </View>

      <ScrollView className="flex-1 px-6" contentContainerStyle={{ paddingBottom: 120 }}>
        <View className="mt-6 mb-4"><Text className="text-xl font-medium">{searchQuery ? 'Search Results' : 'Campus Feed'}</Text></View>
        {filteredEvents.length > 0 ? filteredEvents.map((item: Event) => (
          <EventCard key={item.id} item={item} onPress={() => router.push(`/events/${item.id}`)} onEdit={item.isMine ? () => router.push({ pathname: '/events/create', params: { editId: item.id } }) : undefined} onDelete={item.isMine ? () => { setEventToDelete(item.id); setDeleteModalVisible(true); } : undefined} />
        )) : (
          <View className="flex-1 items-center justify-center py-20">
            <View className="bg-gray-100 p-8 rounded-full mb-4"><Search size={48} color="#9CA3AF" /></View>
            <Text className="text-xl font-bold text-gray-800 mb-2">No Events Found</Text>
            <Text className="text-gray-500 text-center px-10">There are currently no events matching your search or criteria.</Text>
          </View>
        )}
      </ScrollView>

      <TouchableOpacity onPress={() => !userId ? setLoginModalVisible(true) : router.push('/events/create')} className="absolute bottom-28 right-8 bg-indigo-600 w-16 h-16 rounded-full items-center justify-center shadow-lg">
        <Plus color="white" size={32} />
      </TouchableOpacity>
      <Footer />

      <Modal animationType="fade" transparent={true} visible={deleteModalVisible} onRequestClose={() => setDeleteModalVisible(false)}>
        <TouchableOpacity activeOpacity={1} onPress={() => setDeleteModalVisible(false)} className="flex-1 bg-black/60 justify-center items-center px-6">
          <View className="bg-white rounded-[40px] w-full max-w-sm p-8 shadow-2xl items-center">
            <View className="bg-red-50 p-6 rounded-full mb-6"><Trash2 size={40} color="#EF4444" /></View>
            <Text className="text-2xl font-black text-gray-900 mb-2">Delete Event?</Text>
            <Text className="text-gray-500 text-center text-lg mb-8 leading-relaxed">This will permanently remove your curated event from the campus feed. This action cannot be undone.</Text>
            <View className="flex-row gap-4 w-full">
              <TouchableOpacity onPress={() => setDeleteModalVisible(false)} className="flex-1 bg-gray-50 p-5 rounded-3xl"><Text className="text-gray-900 font-bold text-center text-lg">Cancel</Text></TouchableOpacity>
              <TouchableOpacity onPress={confirmDelete} className="flex-1 bg-red-600 p-5 rounded-3xl shadow-lg shadow-red-200"><Text className="text-white font-bold text-center text-lg">Delete</Text></TouchableOpacity>
            </View>
          </View>
        </TouchableOpacity>
      </Modal>

      <Modal animationType="fade" transparent={true} visible={loginModalVisible} onRequestClose={() => setLoginModalVisible(false)}>
        <TouchableOpacity activeOpacity={1} onPress={() => setLoginModalVisible(false)} className="flex-1 bg-black/60 justify-center items-center px-6">
          <View className="bg-white rounded-[40px] w-full max-w-sm p-8 shadow-2xl items-center">
            <View className="bg-indigo-50 p-6 rounded-full mb-6"><Calendar size={40} color="#4F46E5" /></View>
            <Text className="text-2xl font-black text-gray-900 mb-2">Login Required</Text>
            <Text className="text-gray-500 text-center text-lg mb-8 leading-relaxed">Please sign in to your UniSphere account to create and share new events with the campus.</Text>
            <View className="flex-row gap-4 w-full">
              <TouchableOpacity onPress={() => setLoginModalVisible(false)} className="flex-1 bg-gray-50 p-5 rounded-3xl"><Text className="text-gray-900 font-bold text-center text-lg">Cancel</Text></TouchableOpacity>
              <TouchableOpacity onPress={() => { setLoginModalVisible(false); router.push('/login'); }} className="flex-1 bg-indigo-600 p-5 rounded-3xl shadow-lg shadow-indigo-200"><Text className="text-white font-bold text-center text-lg">Sign In</Text></TouchableOpacity>
            </View>
          </View>
        </TouchableOpacity>
      </Modal>
    </View>
  );
}

