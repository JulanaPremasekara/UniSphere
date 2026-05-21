import { Link } from 'expo-router';
import { useUser } from "@/hooks/useUser";
import { GraduationCap, User } from "lucide-react-native";
import React from "react";
import { Text, TouchableOpacity, View, Platform } from "react-native";
import { Avatar, AvatarImage } from "@/components/ui/avatar";
import { Icon } from "@/components/ui/icon";
import { useTheme } from "@/context/ThemeContext";

type AppHeaderProps = {
  title: string;
  subtitle?: string;
  avatarUrl?: string;
  onLeftPress?: () => void;
  onRightPress?: () => void;
  leftIcon?: React.ReactNode;
};

const AppHeader = ({
  title,
}: AppHeaderProps) => {
  const { user } = useUser();
  const { colors } = useTheme();

  const avatarUri = user?.image
    ? user.image.startsWith('http')
      ? user.image
      : `${process.env.EXPO_PUBLIC_API_URL}${user.image}`
    : null;

  return (
    <View
      style={{
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "space-between",
        paddingHorizontal: 20,
        paddingBottom: 16,
        paddingTop: Platform.OS === "ios" ? 60 : 50,
        backgroundColor: colors.navBg,
        borderBottomWidth: 1,
        borderBottomColor: colors.navBorder,
      }}
    >
      <View style={{ flexDirection: "row", alignItems: "center" }}>
        <View
          style={{
            backgroundColor: colors.primary,
            padding: 8,
            borderRadius: 12,
          }}
        >
          <GraduationCap size={20} color="white" strokeWidth={2.5} />
        </View>
      </View>

      <View style={{ flexDirection: "row", alignItems: "flex-start", paddingBottom: 16 }}>
        <Text
          style={{
            fontSize: 24,
            fontWeight: "800",
            color: colors.primary,
            letterSpacing: -0.5,
          }}
        >
          {title}
        </Text>
      </View>

      {user ? (
        <Link href="/profile" asChild>
          <TouchableOpacity>
            <View style={{ position: "relative" }}>
              <Avatar
                style={{
                  backgroundColor: colors.primary,
                  width: 48,
                  height: 48,
                  borderRadius: 24,
                }}
              >
                {avatarUri ? (
                  <AvatarImage
                    source={{ uri: avatarUri }}
                    style={{ width: "100%", height: "100%", borderRadius: 24 }}
                  />
                ) : (
                  <Icon as={User} size="lg" style={{ color: "white" }} />
                )}
              </Avatar>
              <View
                style={{
                  position: "absolute",
                  bottom: 0,
                  right: 0,
                  width: 14,
                  height: 14,
                  borderRadius: 7,
                  borderWidth: 2,
                  borderColor: colors.navBg,
                  backgroundColor: "#22c55e",
                }}
              />
            </View>
          </TouchableOpacity>
        </Link>
      ) : (
        <Link href="/login" asChild>
          <TouchableOpacity>
            <User color={colors.text} size={24} />
          </TouchableOpacity>
        </Link>
      )}
    </View>
  );
};

export default AppHeader;