import React from 'react';
import {
  StyleSheet,
  View,
  TouchableOpacity,
  Text,
} from 'react-native';
import { ArrowUp, ArrowDown, GripVertical } from 'lucide-react-native';
import { useTheme } from '@/contexts/ThemeContext';
import { ScapeEditorWidget } from '@/types/scape-editor';
import WidgetCard from './WidgetCard';

interface ReorderableWidgetListProps {
  widgets: ScapeEditorWidget[];
  onReorder: (widgets: ScapeEditorWidget[]) => void;
  onUpdateWidget: (widget: ScapeEditorWidget) => void;
  onDeleteWidget: (widgetId: string) => void;
  onSetFeatureWidget: (widgetId: string) => void;
  featureWidgetId?: string;
}

interface WidgetItemProps {
  widget: ScapeEditorWidget;
  index: number;
  isFirst: boolean;
  isLast: boolean;
  isFeature: boolean;
  onUpdateWidget: (widget: ScapeEditorWidget) => void;
  onDeleteWidget: (widgetId: string) => void;
  onSetFeatureWidget: (widgetId: string) => void;
  onMoveUp: () => void;
  onMoveDown: () => void;
}

function WidgetItem({
  widget,
  index,
  isFirst,
  isLast,
  isFeature,
  onUpdateWidget,
  onDeleteWidget,
  onSetFeatureWidget,
  onMoveUp,
  onMoveDown,
}: WidgetItemProps) {
  const theme = useTheme();

  return (
    <View style={styles.widgetItem}>
      <View style={styles.widgetContent}>
        <WidgetCard
          widget={widget}
          isFeature={isFeature}
          onUpdate={onUpdateWidget}
          onDelete={() => onDeleteWidget(widget.id)}
          onSetFeature={() => onSetFeatureWidget(widget.id)}
        />
      </View>

      <View style={[styles.reorderControls, { backgroundColor: theme.colors.surface }]}>
        <View style={styles.dragHandle}>
          <GripVertical size={20} color={theme.colors.textSecondary} />
        </View>

        <View style={styles.moveButtons}>
          <TouchableOpacity
            style={[
              styles.moveButton,
              { backgroundColor: theme.colors.background },
              isFirst && styles.disabledButton
            ]}
            onPress={onMoveUp}
            disabled={isFirst}
          >
            <ArrowUp
              size={16}
              color={isFirst ? theme.colors.textMuted : theme.colors.textPrimary}
            />
          </TouchableOpacity>

          <TouchableOpacity
            style={[
              styles.moveButton,
              { backgroundColor: theme.colors.background },
              isLast && styles.disabledButton
            ]}
            onPress={onMoveDown}
            disabled={isLast}
          >
            <ArrowDown
              size={16}
              color={isLast ? theme.colors.textMuted : theme.colors.textPrimary}
            />
          </TouchableOpacity>
        </View>

        <Text style={[styles.positionText, { color: theme.colors.textSecondary }]}>
          {index + 1}
        </Text>
      </View>
    </View>
  );
}

export default function ReorderableWidgetList({
  widgets,
  onReorder,
  onUpdateWidget,
  onDeleteWidget,
  onSetFeatureWidget,
  featureWidgetId,
}: ReorderableWidgetListProps) {

  const moveWidget = (fromIndex: number, toIndex: number) => {
    if (fromIndex === toIndex) return;

    const newWidgets = [...widgets];
    const [movedWidget] = newWidgets.splice(fromIndex, 1);
    newWidgets.splice(toIndex, 0, movedWidget);

    // Update positions
    const updatedWidgets = newWidgets.map((widget, index) => ({
      ...widget,
      position: index,
    }));

    onReorder(updatedWidgets);
  };

  const handleMoveUp = (index: number) => {
    if (index > 0) {
      moveWidget(index, index - 1);
    }
  };

  const handleMoveDown = (index: number) => {
    if (index < widgets.length - 1) {
      moveWidget(index, index + 1);
    }
  };

  return (
    <View style={styles.container}>
      {widgets.map((widget, index) => (
        <WidgetItem
          key={widget.id}
          widget={widget}
          index={index}
          isFirst={index === 0}
          isLast={index === widgets.length - 1}
          isFeature={widget.id === featureWidgetId}
          onUpdateWidget={onUpdateWidget}
          onDeleteWidget={onDeleteWidget}
          onSetFeatureWidget={onSetFeatureWidget}
          onMoveUp={() => handleMoveUp(index)}
          onMoveDown={() => handleMoveDown(index)}
        />
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  widgetItem: {
    flexDirection: 'row',
    marginBottom: 16,
    alignItems: 'stretch',
  },
  widgetContent: {
    flex: 1,
  },
  reorderControls: {
    width: 60,
    marginLeft: 8,
    borderRadius: 8,
    paddingVertical: 8,
    paddingHorizontal: 4,
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  dragHandle: {
    padding: 4,
  },
  moveButtons: {
    flex: 1,
    justifyContent: 'center',
    gap: 8,
  },
  moveButton: {
    width: 32,
    height: 32,
    borderRadius: 16,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: 'transparent',
  },
  disabledButton: {
    opacity: 0.3,
  },
  positionText: {
    fontSize: 12,
    fontFamily: 'Inter-Medium',
    textAlign: 'center',
  },
});
