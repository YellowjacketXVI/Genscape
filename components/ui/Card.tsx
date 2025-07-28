import React from 'react';
import { View, StyleSheet, ViewStyle } from 'react-native';
import { useTheme } from '@/contexts/ThemeContext';

interface CardProps {
  children: React.ReactNode;
  style?: ViewStyle;
  padding?: keyof typeof import('@/theme').spacing;
  shadow?: boolean;
  borderRadius?: keyof typeof import('@/theme').borderRadius;
}

export default function Card({
  children,
  style,
  padding = 'md',
  shadow = true,
  borderRadius = 'lg',
}: CardProps) {
  const theme = useTheme();

  const cardStyle: ViewStyle = {
    backgroundColor: theme.colors.cardBackground,
    borderRadius: theme.borderRadius[borderRadius],
    padding: theme.spacing[padding],
    borderWidth: 1,
    borderColor: theme.colors.cardBorder,
    ...(shadow ? theme.shadows.md : {}),
  };

  return <View style={[cardStyle, style]}>{children}</View>;
}

const styles = StyleSheet.create({
  // Additional styles can be added here if needed
});
