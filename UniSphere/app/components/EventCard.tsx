import { View, Text, TouchableOpacity, Platform, Pressable, Dimensions } from 'react-native';
import { MapPin, MoreVertical, Edit2, Trash2 } from 'lucide-react-native';
import React, { useState } from 'react';

// Get screen dimensions to ensure the backdrop covers everything
const { width, height } = Dimensions.get('window');

interface EventItem {
  id: string;
  title: string;
  month: string;
  day: string;
  location: string;
  organizer: string;
  isMine?: boolean;
}

interface EventCardProps {
  item: EventItem;
  onPress: () => void;
  onEdit?: () => void;
  onDelete?: () => void;
}

export default function EventCard({ item, onPress, onEdit, onDelete }: EventCardProps) {
  const [showMenu, setShowMenu] = useState(false);

  const handleAction = (action: () => void) => {
    setShowMenu(false);
    action();
  };

  return (
    <>
      {/* 1. GLOBAL BACKDROP 
          We use a very high zIndex and absolute positioning based on screen size.
          This sits BEHIND the menu but ABOVE everything else on the page. */}
      {showMenu && (
        <Pressable 
          onPress={() => setShowMenu(false)}
          style={{
            position: 'absolute',
            top: -height, // Cover far above
            left: -width,  // Cover far left
            width: width * 3, 
            height: height * 3,
            zIndex: 50,
            backgroundColor: 'transparent',
          }}
        />
      )}

      <View style={{ zIndex: showMenu ? 100 : 1 }} className="mb-4">
        <TouchableOpacity 
          onPress={() => {
            if (showMenu) setShowMenu(false);
            else onPress();
          }}
          activeOpacity={0.8}
          className="bg-white rounded-[35px] p-5 shadow-sm border border-gray-100 flex-row justify-between items-center"
        >
          <View className="flex-row flex-1 items-center">
            {/* Date Block */}
            <View className="mr-5 items-center justify-center">
              <View className="bg-white w-16 h-20 rounded-[22px] overflow-hidden shadow-sm border border-gray-100">
                <View className="bg-indigo-600 py-1.5 w-full items-center">
                  <Text className="text-white font-bold text-[10px] uppercase tracking-tighter">
                    {item.month}
                  </Text>
                </View>
                <View className="flex-1 items-center justify-center bg-white">
                  <Text className="text-indigo-950 font-black text-2xl tracking-tighter -mt-1">
                    {item.day}
                  </Text>
                </View>
              </View>
            </View>

            {/* Info Section */}
            <View className="flex-1 pr-2">
              <View className="flex-row items-center mb-1">
                {item.isMine && (
                  <View className="bg-green-100 px-2 py-0.5 rounded-md mr-2">
                    <Text className="text-green-700 text-[8px] font-bold uppercase">Owner</Text>
                  </View>
                )}
                <Text className="text-gray-400 text-[10px] font-bold uppercase tracking-widest" numberOfLines={1}>
                  {item.organizer}
                </Text>
              </View>
              
              <Text className="text-lg font-bold text-gray-900" numberOfLines={1}>
                {item.title}
              </Text>
              
              <View className="flex-row items-center mt-1">
                <MapPin size={12} color="#9CA3AF" />
                <Text className="text-gray-400 text-xs ml-1" numberOfLines={1}>
                  {item.location}
                </Text>
              </View>
            </View>
          </View>

          {/* Options Button Area */}
          {(onEdit || onDelete) && (
            <View className="relative" style={{ zIndex: 110 }}> 
              <TouchableOpacity 
                onPress={() => setShowMenu(!showMenu)} 
                className={`p-2 rounded-full ${showMenu ? 'bg-indigo-50' : 'bg-gray-50'}`}
              >
                <MoreVertical size={20} color={showMenu ? "#4F46E5" : "#6B7280"} />
              </TouchableOpacity>

              {showMenu && (
                <View 
                  className="absolute right-0 top-12 bg-white border border-gray-100 rounded-2xl w-40 overflow-hidden shadow-2xl"
                  style={{ 
                    zIndex: 120,
                    ...Platform.select({
                      ios: { shadowColor: '#000', shadowOffset: { width: 0, height: 8 }, shadowOpacity: 0.15, shadowRadius: 12 },
                      android: { elevation: 12 }
                    })
                  }}
                >
                  <TouchableOpacity 
                    onPress={() => handleAction(onEdit!)}
                    className="flex-row items-center p-4 border-b border-gray-50 active:bg-indigo-50"
                  >
                    <Edit2 size={16} color="#4F46E5" />
                    <Text className="ml-3 font-bold text-gray-700">Edit</Text>
                  </TouchableOpacity>
                  
                  <TouchableOpacity 
                    onPress={() => handleAction(onDelete!)}
                    className="flex-row items-center p-4 active:bg-red-50"
                  >
                    <Trash2 size={16} color="#EF4444" />
                    <Text className="ml-3 font-bold text-red-500">Delete</Text>
                  </TouchableOpacity>
                </View>
              )}
            </View>
          )}
        </TouchableOpacity>
      </View>
    </>
  );
}