import React from 'react';
import {
  StyleSheet,
  View,
  TouchableOpacity,
} from 'react-native';
import { ChannelColor } from '@/types/scape-editor';
import { getChannelColor } from '@/utils/widget-utils';

interface ChannelSelectorProps {
  selectedChannel: ChannelColor | null;
  onChannelChange: (channel: ChannelColor) => void;
  size?: 'small' | 'medium';
}

const CHANNELS: ChannelColor[] = ['red', 'green', 'blue', 'neutral'];

export default function ChannelSelector({
  selectedChannel,
  onChannelChange,
  size = 'medium',
}: ChannelSelectorProps) {
  const buttonSize = size === 'small' ? 24 : 32;
  const borderWidth = size === 'small' ? 2 : 3;

  return (
    <View style={styles.container}>
      {CHANNELS.map((channel) => {
        const isSelected = selectedChannel === channel;
        const channelColor = getChannelColor(channel);
        
        return (
          <TouchableOpacity
            key={channel}
            style={[
              styles.channelButton,
              {
                width: buttonSize,
                height: buttonSize,
                borderRadius: buttonSize / 2,
                backgroundColor: channelColor,
                borderWidth: isSelected ? borderWidth : 1,
                borderColor: isSelected ? '#FFFFFF' : 'transparent',
              },
            ]}
            onPress={() => onChannelChange(channel)}
            activeOpacity={0.8}
          />
        );
      })}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    gap: 8,
  },
  channelButton: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.2,
    shadowRadius: 2,
    elevation: 2,
  },
});
