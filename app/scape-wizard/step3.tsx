import { useState } from 'react';
import { StyleSheet, Text, View, TouchableOpacity, ScrollView } from 'react-native';
import { useRouter } from 'expo-router';
import { PlusCircle, ChevronRight, Move, Image as ImageIcon, Music2, ShoppingBag, MessageSquare, Text as TextIcon } from 'lucide-react-native';
import Colors from '@/constants/Colors';
import WidgetPreview from '@/components/scape/WidgetPreview';
import { Widget } from '@/types/scape';

export default function ConfigureWidgetsStep() {
  const router = useRouter();
  const [widgets, setWidgets] = useState<Widget[]>([
    { id: '1', type: 'media', title: 'Featured Image', size: 'large' },
    { id: '2', type: 'text', title: 'Description', size: 'medium' },
  ]);
  const [showWidgetPanel, setShowWidgetPanel] = useState(false);

  const addWidget = (type: string) => {
    const newWidget: Widget = {
      id: Date.now().toString(),
      type,
      title: `New ${type.charAt(0).toUpperCase() + type.slice(1)} Widget`,
      size: 'medium',
    };
    setWidgets([...widgets, newWidget]);
    setShowWidgetPanel(false);
  };

  const toggleWidgetPanel = () => {
    setShowWidgetPanel(!showWidgetPanel);
  };

  const goToNextStep = () => {
    router.push('/scape-wizard/step4');
  };

  return (
    <View style={styles.container}>
      <ScrollView style={styles.content}>
        <Text style={styles.title}>Configure Your Widgets</Text>
        <Text style={styles.description}>
          Add, arrange, and customize widgets for your Scape.
          Tap and hold to reorder widgets.
        </Text>

        <View style={styles.widgetsContainer}>
          {widgets.map((widget) => (
            <WidgetPreview key={widget.id} widget={widget} />
          ))}
        </View>

        <TouchableOpacity style={styles.addWidgetButton} onPress={toggleWidgetPanel}>
          <PlusCircle size={24} color={Colors.primary} />
          <Text style={styles.addWidgetText}>Add Widget</Text>
        </TouchableOpacity>

        {showWidgetPanel && (
          <View style={styles.widgetPanel}>
            <Text style={styles.widgetPanelTitle}>Choose Widget Type</Text>
            
            <View style={styles.widgetTypeGrid}>
              <WidgetTypeButton 
                icon={<ImageIcon size={24} color="#FFF" />} 
                label="Media" 
                onPress={() => addWidget('media')} 
              />
              <WidgetTypeButton 
                icon={<Music2 size={24} color="#FFF" />} 
                label="Audio" 
                onPress={() => addWidget('audio')} 
              />
              <WidgetTypeButton 
                icon={<ShoppingBag size={24} color="#FFF" />} 
                label="Shop" 
                onPress={() => addWidget('shop')} 
              />
              <WidgetTypeButton 
                icon={<TextIcon size={24} color="#FFF" />} 
                label="Text" 
                onPress={() => addWidget('text')} 
              />
              <WidgetTypeButton 
                icon={<ImageIcon size={24} color="#FFF" />} 
                label="Gallery" 
                onPress={() => addWidget('gallery')} 
              />
              <WidgetTypeButton 
                icon={<MessageSquare size={24} color="#FFF" />} 
                label="Chat" 
                onPress={() => addWidget('chat')} 
              />
            </View>
          </View>
        )}

        <View style={styles.helpSection}>
          <Text style={styles.helpTitle}>Widget Tips</Text>
          <View style={styles.helpItem}>
            <Move size={20} color={Colors.text.secondary} />
            <Text style={styles.helpText}>Tap & hold to reorder widgets</Text>
          </View>
          <View style={styles.helpItem}>
            <PlusCircle size={20} color={Colors.text.secondary} />
            <Text style={styles.helpText}>Add more widgets with the + button</Text>
          </View>
          <View style={styles.helpItem}>
            <ChevronRight size={20} color={Colors.text.secondary} />
            <Text style={styles.helpText}>Tap on any widget to edit its content</Text>
          </View>
        </View>
      </ScrollView>

      <View style={styles.footer}>
        <TouchableOpacity style={styles.nextButton} onPress={goToNextStep}>
          <Text style={styles.nextButtonText}>Next: Publish Options</Text>
          <ChevronRight size={20} color="#FFF" />
        </TouchableOpacity>
      </View>
    </View>
  );
}

function WidgetTypeButton({ icon, label, onPress }: { icon: React.ReactNode, label: string, onPress: () => void }) {
  return (
    <TouchableOpacity style={styles.widgetTypeButton} onPress={onPress}>
      <View style={styles.widgetTypeIcon}>
        {icon}
      </View>
      <Text style={styles.widgetTypeLabel}>{label}</Text>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background.dark,
  },
  content: {
    flex: 1,
    padding: 16,
  },
  title: {
    fontFamily: 'Inter-Bold',
    fontSize: 24,
    color: Colors.text.primary,
    marginBottom: 8,
  },
  description: {
    fontFamily: 'Inter-Regular',
    fontSize: 16,
    color: Colors.text.secondary,
    marginBottom: 24,
    lineHeight: 24,
  },
  widgetsContainer: {
    backgroundColor: Colors.background.medium,
    borderRadius: 8,
    padding: 16,
    marginBottom: 16,
    minHeight: 200,
  },
  addWidgetButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'transparent',
    borderWidth: 2,
    borderColor: Colors.primary,
    borderStyle: 'dashed',
    borderRadius: 8,
    paddingVertical: 16,
    marginBottom: 24,
  },
  addWidgetText: {
    fontFamily: 'Inter-Medium',
    fontSize: 16,
    color: Colors.primary,
    marginLeft: 8,
  },
  widgetPanel: {
    backgroundColor: Colors.background.medium,
    borderRadius: 8,
    padding: 16,
    marginBottom: 24,
  },
  widgetPanelTitle: {
    fontFamily: 'Inter-Bold',
    fontSize: 18,
    color: Colors.text.primary,
    marginBottom: 16,
  },
  widgetTypeGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginHorizontal: -8,
  },
  widgetTypeButton: {
    width: '33.33%',
    padding: 8,
  },
  widgetTypeIcon: {
    backgroundColor: Colors.background.light,
    height: 70,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 8,
  },
  widgetTypeLabel: {
    fontFamily: 'Inter-Regular',
    fontSize: 14,
    color: Colors.text.secondary,
    textAlign: 'center',
  },
  helpSection: {
    backgroundColor: Colors.background.medium,
    borderRadius: 8,
    padding: 16,
    marginBottom: 24,
  },
  helpTitle: {
    fontFamily: 'Inter-Bold',
    fontSize: 18,
    color: Colors.text.primary,
    marginBottom: 12,
  },
  helpItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  helpText: {
    fontFamily: 'Inter-Regular',
    fontSize: 14,
    color: Colors.text.secondary,
    marginLeft: 12,
  },
  footer: {
    backgroundColor: Colors.background.dark,
    paddingHorizontal: 16,
    paddingVertical: 16,
    borderTopWidth: 1,
    borderTopColor: Colors.background.light,
  },
  nextButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: Colors.primary,
    paddingVertical: 16,
    paddingHorizontal: 24,
    borderRadius: 8,
  },
  nextButtonText: {
    fontFamily: 'Inter-Bold',
    fontSize: 16,
    color: '#FFF',
    marginRight: 8,
  },
});