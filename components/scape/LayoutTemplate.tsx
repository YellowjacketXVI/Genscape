import { View, StyleSheet } from 'react-native';
import Colors from '@/constants/Colors';

type LayoutTemplateProps = {
  id: number;
  selected: boolean;
};

export default function LayoutTemplate({ id, selected }: LayoutTemplateProps) {
  // Different layout templates based on id
  const renderLayout = () => {
    switch (id) {
      case 1: // Grid Layout
        return (
          <View style={styles.layoutContent}>
            <View style={styles.gridLayout}>
              <View style={styles.gridItem} />
              <View style={styles.gridItem} />
              <View style={styles.gridItem} />
              <View style={styles.gridItem} />
            </View>
          </View>
        );
      case 2: // Single Column
        return (
          <View style={styles.layoutContent}>
            <View style={styles.columnLayout}>
              <View style={styles.columnItem} />
              <View style={styles.columnItem} />
              <View style={styles.columnItem} />
            </View>
          </View>
        );
      case 3: // Gallery Focus
        return (
          <View style={styles.layoutContent}>
            <View style={styles.galleryLayout}>
              <View style={styles.galleryHeader} />
              <View style={styles.gallerySlider}>
                <View style={styles.galleryItem} />
                <View style={styles.galleryItem} />
                <View style={styles.galleryItem} />
              </View>
              <View style={styles.galleryFooter} />
            </View>
          </View>
        );
      case 4: // Shop Layout
        return (
          <View style={styles.layoutContent}>
            <View style={styles.shopLayout}>
              <View style={styles.shopHeader} />
              <View style={styles.shopGrid}>
                <View style={styles.shopItem} />
                <View style={styles.shopItem} />
                <View style={styles.shopItem} />
                <View style={styles.shopItem} />
              </View>
            </View>
          </View>
        );
      default:
        return (
          <View style={styles.layoutContent}>
            <View style={styles.defaultLayout} />
          </View>
        );
    }
  };

  return (
    <View style={[styles.container, selected && styles.selected]}>
      {renderLayout()}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    borderRadius: 8,
    overflow: 'hidden',
    borderWidth: 2,
    borderColor: 'transparent',
    backgroundColor: Colors.background.medium,
    height: 120,
  },
  selected: {
    borderColor: Colors.primary,
  },
  layoutContent: {
    flex: 1,
    padding: 8,
  },
  // Grid Layout
  gridLayout: {
    flex: 1,
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  gridItem: {
    width: '48%',
    height: '48%',
    backgroundColor: Colors.background.light,
    marginBottom: 4,
    borderRadius: 4,
  },
  // Column Layout
  columnLayout: {
    flex: 1,
    justifyContent: 'space-between',
  },
  columnItem: {
    height: '30%',
    backgroundColor: Colors.background.light,
    borderRadius: 4,
  },
  // Gallery Layout
  galleryLayout: {
    flex: 1,
    justifyContent: 'space-between',
  },
  galleryHeader: {
    height: '20%',
    backgroundColor: Colors.background.light,
    borderRadius: 4,
    marginBottom: 4,
  },
  gallerySlider: {
    height: '50%',
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 4,
  },
  galleryItem: {
    width: '32%',
    height: '100%',
    backgroundColor: Colors.background.light,
    borderRadius: 4,
  },
  galleryFooter: {
    height: '20%',
    backgroundColor: Colors.background.light,
    borderRadius: 4,
  },
  // Shop Layout
  shopLayout: {
    flex: 1,
  },
  shopHeader: {
    height: '20%',
    backgroundColor: Colors.background.light,
    borderRadius: 4,
    marginBottom: 6,
  },
  shopGrid: {
    flex: 1,
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  shopItem: {
    width: '48%',
    height: '48%',
    backgroundColor: Colors.background.light,
    marginBottom: 4,
    borderRadius: 4,
  },
  // Default Layout
  defaultLayout: {
    flex: 1,
    backgroundColor: Colors.background.light,
    borderRadius: 4,
  },
});