import React from 'react'; 
import { View, Text,TouchableOpacity,Platform } from 'react-native';
import { Search, Bell, ShoppingBasket, Users, Calendar, GraduationCap, UtensilsCrossed, Map as MapIcon, Bookmark } from 'lucide-react-native';
import Footer from '../components/Footer';
import Header from '../components/Header';

export default function LostItemsScreen() {
  return (

    <View className="flex-1 bg-gray-50">
      <Header title="UniSphere" />

    <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
      <Text style={{ fontSize: 20, fontWeight: 'bold' }}>
        Welcome to Lost & Found!
      </Text>
    </View>
    <Footer />
    </View>
    
  );
}