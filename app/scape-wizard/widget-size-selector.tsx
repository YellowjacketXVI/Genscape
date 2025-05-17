import { useState } from 'react';
import { StyleSheet, Text, View, TouchableOpacity, ScrollView, useWindowDimensions } from 'react-native';
import AppContainer from '@/components/layout/AppContainer';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { ArrowLeft, Check } from 'lucide-react-native';
import Colors from '@/constants/Colors';

type WidgetSize = {
  id: string;
  name: string;
  width: number;
  height: number;
  description: string;
};

export default function WidgetSizeSelector() {
  const router = useRouter();
  const params = useLocalSearchParams();
  const widgetType = params.type as string;
  const widgetTitle = params.title as string;

  const [selectedSize, setSelectedSize] = useState<string>('medium');

  // Check if we're on mobile or desktop
  const { width } = useWindowDimensions();
  const isDesktop = width > 768;

  const sizes: WidgetSize[] = [
    {
      id: 'small',
      name: 'Small',
      width: 1,
      height: 3,
      description: isDesktop ? '1×3 ratio (1116.03×372px on desktop)' : '1×3 ratio (361×120.33px on mobile)',
    },
    {
      id: 'medium',
      name: 'Medium',
      width: 2,
      height: 3,
      description: isDesktop ? '2×3 ratio (2232.06×744px on desktop)' : '2×3 ratio (361×240.66px on mobile)',
    },
    {
      id: 'large',
      name: 'Large',
      width: 3,
      height: 3,
      description: isDesktop ? '3×3 ratio (3348.09×1116px on desktop)' : '3×3 ratio (361×361px on mobile)',
    },
  ];

  const addWidget = () => {
    // Get the selected size
    const size = sizes.find(s => s.id === selectedSize);

    // Create a new widget with the selected size and type
    const newWidget = {
      type: widgetType,
      title: widgetTitle,
      size: {
        width: size?.width || 2,
        height: size?.height || 3,
      },
      position: 999, // Will be positioned at the end
      channel: 'neutral',
    };

    // Navigate back to the scape wizard step3 with the new widget data
    router.push({
      pathname: '/scape-wizard/step3',
      params: { newWidget: encodeURIComponent(JSON.stringify(newWidget)) }
    });
  };

  return (
    <AppContainer>
      <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity style={styles.backButton} onPress={() => router.back()}>
          <ArrowLeft size={24} color={Colors.text.primary} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Select Widget Size</Text>
        <View style={{ width: 40 }} />
      </View>

      <ScrollView style={styles.content} contentContainerStyle={styles.contentContainer}>
        <Text style={styles.widgetTypeTitle}>{widgetTitle}</Text>
        <Text style={styles.description}>
          Choose the size for your widget. Different sizes allow for different layouts and content display options.
        </Text>

        <View style={styles.sizesContainer}>
          {sizes.map(size => (
            <TouchableOpacity
              key={size.id}
              style={[
                styles.sizeOption,
                selectedSize === size.id && styles.selectedSize,
              ]}
              onPress={() => setSelectedSize(size.id)}
            >
              <View style={styles.sizePreview}>
                <View
                  style={[
                    styles.sizeBox,
                    {
                      width: `${(size.width / 3) * 100}%`,
                      height: size.width === 1 ? 40 : // 1:3 ratio
                               size.width === 2 ? 80 : // 2:3 ratio
                               120, // 3:3 ratio (square)
                    }
                  ]}
                />
              </View>
              <View style={styles.sizeInfo}>
                <Text style={styles.sizeName}>{size.name}</Text>
                <Text style={styles.sizeDescription}>{size.description}</Text>
              </View>
              {selectedSize === size.id && (
                <View style={styles.checkIcon}>
                  <Check size={20} color="#FFF" />
                </View>
              )}
            </TouchableOpacity>
          ))}
        </View>

        <TouchableOpacity style={styles.addButton} onPress={addWidget}>
          <Text style={styles.addButtonText}>Add Widget</Text>
        </TouchableOpacity>
      </ScrollView>
    </View>
    </AppContainer>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background.dark,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingTop: 60,
    paddingBottom: 16,
    backgroundColor: Colors.background.dark,
    borderBottomWidth: 1,
    borderBottomColor: Colors.background.medium,
  },
  headerTitle: {
    fontFamily: 'Inter-Bold',
    fontSize: 20,
    color: Colors.text.primary,
  },
  backButton: {
    padding: 8,
  },
  content: {
    flex: 1,
    padding: 16,
  },
  contentContainer: {
    paddingBottom: 32,
  },
  widgetTypeTitle: {
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
  sizesContainer: {
    marginBottom: 32,
  },
  sizeOption: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.background.medium,
    borderRadius: 8,
    padding: 16,
    marginBottom: 16,
    borderWidth: 2,
    borderColor: 'transparent',
  },
  selectedSize: {
    borderColor: Colors.primary,
    backgroundColor: Colors.background.light,
  },
  sizePreview: {
    width: 100,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 16,
  },
  sizeBox: {
    backgroundColor: Colors.primary,
    borderRadius: 4,
  },
  sizeInfo: {
    flex: 1,
  },
  sizeName: {
    fontFamily: 'Inter-Bold',
    fontSize: 18,
    color: Colors.text.primary,
    marginBottom: 4,
  },
  sizeDescription: {
    fontFamily: 'Inter-Regular',
    fontSize: 14,
    color: Colors.text.muted,
  },
  checkIcon: {
    backgroundColor: Colors.primary,
    width: 24,
    height: 24,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },
  addButton: {
    backgroundColor: Colors.primary,
    borderRadius: 8,
    paddingVertical: 16,
    alignItems: 'center',
    justifyContent: 'center',
  },
  addButtonText: {
    fontFamily: 'Inter-Bold',
    fontSize: 16,
    color: '#FFF',
  },
});
