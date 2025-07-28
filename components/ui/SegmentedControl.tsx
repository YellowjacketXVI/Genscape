import React from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  ViewStyle,
  TextStyle,
} from 'react-native';
import { useTheme } from '@/contexts/ThemeContext';

interface SegmentedControlProps<T extends string> {
  segments: readonly T[];
  selectedSegment: T;
  onSegmentChange: (segment: T) => void;
  style?: ViewStyle;
  segmentLabels?: Record<T, string>;
}

export default function SegmentedControl<T extends string>({
  segments,
  selectedSegment,
  onSegmentChange,
  style,
  segmentLabels,
}: SegmentedControlProps<T>) {
  const theme = useTheme();

  const getSegmentLabel = (segment: T): string => {
    if (segmentLabels && segmentLabels[segment]) {
      return segmentLabels[segment];
    }
    return segment.charAt(0).toUpperCase() + segment.slice(1);
  };

  const containerStyle: ViewStyle = {
    flexDirection: 'row',
    backgroundColor: theme.colors.surface,
    borderRadius: theme.borderRadius.lg,
    padding: theme.spacing.xs,
    ...theme.shadows.sm,
  };

  const getSegmentStyle = (isActive: boolean): ViewStyle => ({
    flex: 1,
    paddingVertical: theme.spacing.sm,
    paddingHorizontal: theme.spacing.md,
    borderRadius: theme.borderRadius.md,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: isActive ? theme.colors.primary : 'transparent',
  });

  const getSegmentTextStyle = (isActive: boolean): TextStyle => ({
    fontFamily: 'Inter-Medium',
    fontSize: theme.typography.fontSize.sm,
    fontWeight: theme.typography.fontWeight.medium,
    color: isActive ? '#FFFFFF' : theme.colors.textSecondary,
  });

  return (
    <View style={[containerStyle, style]}>
      {segments.map((segment) => {
        const isActive = segment === selectedSegment;
        return (
          <TouchableOpacity
            key={segment}
            style={getSegmentStyle(isActive)}
            onPress={() => onSegmentChange(segment)}
            accessibilityRole="button"
            accessibilityState={{ selected: isActive }}
            accessibilityLabel={getSegmentLabel(segment)}
          >
            <Text style={getSegmentTextStyle(isActive)}>
              {getSegmentLabel(segment)}
            </Text>
          </TouchableOpacity>
        );
      })}
    </View>
  );
}

const styles = StyleSheet.create({
  // Additional styles can be added here if needed
});
