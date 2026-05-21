import React, { createContext, useContext, useEffect, useState } from 'react';
import { Appearance } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

const THEME_KEY = 'unisphere_theme';

export const darkColors = {
  bg: '#111827',
  bgCard: '#1F2937',
  bgInput: '#374151',
  border: '#374151',
  borderLight: '#4B5563',
  text: '#F9FAFB',
  textSecondary: '#9CA3AF',
  textMuted: '#6B7280',
  tabBg: '#312E81',
  tabActive: '#EEF2FF',
  navBg: '#1F2937',
  navBorder: '#374151',
  icon: '#9CA3AF',
  iconActive: '#818CF8',
  primary: '#6366F1',
  primaryLight: '#312E81',
  white: '#1F2937',
  statusBar: 'light' as const,
};

export const lightColors = {
  bg: '#FFFFFF',
  bgCard: '#F9FAFB',
  bgInput: '#F3F4F6',
  border: '#F3F4F6',
  borderLight: '#E5E7EB',
  text: '#111827',
  textSecondary: '#4B5563',
  textMuted: '#9CA3AF',
  tabBg: '#EEF2FF',
  tabActive: '#EEF2FF',
  navBg: '#FFFFFF',
  navBorder: '#F3F4F6',
  icon: '#9CA3AF',
  iconActive: '#4F46E5',
  primary: '#4F46E5',
  primaryLight: '#EEF2FF',
  white: '#FFFFFF',
  statusBar: 'dark' as const,
};

type Colors = {
  bg: string;
  bgCard: string;
  bgInput: string;
  border: string;
  borderLight: string;
  text: string;
  textSecondary: string;
  textMuted: string;
  tabBg: string;
  tabActive: string;
  navBg: string;
  navBorder: string;
  icon: string;
  iconActive: string;
  primary: string;
  primaryLight: string;
  white: string;
  statusBar: 'dark' | 'light';
};

type ThemeContextType = {
  isDark: boolean;
  colors: Colors;
  toggleTheme: () => void;
};

const ThemeContext = createContext<ThemeContextType>({
  isDark: false,
  colors: lightColors,
  toggleTheme: () => {},
});

export const ThemeProvider = ({ children }: { children: React.ReactNode }) => {
  const [isDark, setIsDark] = useState(false);

  useEffect(() => {
    AsyncStorage.getItem(THEME_KEY).then((saved) => {
      if (saved !== null) {
        const dark = saved === 'dark';
        setIsDark(dark);
        Appearance.setColorScheme(dark ? 'dark' : 'light');
      }
    });
  }, []);

  const toggleTheme = async () => {
    const next = !isDark;
    setIsDark(next);
    Appearance.setColorScheme(next ? 'dark' : 'light');
    await AsyncStorage.setItem(THEME_KEY, next ? 'dark' : 'light');
  };

  const colors = isDark ? darkColors : lightColors;

  return (
    <ThemeContext.Provider value={{ isDark, colors, toggleTheme }}>
      {children}
    </ThemeContext.Provider>
  );
};

export const useTheme = () => useContext(ThemeContext);
