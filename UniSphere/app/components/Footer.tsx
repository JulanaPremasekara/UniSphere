import { usePathname, useRouter } from "expo-router";
import { Home, Compass, Users, Calendar, User } from "lucide-react-native";
import React from "react";
import { Text, TouchableOpacity, View } from "react-native";

export default function Footer() {
  const router = useRouter();
  const pathname = usePathname();

  const tabs = [
    { name: "HOME", icon: Home, path: "/" },
    { name: "EXPLORE", icon: Compass, path: "/explore" },
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
            className="items-center justify-center"
          >
            <View 
              className={`items-center justify-center px-4 py-2 rounded-[20px] ${
                active ? "bg-indigo-50" : "bg-transparent"
              }`}
            >
              <tab.icon 
                size={22} 
                color={active ? "#4F46E5" : "#9CA3AF"} 
                strokeWidth={active ? 2.5 : 2}
              />
              <Text 
                className={`text-[10px] mt-1 font-bold tracking-tighter ${
                  active ? "text-indigo-600" : "text-gray-400"
                }`}
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