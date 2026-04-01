import { usePathname, useRouter } from "expo-router";
import { Home, Compass, Users, Calendar, User, Search, BookOpen } from "lucide-react-native";
import React from "react";
import { Text, TouchableOpacity, View } from "react-native";

export default function Footer() {
  const router = useRouter();
  const pathname = usePathname();

  const tabs = [
    { name: "HOME", icon: Home, path: "/" },
    { name: "TUTORS", icon: BookOpen, path: "/tutors" },
    { name: "LOST &\nFOUND", icon: Search, path: "/lost-and-found" },
    { name: "GROUPS", icon: Users, path: "/groups" },
    { name: "EVENTS", icon: Calendar, path: "/events" },
    { name: "PROFILE", icon: User, path: "/profile" },
  ];

  const isActive = (path: string) => {
    if (path === "/") return pathname === "/";
    return pathname.startsWith(path);
  };

  return (
    <View 
      className="flex-row justify-around items-center bg-white border-t border-gray-50 pt-3 pb-8 px-2 rounded-t-[35px] shadow-lg absolute bottom-0 w-full"
      style={{ elevation: 20 }} // Adds shadow for Android
    >
      {tabs.map((tab) => {
        const active = isActive(tab.path);
        
        return (
          <TouchableOpacity
              key={tab.name}
              onPress={() => router.push(tab.path as any)}
              activeOpacity={0.7}
              className="flex-1 items-center justify-center"
            >
              <View 
                className={`items-center justify-center rounded-[20px] ${
                  active ? "bg-indigo-50 px-2 py-1" : "bg-transparent py-1"
                }`}
              >
                <tab.icon 
                  size={20} // Slightly smaller icon to save vertical space
                  color={active ? "#4F46E5" : "#9CA3AF"} 
                  strokeWidth={active ? 2.5 : 2}
                />
                <Text 
                  numberOfLines={2}
                  className={`text-[10px] font-bold text-center leading-[9px] mt-0.5 ${
                    active ? "text-indigo-600" : "text-gray-400"
                  }`}
                  style={{ width: 55 }} // Constrain width to force the wrap precisely
                >
                  {tab.name}
                </Text>
              </View>
            </TouchableOpacity>
        );
      })}
    </View>
  );
}