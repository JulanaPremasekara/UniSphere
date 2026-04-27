import React from 'react';
import { View, Text, TouchableOpacity, Image } from 'react-native';
import { MapPin, DollarSign, Edit, Trash2 } from 'lucide-react-native';

interface HousingCardProps {
  item: {
    id: string;
    title: string;
    location: string;
    rentPrice: number;
    roomType: string;
    images?: string[];
    isMine: boolean;
  };
  onPress: () => void;
  onEdit?: () => void;
  onDelete?: () => void;
}

export default function HousingCard({ item, onPress, onEdit, onDelete }: HousingCardProps) {
  return (
    <TouchableOpacity 
      activeOpacity={0.9} 
      onPress={onPress} 
      className="bg-white rounded-[20px] border border-gray-100 shadow-sm mb-4 overflow-hidden"
    >
      {/* Image */}
      <View className="relative">
        {item.images && item.images.length > 0 ? (
          <Image 
            source={{ uri: item.images[0] }} 
            className="w-full h-40" 
          />
        ) : (
          <View className="w-full h-40 bg-gray-200 justify-center items-center">
            <Text className="text-gray-400">No image</Text>
          </View>
        )}
        <View className="absolute top-3 right-3 bg-emerald-600 px-3 py-1 rounded-full">
          <Text className="text-white text-xs font-bold uppercase">{item.roomType}</Text>
        </View>
      </View>

      {/* Content */}
      <View className="p-4">
        <Text className="text-lg font-bold text-gray-900 mb-2" numberOfLines={1}>
          {item.title}
        </Text>
        
        {/* Location */}
        <View className="flex-row items-center gap-2 mb-3">
          <MapPin size={16} color="#6B7280" />
          <Text className="text-gray-600 text-sm" numberOfLines={1}>
            {item.location}
          </Text>
        </View>

        {/* Price & Actions */}
        <View className="flex-row items-center justify-between">
          <View className="flex-row items-center gap-1">
            <DollarSign size={18} color="#059669" />
            <Text className="text-emerald-600 font-bold text-lg">
              {item.rentPrice}/mo
            </Text>
          </View>

          {/* Edit/Delete for own listings */}
          {item.isMine && (
            <View className="flex-row gap-2">
              {onEdit && (
                <TouchableOpacity onPress={onEdit} className="bg-blue-100 p-2 rounded-full">
                  <Edit size={16} color="#0369A1" />
                </TouchableOpacity>
              )}
              {onDelete && (
                <TouchableOpacity onPress={onDelete} className="bg-red-100 p-2 rounded-full">
                  <Trash2 size={16} color="#DC2626" />
                </TouchableOpacity>
              )}
            </View>
          )}
        </View>
      </View>
    </TouchableOpacity>
  );
}
