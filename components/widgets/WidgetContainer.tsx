import { StyleSheet, View, TouchableOpacity } from 'react-native';
import { Widget } from '@/types/widget';
import HeroWidget from './HeroWidget';
import CarouselWidget from './CarouselWidget';
import ShopWidget from './ShopWidget';
import AudioWidget from './AudioWidget';
import GalleryWidget from './GalleryWidget';
import LiveWidget from './LiveWidget';
import ButtonWidget from './ButtonWidget';
import TextWidget from './TextWidget';
import Colors from '@/constants/Colors';

type Props = {
  widget: Widget;
  onMediaSelect: () => void;
};

export default function WidgetContainer({ widget, onMediaSelect }: Props) {
  const getWidgetComponent = () => {
    switch (widget.type) {
      case 'hero':
        return <HeroWidget widget={widget} />;
      case 'carousel':
        return <CarouselWidget widget={widget} />;
      case 'shop':
        return <ShopWidget widget={widget} />;
      case 'audio':
        return <AudioWidget widget={widget} />;
      case 'gallery':
        return <GalleryWidget widget={widget} />;
      case 'live':
        return <LiveWidget widget={widget} />;
      case 'button':
        return <ButtonWidget widget={widget} />;
      case 'text':
        return <TextWidget widget={widget} />;
      default:
        return null;
    }
  };

  const getWidgetWidth = () => {
    const baseWidth = 100 / 3; // For 3-column layout
    return {
      width: `${baseWidth * widget.size.width}%`,
    };
  };

  return (
    <TouchableOpacity 
      style={[styles.container, getWidgetWidth()]} 
      onPress={onMediaSelect}
      activeOpacity={0.8}
    >
      <View style={[styles.widgetContent, { height: 240 }]}>
        {getWidgetComponent()}
      </View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 8,
  },
  widgetContent: {
    backgroundColor: Colors.background.medium,
    borderRadius: 12,
    overflow: 'hidden',
  },
});