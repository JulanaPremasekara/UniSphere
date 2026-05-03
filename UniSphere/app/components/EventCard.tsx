import { Edit2, MapPin, MoreVertical, Trash2 } from 'lucide-react-native';
import React, { useState } from 'react';
import { Dimensions, Platform, Pressable, Text, TouchableOpacity, View } from 'react-native';

const { width, height } = Dimensions.get('window');

interface EventCardProps {
  item: { id: string; title: string; month: string; day: string; location: string; organizer: string; isMine?: boolean; };
  onPress: () => void;
  onEdit?: () => void;
  onDelete?: () => void;
}

export default function EventCard({ item, onPress, onEdit, onDelete }: EventCardProps) {
  const [showMenu, setShowMenu] = useState(false);

  const handleAction = (action: () => void) => { action(); setShowMenu(false); };

  return (
    <>
      {showMenu && <Pressable onPress={() => setShowMenu(false)} style={{ position: 'absolute', top: -height, left: -width, width: width * 3, height: height * 3, zIndex: 50 }} />}

      <View style={{ zIndex: showMenu ? 100 : 1 }} className="mb-4">
        {showMenu && (
          <View className="absolute right-6 top-16 bg-white border border-gray-100 rounded-3xl w-48 overflow-hidden shadow-2xl" style={{ zIndex: 9999, ...Platform.select({ ios: { shadowColor: '#000', shadowOffset: { width: 0, height: 12 }, shadowOpacity: 0.2, shadowRadius: 16 }, android: { elevation: 24 } }) }}>
            {onEdit && (
              <TouchableOpacity onPress={() => handleAction(onEdit)} className="flex-row items-center p-5 border-b border-gray-50 active:bg-indigo-50">
                <Edit2 size={18} color="#4F46E5" /><Text className="ml-4 font-bold text-gray-700 text-base">Edit Event</Text>
              </TouchableOpacity>
            )}
            {onDelete && (
              <TouchableOpacity onPress={() => handleAction(onDelete)} className="flex-row items-center p-5 active:bg-red-50">
                <Trash2 size={18} color="#EF4444" /><Text className="ml-4 font-bold text-red-500 text-base">Delete Event</Text>
              </TouchableOpacity>
            )}
          </View>
        )}

        <View className="bg-white rounded-[35px] shadow-sm border border-gray-100 flex-row">
          <TouchableOpacity onPress={() => showMenu ? setShowMenu(false) : onPress()} activeOpacity={0.8} className="flex-row flex-1 p-5 items-center">
            <View className="mr-5 items-center justify-center">
              <View className="bg-white w-16 h-20 rounded-[22px] overflow-hidden shadow-sm border border-gray-100">
                <View className="bg-indigo-600 py-1.5 w-full items-center"><Text className="text-white font-bold text-[10px] uppercase tracking-tighter">{item.month}</Text></View>
                <View className="flex-1 items-center justify-center bg-white"><Text className="text-indigo-950 font-black text-2xl tracking-tighter -mt-1">{item.day}</Text></View>
              </View>
            </View>

            <View className="flex-1 pr-2">
              <View className="flex-row items-center mb-1">
                {item.isMine && <View className="bg-green-100 px-2 py-0.5 rounded-md mr-2"><Text className="text-green-700 text-[8px] font-bold uppercase">Owner</Text></View>}
                <Text className="text-gray-400 text-[10px] font-bold uppercase tracking-widest" numberOfLines={1}>{item.organizer}</Text>
              </View>
              <Text className="text-lg font-bold text-gray-900" numberOfLines={1}>{item.title}</Text>
              <View className="flex-row items-center mt-1">
                <MapPin size={12} color="#9CA3AF" /><Text className="text-gray-400 text-xs ml-1" numberOfLines={1}>{item.location}</Text>
              </View>
            </View>
          </TouchableOpacity>

          {(onEdit || onDelete) && (
            <View className="pr-5 justify-center"> 
              <TouchableOpacity onPress={() => setShowMenu(!showMenu)} className={`p-2 rounded-full ${showMenu ? 'bg-indigo-50' : 'bg-gray-50'}`}>
                <MoreVertical size={20} color={showMenu ? "#4F46E5" : "#6B7280"} />
              </TouchableOpacity>
            </View>
          )}
        </View>
      </View>
    </>
  );
}