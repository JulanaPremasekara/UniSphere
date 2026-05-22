import { usePathname, useRouter } from "expo-router";
import { Home, Users, Calendar, User, Search, BookOpen } from "lucide-react-native";
import React from "react";
import { Text, TouchableOpacity, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useTheme } from "@/context/ThemeContext";

export default function Footer() {
  const router = useRouter();
  const pathname = usePathname();
  const insets = useSafeAreaInsets();
  const { colors } = useTheme();

  const tabs = [
    { name: "HOME", icon: Home, path: "/" },
    { name: "TUTORS", icon: BookOpen, path: "/tutors" },
    { name: "LOST &\nFOUND", icon: Search, path: "/lost" },
    { name: "GROUPS", icon: Users, path: "/studyGroup" },
    { name: "EVENTS", icon: Calendar, path: "/events" },
    { name: "PROFILE", icon: User, path: "/profile" },
  ];

  const isActive = (path: string) =>
    path === "/" ? pathname === "/" : pathname.startsWith(path);

  const paddingBottom = Math.max(insets.bottom, 16);

  return (
        <View
        style={{
          position: "absolute", // <--- CRITICAL: Float over content
          bottom: 0,            // <--- Pin to bottom
          left: 0,              // <--- Stretch full width
          right: 0,             // <--- Stretch full width
          flexDirection: "row",
          justifyContent: "space-around",
          alignItems: "center",
          backgroundColor: colors.navBg,
          borderTopWidth: 1,
          borderTopColor: colors.navBorder,
          paddingTop: 8,
          paddingHorizontal: 8,
          borderTopLeftRadius: 35,
          borderTopRightRadius: 35,
          elevation: 20,
          shadowColor: "#000",
          shadowOffset: { width: 0, height: -4 },
          shadowOpacity: 0.06,
          shadowRadius: 12,
          paddingBottom,
          height: 70 + paddingBottom,
        }}
      >
      {tabs.map((tab) => {
        const active = isActive(tab.path);
        return (
          <TouchableOpacity
            key={tab.name}
            onPress={() => router.push(tab.path as any)}
            activeOpacity={0.7}
            style={{ flex: 1, alignItems: "center", justifyContent: "center" }}
          >
            <View
              style={{
                alignItems: "center",
                justifyContent: "center",
                backgroundColor: active ? colors.primaryLight : "transparent",
                borderRadius: 16,
                paddingHorizontal: 8,
                paddingVertical: 4,
                overflow: "hidden",
              }}
            >
              <tab.icon
                size={20}
                color={active ? colors.iconActive : colors.icon}
                strokeWidth={active ? 2.5 : 2}
              />
              <Text
                numberOfLines={2}
                style={{
                  width: 50,
                  fontSize: 9,
                  fontWeight: "bold",
                  textAlign: "center",
                  lineHeight: 10,
                  marginTop: 4,
                  color: active ? colors.iconActive : colors.icon,
                }}
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