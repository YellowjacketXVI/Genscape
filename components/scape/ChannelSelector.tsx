import { useState } from 'react';
import { StyleSheet, Text, View, TouchableOpacity, Modal, Dimensions, useWindowDimensions } from 'react-native';
import AppContainer from '@/components/layout/AppContainer';
import { X } from 'lucide-react-native';
import Colors from '@/constants/Colors';

type Channel = {
  id: string;
  name: string;
  color: string;
};

type ChannelSelectorProps = {
  visible: boolean;
  onClose: () => void;
  onSelect: (channelId: string) => void;
  currentChannel: string;
};

export default function ChannelSelector({
  visible,
  onClose,
  onSelect,
  currentChannel
}: ChannelSelectorProps) {
  const channels: Channel[] = [
    {
      id: 'red',
      name: 'Red Channel',
      color: '#F15A29',
    },
    {
      id: 'green',
      name: 'Green Channel',
      color: '#2D8E46',
    },
    {
      id: 'blue',
      name: 'Blue Channel',
      color: '#3498db',
    },
    {
      id: 'neutral',
      name: 'Neutral (No Channel)',
      color: '#888888',
    },
  ];

  const handleSelect = (channelId: string) => {
    onSelect(channelId);
    onClose();
  };

  // Detect if we're on desktop or mobile
  const { width } = useWindowDimensions();
  const isDesktop = width > 768;

  return (
    <Modal
      visible={visible}
      transparent={true}
      animationType="fade"
      onRequestClose={onClose}
    >
      <AppContainer>
        <View style={styles.modalOverlay}>
          <View style={[styles.modalContent, { maxWidth: isDesktop ? 500 : '100%' }]}>
          <View style={styles.modalHeader}>
            <Text style={styles.modalTitle}>Select Channel</Text>
            <TouchableOpacity style={styles.closeButton} onPress={onClose}>
              <X size={24} color={Colors.text.primary} />
            </TouchableOpacity>
          </View>

          <Text style={styles.description}>
            Channels allow widgets to interact with each other. Widgets in the same channel can share information.
          </Text>

          <View style={styles.channelsContainer}>
            {channels.map(channel => (
              <TouchableOpacity
                key={channel.id}
                style={[
                  styles.channelOption,
                  currentChannel === channel.id && styles.selectedChannel,
                ]}
                onPress={() => handleSelect(channel.id)}
              >
                <View
                  style={[
                    styles.channelColor,
                    { backgroundColor: channel.color }
                  ]}
                />
                <Text style={styles.channelName}>{channel.name}</Text>
                {currentChannel === channel.id && (
                  <View style={styles.selectedIndicator} />
                )}
              </TouchableOpacity>
            ))}
          </View>
        </View>
      </View>
      </AppContainer>
    </Modal>
  );
}

const styles = StyleSheet.create({
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.7)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 16,
  },
  modalContent: {
    backgroundColor: Colors.background.dark,
    borderRadius: 12,
    width: '100%',
    padding: 24,
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  modalTitle: {
    fontFamily: 'Inter-Bold',
    fontSize: 20,
    color: Colors.text.primary,
  },
  closeButton: {
    padding: 4,
  },
  description: {
    fontFamily: 'Inter-Regular',
    fontSize: 16,
    color: Colors.text.secondary,
    marginBottom: 24,
    lineHeight: 24,
  },
  channelsContainer: {
    marginBottom: 16,
  },
  channelOption: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.background.medium,
    borderRadius: 8,
    padding: 16,
    marginBottom: 12,
    borderWidth: 2,
    borderColor: 'transparent',
  },
  selectedChannel: {
    borderColor: Colors.primary,
    backgroundColor: Colors.background.light,
  },
  channelColor: {
    width: 24,
    height: 24,
    borderRadius: 12,
    marginRight: 16,
  },
  channelName: {
    fontFamily: 'Inter-Medium',
    fontSize: 16,
    color: Colors.text.primary,
    flex: 1,
  },
  selectedIndicator: {
    width: 12,
    height: 12,
    borderRadius: 6,
    backgroundColor: Colors.primary,
  },
});
