import React, { useState } from 'react';
import {
  StyleSheet,
  View,
  FlatList,
  RefreshControl,
  TextInput,
  TouchableOpacity,
  Text,
  useWindowDimensions,
  Platform,
  StatusBar
} from 'react-native';
import { Search, SlidersHorizontal, Bell } from 'lucide-react-native';
import Colors from '@/constants/Colors';
import ScapeCard from './ScapeCard';
import { useScape } from '@/context/ScapeContext';
import ThemedScrollView from '@/components/layout/ThemedScrollView';

export default function Feed() {
  const {
    feedScapes,
    feedLoading,
    feedTab,
    setFeedTab,
    refreshFeed
  } = useScape();

  const [searchQuery, setSearchQuery] = useState('');
  const [refreshing, setRefreshing] = useState(false);

  // Check if we're on desktop or mobile
  const { width } = useWindowDimensions();
  const isDesktop = width > 768;

  // Handle refresh
  const handleRefresh = async () => {
    setRefreshing(true);
    await refreshFeed();
    setRefreshing(false);
  };

  // Handle saving a scape
  const handleSaveScape = (scapeId: string) => {
    // Implementation would go here
  };

  // Handle liking a scape
  const handleLikeScape = (scapeId: string) => {
    // Implementation would go here
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Genscape</Text>
        <TouchableOpacity style={styles.iconButton}>
          <Bell size={isDesktop ? 22 : 20} color={Colors.text.primary} />
        </TouchableOpacity>
      </View>

      <View style={styles.searchContainer}>
        <View style={styles.searchInputContainer}>
          <Search size={isDesktop ? 18 : 16} color={Colors.text.muted} style={styles.searchIcon} />
          <TextInput
            style={styles.searchInput}
            placeholder="Search"
            placeholderTextColor={Colors.text.muted}
            value={searchQuery}
            onChangeText={setSearchQuery}
          />
        </View>
        <TouchableOpacity style={styles.filterButton}>
          <SlidersHorizontal size={isDesktop ? 20 : 18} color={Colors.text.primary} />
        </TouchableOpacity>
      </View>

      <View style={styles.tabsContainer}>
        <TouchableOpacity
          style={[styles.tab, feedTab === 'explore' && styles.activeTab]}
          onPress={() => setFeedTab('explore')}
        >
          <Text style={[styles.tabText, feedTab === 'explore' && styles.activeTabText]}>
            Explore
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.tab, feedTab === 'followed' && styles.activeTab]}
          onPress={() => setFeedTab('followed')}
        >
          <Text style={[styles.tabText, feedTab === 'followed' && styles.activeTabText]}>
            Followed
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.tab, feedTab === 'shop' && styles.activeTab]}
          onPress={() => setFeedTab('shop')}
        >
          <Text style={[styles.tabText, feedTab === 'shop' && styles.activeTabText]}>
            Shop
          </Text>
        </TouchableOpacity>
      </View>

      {Platform.OS === 'web' && isDesktop ? (
        <ThemedScrollView
          contentContainerStyle={styles.scrollViewContent}
          showsVerticalScrollIndicator={true}
          scrollIndicatorInsets={{ right: 1 }}
          style={styles.scrollView}
        >
          <View style={styles.feedGrid}>
            {feedScapes.map(scape => (
              <View key={scape.id} style={styles.gridItem}>
                <ScapeCard
                  scape={scape}
                  onSave={() => handleSaveScape(scape.id)}
                  onLike={() => handleLikeScape(scape.id)}
                  isDesktop={isDesktop}
                />
              </View>
            ))}
          </View>
        </ThemedScrollView>
      ) : (
        <FlatList
          data={feedScapes}
          keyExtractor={(item) => item.id}
          numColumns={isDesktop ? 2 : 1} // Two columns on desktop, one on mobile
          key={isDesktop ? 'desktop' : 'mobile'} // Force re-render when layout changes
          columnWrapperStyle={isDesktop ? styles.columnWrapper : undefined} // Only apply on desktop
          renderItem={({ item }) => (
            <ScapeCard
              scape={item}
              onSave={() => handleSaveScape(item.id)}
              onLike={() => handleLikeScape(item.id)}
              isDesktop={isDesktop}
            />
          )}
          contentContainerStyle={styles.feedContent}
          style={styles.flatList}
          showsVerticalScrollIndicator={true}
          scrollIndicatorInsets={{ right: 1 }}
          refreshControl={
            <RefreshControl
              refreshing={refreshing}
              onRefresh={handleRefresh}
              colors={[Colors.primary]}
              tintColor={Colors.primary}
            />
          }
        />
      )}
    </View>
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
    paddingHorizontal: Platform.OS === 'web' ? 12 : 6,
    paddingTop: Platform.OS === 'web' ? 12 : 8,
    paddingBottom: Platform.OS === 'web' ? 12 : 8,
    marginTop: Platform.OS === 'ios' ? StatusBar.currentHeight : 0,
  },
  headerTitle: {
    fontFamily: 'Inter-Bold',
    fontSize: 24,
    color: Colors.text.primary,
  },
  iconButton: {
    padding: 8,
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: Platform.OS === 'web' ? 12 : 6,
    marginBottom: 16,
  },
  searchInputContainer: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.background.medium,
    borderRadius: 8,
    paddingHorizontal: 12,
    height: 40,
  },
  searchIcon: {
    marginRight: 8,
  },
  searchInput: {
    flex: 1,
    fontFamily: 'Inter-Regular',
    fontSize: 16,
    color: Colors.text.primary,
    height: '100%',
  },
  filterButton: {
    marginLeft: 12,
    padding: 8,
  },
  tabsContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginBottom: 16,
  },
  tab: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    marginHorizontal: 4,
    borderRadius: 16,
  },
  activeTab: {
    backgroundColor: Colors.background.medium,
  },
  tabText: {
    fontFamily: 'Inter-Medium',
    fontSize: 14,
    color: Colors.text.secondary,
  },
  activeTabText: {
    color: Colors.text.primary,
  },
  scrollView: {
    paddingHorizontal: Platform.OS === 'web' ? 12 : 6,
  },
  flatList: {
    paddingHorizontal: Platform.OS === 'web' ? 12 : 6,
  },
  scrollViewContent: {
    paddingBottom: 24,
  },
  feedGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  gridItem: {
    width: 'calc(50% - 12px)', // Half width minus half of the gap (24px)
    marginBottom: 24,
  },
  columnWrapper: {
    justifyContent: 'space-between',
    paddingHorizontal: Platform.OS === 'web' ? 12 : 6,
  },
  feedContent: {
    paddingBottom: 24,
  },
});
