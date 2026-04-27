import React, { useState } from 'react';
import { View, Text, TouchableOpacity, ScrollView, Platform, Alert, ActivityIndicator, Modal, TextInput } from 'react-native';
import { useRouter } from 'expo-router';
import { Home, Search, Plus, Trash2, X } from 'lucide-react-native';
import Footer from '../components/Footer';
import apiClient from '../services/api';
import { useHousing, Housing } from '../../hooks/useHousing';
import { useUser } from '../../hooks/useUser';
import HousingCard from '../components/HousingCard';

export default function HousingList() {
  const router = useRouter();
  const [activeFilter, setActiveFilter] = useState('All');
  const { housings, loading, refreshHousings } = useHousing();
  const { userId } = useUser();
  const [deleteModalVisible, setDeleteModalVisible] = useState(false);
  const [housingToDelete, setHousingToDelete] = useState<string | null>(null);
  const [loginModalVisible, setLoginModalVisible] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [isSearching, setIsSearching] = useState(false);

  const confirmDelete = async () => {
    if (!housingToDelete) return;
    try {
      if ((await apiClient.delete(`/housing/${housingToDelete}`)).data.success) refreshHousings();
    } catch { Alert.alert("Error", "Failed to delete housing listing."); } finally { setDeleteModalVisible(false); setHousingToDelete(null); }
  };

  const filteredHousings = housings.filter((h: Housing) => 
    (activeFilter === 'All' ? true : activeFilter === 'Mine' ? h.isMine : !h.isMine) &&
    (h.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
     h.location.toLowerCase().includes(searchQuery.toLowerCase()))
  );

  if (loading) return <View className="flex-1 justify-center items-center bg-white"><ActivityIndicator size="large" color="#059669" /></View>;

  return (
    <View className="flex-1 bg-gray-50">
      <View className="px-6 pb-4 bg-white" style={{ paddingTop: Platform.OS === 'ios' ? 60 : 50 }}>
        <View className="flex-row justify-between items-center h-12">
          {isSearching ? (
            <View className="flex-1 bg-gray-100 rounded-full flex-row items-center px-4 h-full">
              <Search size={20} color="#6B7280" />
              <TextInput value={searchQuery} onChangeText={setSearchQuery} placeholder="Search rooms..." className="flex-1 ml-2 text-base text-gray-800" autoFocus />
              <TouchableOpacity onPress={() => { setIsSearching(false); setSearchQuery(''); }}><X size={20} color="#6B7280" /></TouchableOpacity>
            </View>
          ) : (
            <>
              <View className="flex-row items-center"><Home size={28} color="#059669" /><Text className="text-2xl font-bold ml-2 text-emerald-900">Housing</Text></View>
              <TouchableOpacity onPress={() => setIsSearching(true)} className="bg-gray-100 p-2 rounded-full"><Search size={22} color="#6B7280" /></TouchableOpacity>
            </>
          )}
        </View>
      </View>

      <View className="bg-white pb-4 px-6 border-b border-gray-100">
        <ScrollView horizontal showsHorizontalScrollIndicator={false}>
          {['All', 'Mine', 'Others'].map(f => (
            <TouchableOpacity key={f} onPress={() => setActiveFilter(f)} className={`mr-3 px-6 py-2 rounded-full ${activeFilter === f ? 'bg-emerald-600' : 'bg-gray-100'}`}>
              <Text className={`font-bold ${activeFilter === f ? 'text-white' : 'text-gray-500'}`}>{f === 'Mine' ? 'My Listings' : f === 'Others' ? 'By Others' : 'All Listings'}</Text>
            </TouchableOpacity>
          ))}
        </ScrollView>
      </View>

      <ScrollView className="flex-1 px-6" contentContainerStyle={{ paddingBottom: 120 }}>
        <View className="mt-6 mb-4"><Text className="text-xl font-medium">Available Rooms</Text></View>
        {filteredHousings.length > 0 ? filteredHousings.map((item: Housing) => (
          <HousingCard key={item.id} item={item} onPress={() => router.push(`/housing/${item.id}` as any)} onEdit={item.isMine ? () => router.push({ pathname: '/housing/create' as any, params: { editId: item.id } }) : undefined} onDelete={item.isMine ? () => { setHousingToDelete(item.id); setDeleteModalVisible(true); } : undefined} />
        )) : (
          <View className="flex-1 items-center justify-center py-20">
            <View className="bg-gray-100 p-8 rounded-full mb-4"><Search size={48} color="#9CA3AF" /></View>
            <Text className="text-xl font-bold text-gray-800 mb-2">No Rooms Found</Text>
            <Text className="text-gray-500 text-center px-10">There are currently no rooms matching your search or criteria.</Text>
          </View>
        )}
      </ScrollView>

      <TouchableOpacity onPress={() => !userId ? setLoginModalVisible(true) : router.push('/housing/create' as any)} className="absolute bottom-28 right-8 bg-emerald-600 w-16 h-16 rounded-full items-center justify-center shadow-lg">
        <Plus color="white" size={32} />
      </TouchableOpacity>
      <Footer />

      <Modal animationType="fade" transparent={true} visible={deleteModalVisible} onRequestClose={() => setDeleteModalVisible(false)}>
        <TouchableOpacity activeOpacity={1} onPress={() => setDeleteModalVisible(false)} className="flex-1 bg-black/60 justify-center items-center px-6">
          <View className="bg-white rounded-[40px] w-full max-w-sm p-8 shadow-2xl items-center">
            <View className="bg-red-50 p-6 rounded-full mb-6"><Trash2 size={40} color="#EF4444" /></View>
            <Text className="text-2xl font-black text-gray-900 mb-2">Delete Listing?</Text>
            <Text className="text-gray-500 text-center text-lg mb-8 leading-relaxed">This will permanently remove your room listing from the campus feed. This action cannot be undone.</Text>
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
            <Text className="text-2xl font-bold text-gray-900 mb-3">Login Required</Text>
            <Text className="text-gray-500 text-center mb-8">Please log in to post a room listing.</Text>
            <View className="flex-row gap-4 w-full">
              <TouchableOpacity onPress={() => setLoginModalVisible(false)} className="flex-1 bg-gray-50 p-5 rounded-3xl"><Text className="text-gray-900 font-bold text-center">Later</Text></TouchableOpacity>
              <TouchableOpacity onPress={() => router.push('/login')} className="flex-1 bg-emerald-600 p-5 rounded-3xl"><Text className="text-white font-bold text-center">Login</Text></TouchableOpacity>
            </View>
          </View>
        </TouchableOpacity>
      </Modal>
    </View>
  );
}
