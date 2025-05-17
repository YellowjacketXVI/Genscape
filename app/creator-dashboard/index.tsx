import { StyleSheet, Text, View, ScrollView, TouchableOpacity } from 'react-native';
import { 
  CalendarDays, 
  TrendingUp, 
  DollarSign, 
  Users, 
  BarChart, 
  PieChart,
  Download
} from 'lucide-react-native';
import Colors from '@/constants/Colors';

// Mock data for demonstration
const ANALYTICS_DATA = {
  totalViews: 24587,
  viewsThisWeek: 2345,
  viewsChange: '+12%',
  followers: 862,
  followersChange: '+5%',
  earnings: 412.75,
  earningsChange: '+22%',
  topScape: 'Digital Dreams',
  topScapeViews: 4250,
};

export default function CreatorDashboardScreen() {
  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.contentContainer}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Creator Dashboard</Text>
        <TouchableOpacity style={styles.reportButton}>
          <Download size={18} color={Colors.text.primary} />
          <Text style={styles.reportButtonText}>Report</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.dateSelector}>
        <CalendarDays size={18} color={Colors.text.secondary} />
        <Text style={styles.dateText}>Last 30 days</Text>
      </View>

      <View style={styles.statsGrid}>
        <StatCard 
          title="Total Views" 
          value={ANALYTICS_DATA.totalViews.toLocaleString()} 
          change={ANALYTICS_DATA.viewsChange}
          icon={<TrendingUp size={20} color={Colors.primary} />}
        />
        <StatCard 
          title="Followers" 
          value={ANALYTICS_DATA.followers.toLocaleString()} 
          change={ANALYTICS_DATA.followersChange}
          icon={<Users size={20} color={Colors.primary} />}
        />
        <StatCard 
          title="Earnings" 
          value={`$${ANALYTICS_DATA.earnings.toFixed(2)}`} 
          change={ANALYTICS_DATA.earningsChange}
          icon={<DollarSign size={20} color={Colors.primary} />}
        />
      </View>

      <View style={styles.section}>
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>Content Performance</Text>
          <TouchableOpacity>
            <Text style={styles.seeAllLink}>See All</Text>
          </TouchableOpacity>
        </View>
        
        <View style={styles.chartCard}>
          <View style={styles.chartCardHeader}>
            <Text style={styles.chartCardTitle}>Views by Scape</Text>
            <BarChart size={18} color={Colors.text.secondary} />
          </View>
          <View style={styles.chartPlaceholder}>
            <Text style={styles.chartPlaceholderText}>Chart Visualization</Text>
          </View>
          <View style={styles.chartLegend}>
            <View style={styles.legendItem}>
              <View style={[styles.legendColor, { backgroundColor: Colors.primary }]} />
              <Text style={styles.legendText}>Digital Dreams</Text>
            </View>
            <View style={styles.legendItem}>
              <View style={[styles.legendColor, { backgroundColor: '#4285F4' }]} />
              <Text style={styles.legendText}>Neon City</Text>
            </View>
            <View style={styles.legendItem}>
              <View style={[styles.legendColor, { backgroundColor: '#34A853' }]} />
              <Text style={styles.legendText}>Ambient Soundscapes</Text>
            </View>
          </View>
        </View>
      </View>

      <View style={styles.section}>
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>Audience Insights</Text>
          <TouchableOpacity>
            <Text style={styles.seeAllLink}>Details</Text>
          </TouchableOpacity>
        </View>
        
        <View style={styles.chartCard}>
          <View style={styles.chartCardHeader}>
            <Text style={styles.chartCardTitle}>Traffic Sources</Text>
            <PieChart size={18} color={Colors.text.secondary} />
          </View>
          <View style={styles.chartPlaceholder}>
            <Text style={styles.chartPlaceholderText}>Chart Visualization</Text>
          </View>
          <View style={styles.chartLegend}>
            <View style={styles.legendItem}>
              <View style={[styles.legendColor, { backgroundColor: Colors.primary }]} />
              <Text style={styles.legendText}>Search (42%)</Text>
            </View>
            <View style={styles.legendItem}>
              <View style={[styles.legendColor, { backgroundColor: '#4285F4' }]} />
              <Text style={styles.legendText}>Direct (28%)</Text>
            </View>
            <View style={styles.legendItem}>
              <View style={[styles.legendColor, { backgroundColor: '#34A853' }]} />
              <Text style={styles.legendText}>Referral (18%)</Text>
            </View>
            <View style={styles.legendItem}>
              <View style={[styles.legendColor, { backgroundColor: '#FBBC05' }]} />
              <Text style={styles.legendText}>Social (12%)</Text>
            </View>
          </View>
        </View>
      </View>

      <View style={styles.section}>
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>Top Performing Content</Text>
        </View>
        
        <View style={styles.topContentCard}>
          <View style={styles.topContentItem}>
            <Text style={styles.topContentRank}>1</Text>
            <View style={styles.topContentInfo}>
              <Text style={styles.topContentTitle}>{ANALYTICS_DATA.topScape}</Text>
              <Text style={styles.topContentStats}>
                {ANALYTICS_DATA.topScapeViews.toLocaleString()} views • 128 shares
              </Text>
            </View>
          </View>
          <View style={styles.topContentItem}>
            <Text style={styles.topContentRank}>2</Text>
            <View style={styles.topContentInfo}>
              <Text style={styles.topContentTitle}>Neon City</Text>
              <Text style={styles.topContentStats}>
                3,150 views • 92 shares
              </Text>
            </View>
          </View>
          <View style={styles.topContentItem}>
            <Text style={styles.topContentRank}>3</Text>
            <View style={styles.topContentInfo}>
              <Text style={styles.topContentTitle}>Ambient Soundscapes</Text>
              <Text style={styles.topContentStats}>
                1,875 views • 64 shares
              </Text>
            </View>
          </View>
        </View>
      </View>
    </ScrollView>
  );
}

function StatCard({ title, value, change, icon }: { title: string, value: string, change: string, icon: React.ReactNode }) {
  const isPositive = change.includes('+');
  
  return (
    <View style={styles.statCard}>
      <View style={styles.statCardIcon}>
        {icon}
      </View>
      <Text style={styles.statTitle}>{title}</Text>
      <Text style={styles.statValue}>{value}</Text>
      <Text style={[
        styles.statChange, 
        isPositive ? styles.positiveChange : styles.negativeChange
      ]}>
        {change}
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background.dark,
  },
  contentContainer: {
    paddingBottom: 80, // Account for tab bar
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingTop: 60,
    paddingBottom: 16,
  },
  headerTitle: {
    fontFamily: 'Inter-Bold',
    fontSize: 24,
    color: Colors.text.primary,
  },
  reportButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.background.medium,
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 8,
  },
  reportButtonText: {
    fontFamily: 'Inter-Regular',
    fontSize: 14,
    color: Colors.text.primary,
    marginLeft: 4,
  },
  dateSelector: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.background.medium,
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 8,
    alignSelf: 'flex-start',
    marginLeft: 16,
    marginBottom: 16,
  },
  dateText: {
    fontFamily: 'Inter-Medium',
    fontSize: 14,
    color: Colors.text.secondary,
    marginLeft: 8,
  },
  statsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    paddingHorizontal: 12,
    marginBottom: 24,
  },
  statCard: {
    backgroundColor: Colors.background.medium,
    borderRadius: 12,
    padding: 16,
    marginHorizontal: 4,
    marginBottom: 8,
    width: '31%',
    alignItems: 'center',
  },
  statCardIcon: {
    backgroundColor: 'rgba(241, 90, 41, 0.1)',
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 12,
  },
  statTitle: {
    fontFamily: 'Inter-Regular',
    fontSize: 12,
    color: Colors.text.secondary,
    marginBottom: 4,
    textAlign: 'center',
  },
  statValue: {
    fontFamily: 'Inter-Bold',
    fontSize: 18,
    color: Colors.text.primary,
    marginBottom: 4,
    textAlign: 'center',
  },
  statChange: {
    fontFamily: 'Inter-Medium',
    fontSize: 12,
  },
  positiveChange: {
    color: '#34A853',
  },
  negativeChange: {
    color: '#EA4335',
  },
  section: {
    marginBottom: 24,
    paddingHorizontal: 16,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  sectionTitle: {
    fontFamily: 'Inter-Bold',
    fontSize: 18,
    color: Colors.text.primary,
  },
  seeAllLink: {
    fontFamily: 'Inter-Medium',
    fontSize: 14,
    color: Colors.primary,
  },
  chartCard: {
    backgroundColor: Colors.background.medium,
    borderRadius: 12,
    padding: 16,
  },
  chartCardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  chartCardTitle: {
    fontFamily: 'Inter-Medium',
    fontSize: 16,
    color: Colors.text.primary,
  },
  chartPlaceholder: {
    height: 180,
    backgroundColor: Colors.background.light,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 16,
  },
  chartPlaceholderText: {
    fontFamily: 'Inter-Medium',
    fontSize: 14,
    color: Colors.text.muted,
  },
  chartLegend: {
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  legendItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginRight: 16,
    marginBottom: 8,
    width: '45%',
  },
  legendColor: {
    width: 12,
    height: 12,
    borderRadius: 6,
    marginRight: 8,
  },
  legendText: {
    fontFamily: 'Inter-Regular',
    fontSize: 12,
    color: Colors.text.secondary,
  },
  topContentCard: {
    backgroundColor: Colors.background.medium,
    borderRadius: 12,
    padding: 16,
  },
  topContentItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: Colors.background.light,
  },
  topContentRank: {
    fontFamily: 'Inter-Bold',
    fontSize: 18,
    color: Colors.primary,
    width: 30,
  },
  topContentInfo: {
    flex: 1,
  },
  topContentTitle: {
    fontFamily: 'Inter-Medium',
    fontSize: 16,
    color: Colors.text.primary,
    marginBottom: 4,
  },
  topContentStats: {
    fontFamily: 'Inter-Regular',
    fontSize: 12,
    color: Colors.text.muted,
  },
});