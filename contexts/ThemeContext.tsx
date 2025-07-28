import React, { createContext, useContext } from 'react';
import { theme, Theme } from '@/theme';

interface ThemeContextType {
  theme: Theme;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  return (
    <ThemeContext.Provider value={{ theme }}>
      {children}
    </ThemeContext.Provider>
  );
}

export function useTheme() {
  const context = useContext(ThemeContext);
  if (context === undefined) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context.theme;
}

// Convenience hooks for specific theme parts
export function useColors() {
  return useTheme().colors;
}

export function useSpacing() {
  return useTheme().spacing;
}

export function useTypography() {
  return useTheme().typography;
}
