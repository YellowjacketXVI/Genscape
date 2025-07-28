import React from 'react';
import {
  View,
  Image,
  Text,
  StyleSheet,
  ViewStyle,
  TextStyle,
} from 'react-native';
import { useTheme } from '@/contexts/ThemeContext';

interface AvatarProps {
  source?: { uri: string } | number;
  size?: keyof typeof import('@/theme').layout.avatarSizes;
  fallbackText?: string;
  style?: ViewStyle;
  online?: boolean;
}

export default function Avatar({
  source,
  size = 'md',
  fallbackText,
  style,
  online,
}: AvatarProps) {
  const theme = useTheme();
  const avatarSize = theme.layout.avatarSizes[size];

  const containerStyle: ViewStyle = {
    width: avatarSize,
    height: avatarSize,
    borderRadius: avatarSize / 2,
    backgroundColor: theme.colors.surface,
    alignItems: 'center',
    justifyContent: 'center',
    overflow: 'hidden',
    position: 'relative',
  };

  const imageStyle: ViewStyle = {
    width: '100%',
    height: '100%',
  };

  const fallbackTextStyle: TextStyle = {
    fontFamily: 'Inter-Medium',
    fontSize: avatarSize * 0.4,
    fontWeight: theme.typography.fontWeight.medium,
    color: theme.colors.textSecondary,
  };

  const onlineIndicatorStyle: ViewStyle = {
    position: 'absolute',
    bottom: 0,
    right: 0,
    width: avatarSize * 0.25,
    height: avatarSize * 0.25,
    borderRadius: (avatarSize * 0.25) / 2,
    backgroundColor: theme.colors.online,
    borderWidth: 2,
    borderColor: theme.colors.background,
  };

  const renderContent = () => {
    if (source) {
      return (
        <Image
          source={source}
          style={imageStyle}
          resizeMode="cover"
        />
      );
    }

    if (fallbackText) {
      const initials = fallbackText
        .split(' ')
        .map(word => word.charAt(0))
        .join('')
        .toUpperCase()
        .slice(0, 2);

      return (
        <Text style={fallbackTextStyle}>
          {initials}
        </Text>
      );
    }

    return null;
  };

  return (
    <View style={[containerStyle, style]}>
      {renderContent()}
      {online && <View style={onlineIndicatorStyle} />}
    </View>
  );
}

const styles = StyleSheet.create({
  // Additional styles can be added here if needed
});
