/// <reference types="nativewind/types" />
import { Edit2, MapPin, MoreVertical, Trash2 } from 'lucide-react-native';
import React, { useState } from 'react';
import { Dimensions, Platform, Pressable, Text, TouchableOpacity, View } from 'react-native';
import { useTheme } from "@/context/ThemeContext";

const { width, height } = Dimensions.get('window');

interface EventCardProps {
  item: { id: string; title: string; month: string; day: string; location: string; organizer: string; isMine?: boolean; };
  onPress: () => void;
  onEdit?: () => void;
  onDelete?: () => void;
}

export default function EventCard({ item, onPress, onEdit, onDelete }: EventCardProps) {
  const [showMenu, setShowMenu] = useState(false);
  const { colors, isDark } = useTheme();

  const handleAction = (action: () => void) => { action(); setShowMenu(false); };

  return (
    <>
      {showMenu && <Pressable onPress={() => setShowMenu(false)} style={{ position: 'absolute', top: -height, left: -width, width: width * 3, height: height * 3, zIndex: 50 }} />}

      <View style={{ zIndex: showMenu ? 100 : 1, marginBottom: 16 }}>
        {showMenu && (
          <View
            style={{
              position: 'absolute',
              right: 24,
              top: 64,
              backgroundColor: colors.bgCard,
              borderColor: colors.border,
              borderWidth: 1,
              borderRadius: 24,
              width: 192,
              overflow: 'hidden',
              zIndex: 9999,
              ...Platform.select({
                ios: { shadowColor: '#000', shadowOffset: { width: 0, height: 12 }, shadowOpacity: 0.2, shadowRadius: 16 },
                android: { elevation: 24 }
              })
            }}
          >
            {onEdit && (
              <TouchableOpacity
                onPress={() => handleAction(onEdit)}
                style={{ flexDirection: 'row', alignItems: 'center', padding: 20, borderBottomWidth: 1, borderBottomColor: colors.border }}
              >
                <Edit2 size={18} color={colors.primary} />
                <Text style={{ color: colors.text }} className="ml-4 font-bold text-base">Edit Event</Text>
              </TouchableOpacity>
            )}
            {onDelete && (
              <TouchableOpacity
                onPress={() => handleAction(onDelete)}
                style={{ flexDirection: 'row', alignItems: 'center', padding: 20 }}
              >
                <Trash2 size={18} color="#EF4444" />
                <Text className="ml-4 font-bold text-red-500 text-base">Delete Event</Text>
              </TouchableOpacity>
            )}
          </View>
        )}

        <View
          style={{
            backgroundColor: colors.bgCard,
            borderRadius: 35,
            borderWidth: 1,
            borderColor: colors.border,
            flexDirection: 'row',
          }}
          className="shadow-sm"
        >
          <TouchableOpacity onPress={() => showMenu ? setShowMenu(false) : onPress()} activeOpacity={0.8} style={{ flexDirection: 'row', flex: 1, padding: 20, alignItems: 'center' }}>
            <View style={{ marginRight: 20, alignItems: 'center', justifyContent: 'center' }}>
              <View style={{ backgroundColor: colors.white, width: 64, height: 80, borderRadius: 22, overflow: 'hidden', borderWidth: 1, borderColor: colors.border }} className="shadow-sm">
                <View style={{ backgroundColor: colors.primary, paddingVertical: 6, width: '100%', alignItems: 'center' }}>
                  <Text className="text-white font-bold text-[10px] uppercase tracking-tighter">{item.month}</Text>
                </View>
                <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center', backgroundColor: colors.white }}>
                  <Text style={{ color: colors.text }} className="font-black text-2xl tracking-tighter -mt-1">{item.day}</Text>
                </View>
              </View>
            </View>

            <View style={{ flex: 1, paddingRight: 8 }}>
              <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 4 }}>
                {item.isMine && (
                  <View style={{ backgroundColor: 'rgba(34, 197, 94, 0.15)', paddingHorizontal: 8, paddingVertical: 2, borderRadius: 6, marginRight: 8 }}>
                    <Text style={{ color: '#22c55e', fontSize: 8, fontWeight: 'bold' }}>OWNER</Text>
                  </View>
                )}
                <Text style={{ color: colors.textMuted }} className="text-[10px] font-bold uppercase tracking-widest" numberOfLines={1}>{item.organizer}</Text>
              </View>
              <Text style={{ color: colors.text }} className="text-lg font-bold" numberOfLines={1}>{item.title}</Text>
              <View style={{ flexDirection: 'row', alignItems: 'center', marginTop: 4 }}>
                <MapPin size={12} color={colors.textMuted} />
                <Text style={{ color: colors.textSecondary }} className="text-xs ml-1" numberOfLines={1}>{item.location}</Text>
              </View>
            </View>
          </TouchableOpacity>

          {(onEdit || onDelete) && (
            <View style={{ paddingRight: 20, justifyContent: 'center' }}> 
              <TouchableOpacity
                onPress={() => setShowMenu(!showMenu)}
                style={{
                  padding: 8,
                  borderRadius: 9999,
                  backgroundColor: showMenu ? colors.primaryLight : colors.bgInput
                }}
              >
                <MoreVertical size={20} color={showMenu ? colors.primary : colors.textMuted} />
              </TouchableOpacity>
            </View>
          )}
        </View>
      </View>
    </>
  );
}