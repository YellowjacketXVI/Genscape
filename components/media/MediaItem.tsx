import { StyleSheet, Text, View, Image, TouchableOpacity } from 'react-native';
import { Music, Video, Image as ImageIcon, Check, Globe, Lock } from 'lucide-react-native';
import Colors from '@/constants/Colors';
import { useState } from 'react';
import { MediaItem as MediaItemType } from '@/types/media';

type MediaItemProps = {
  item: MediaItemType;
  onSelect?: (item: MediaItemType) => void;
  selectable?: boolean;
};

export default function MediaItem({ item, onSelect, selectable = false }: MediaItemProps) {
  const [selected, setSelected] = useState(false);

  const toggleSelect = () => {
    if (selectable) {
      setSelected(!selected);
      onSelect?.(item);
    }
  };

  const getTypeIcon = () => {
    switch (item.media_type) {
      case 'audio':
        return <Music size={18} color="#FFF" />;
      case 'video':
        return <Video size={18} color="#FFF" />;
      default:
        return <ImageIcon size={18} color="#FFF" />;
    }
  };

  return (
    <TouchableOpacity style={styles.container} onPress={toggleSelect}>
      <View style={styles.preview}>
        <Image
          source={{ uri: item.thumbnail_url || item.url || '' }}
          style={styles.previewImage}
          resizeMode="cover"
        />
        <View style={styles.typeIcon}>
          {getTypeIcon()}
        </View>
        <View style={styles.visibilityIcon}>
          {item.is_public ? (
            <Globe size={14} color="#FFF" />
          ) : (
            <Lock size={14} color="#FFF" />
          )}
        </View>
        {selected && selectable && (
          <View style={styles.selectedOverlay}>
            <View style={styles.checkIcon}>
              <Check size={18} color="#FFF" />
            </View>
          </View>
        )}
      </View>
      <Text style={styles.name} numberOfLines={1}>{item.name}</Text>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  container: {
    width: 120,
    marginRight: 12,
  },
  preview: {
    width: 120,
    height: 120,
    borderRadius: 8,
    overflow: 'hidden',
    marginBottom: 8,
    position: 'relative',
  },
  previewImage: {
    width: '100%',
    height: '100%',
  },
  typeIcon: {
    position: 'absolute',
    top: 8,
    right: 8,
    backgroundColor: 'rgba(0, 0, 0, 0.6)',
    width: 28,
    height: 28,
    borderRadius: 14,
    alignItems: 'center',
    justifyContent: 'center',
  },
  visibilityIcon: {
    position: 'absolute',
    top: 8,
    left: 8,
    backgroundColor: 'rgba(0, 0, 0, 0.6)',
    width: 24,
    height: 24,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },
  selectedOverlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(241, 90, 41, 0.5)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  checkIcon: {
    backgroundColor: Colors.primary,
    width: 36,
    height: 36,
    borderRadius: 18,
    alignItems: 'center',
    justifyContent: 'center',
  },
  name: {
    fontFamily: 'Inter-Medium',
    fontSize: 14,
    color: Colors.text.primary,
  },
});