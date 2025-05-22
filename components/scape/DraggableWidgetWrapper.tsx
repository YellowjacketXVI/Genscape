import React, { useRef } from 'react';
import {
  StyleSheet,
  View,
  LayoutChangeEvent,
  TouchableOpacity
} from 'react-native';
import { PanGestureHandler } from 'react-native-gesture-handler';
import Animated, {
  useAnimatedGestureHandler,
  useAnimatedStyle,
  useSharedValue,
  withSpring,
  runOnJS,
  withTiming
} from 'react-native-reanimated';
import { Move, Trash2, Star, StarOff } from 'lucide-react-native';
import Colors from '@/constants/Colors';
import { Widget } from '@/types/widget';

interface DraggableWidgetWrapperProps {
  widget: Widget;
  index: number;
  children: React.ReactNode;
  onDragStart: (widgetId: string, index: number) => void;
  onDragEnd: () => void;
  onDrag: (y: number) => void;
  onRemove: (widgetId: string) => void;
  onMoveUp: (index: number) => void;
  onMoveDown: (index: number) => void;
  onSetFeatured: (widgetId: string) => void;
  onSelectChannel?: (widget: Widget) => void;
  getChannelColor?: (channel: string) => string;
  registerPosition: (id: string, y: number, height: number) => void;
  isDragging: boolean;
  isFirst: boolean;
  isLast: boolean;
}

export default function DraggableWidgetWrapper({
  widget,
  index,
  children,
  onDragStart,
  onDragEnd,
  onDrag,
  onRemove,
  onMoveUp,
  onMoveDown,
  onSetFeatured,
  onSelectChannel,
  getChannelColor = () => '#888',
  registerPosition,
  isDragging,
  isFirst,
  isLast
}: DraggableWidgetWrapperProps) {
  // Animation values
  const translateY = useSharedValue(0);
  const opacity = useSharedValue(1);
  const scale = useSharedValue(1);

  // Refs for measurements
  const positionY = useRef<number>(0);
  const height = useRef<number>(0);

  // Register position on mount and layout changes
  const onLayout = (event: LayoutChangeEvent) => {
    const { y, height: layoutHeight } = event.nativeEvent.layout;
    positionY.current = y;
    height.current = layoutHeight;
    registerPosition(widget.id, y, layoutHeight);
  };

  // Gesture handler for dragging
  const gestureHandler = useAnimatedGestureHandler({
    onStart: (_, ctx: any) => {
      ctx.startY = translateY.value;
      runOnJS(onDragStart)(widget.id, index);
      opacity.value = withTiming(0.8, { duration: 100 });
      scale.value = withTiming(1.05, { duration: 100 });
    },
    onActive: (event, ctx) => {
      translateY.value = ctx.startY + event.translationY;
      // Calculate the current position of the widget
      const currentPosition = positionY.current + event.translationY;
      runOnJS(onDrag)(currentPosition);
    },
    onEnd: () => {
      translateY.value = withSpring(0, { damping: 20 });
      opacity.value = withTiming(1, { duration: 100 });
      scale.value = withTiming(1, { duration: 100 });
      runOnJS(onDragEnd)();
    },
  });

  // Animated styles
  const animatedStyle = useAnimatedStyle(() => {
    return {
      transform: [
        { translateY: translateY.value },
        { scale: scale.value }
      ],
      opacity: opacity.value,
      zIndex: isDragging ? 100 : 1,
    };
  });

  return (
    <Animated.View
      style={[styles.container, animatedStyle, isDragging && styles.dragging]}
      onLayout={onLayout}
    >
      <View style={styles.widgetControls}>
        <PanGestureHandler onGestureEvent={gestureHandler}>
          <Animated.View style={styles.dragHandle}>
            <Move size={20} color={Colors.text.secondary} />
          </Animated.View>
        </PanGestureHandler>

        <View style={styles.controlButtons}>
          <TouchableOpacity
            style={[styles.controlButton, isFirst && styles.disabledButton]}
            onPress={() => !isFirst && onMoveUp(index)}
            disabled={isFirst}
          >
            <Move
              size={20}
              color={isFirst ? Colors.text.disabled : Colors.text.secondary}
            />
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.controlButton, isLast && styles.disabledButton]}
            onPress={() => !isLast && onMoveDown(index)}
            disabled={isLast}
          >
            <Move
              size={20}
              color={isLast ? Colors.text.disabled : Colors.text.secondary}
              style={{ transform: [{ rotate: '180deg' }] }}
            />
          </TouchableOpacity>

          {onSelectChannel && (
            <TouchableOpacity
              style={[styles.controlButton, { borderColor: getChannelColor(widget.channel || 'neutral') }]}
              onPress={() => onSelectChannel(widget)}
            >
              <View
                style={[styles.channelIndicator, { backgroundColor: getChannelColor(widget.channel || 'neutral') }]}
              />
            </TouchableOpacity>
          )}

          <TouchableOpacity
            style={styles.controlButton}
            onPress={() => onSetFeatured(widget.id)}
          >
            {widget.isFeatured ? (
              <Star size={20} color={Colors.primary} fill={Colors.primary} />
            ) : (
              <StarOff size={20} color={Colors.text.secondary} />
            )}
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.controlButton}
            onPress={() => onRemove(widget.id)}
          >
            <Trash2 size={20} color={Colors.text.secondary} />
          </TouchableOpacity>
        </View>
      </View>

      <View style={styles.widgetContent}>
        {children}
      </View>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginBottom: 8,
  },
  dragging: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.3,
    shadowRadius: 10,
    elevation: 10,
  },
  widgetControls: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderWidth: 1,
    borderColor: Colors.background.light,
    borderRadius: 8,
    backgroundColor: 'transparent',
  },
  dragHandle: {
    padding: 8,
    borderRadius: 4,
    backgroundColor: 'rgba(0, 0, 0, 0.2)',
  },
  controlButtons: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  controlButton: {
    padding: 8,
    marginLeft: 4,
    borderWidth: 2,
    borderColor: 'transparent',
  },
  channelIndicator: {
    width: 16,
    height: 16,
    borderRadius: 8,
  },
  disabledButton: {
    opacity: 0.5,
  },
  widgetContent: {
    borderBottomLeftRadius: 8,
    borderBottomRightRadius: 8,
    overflow: 'hidden',
  },
});
