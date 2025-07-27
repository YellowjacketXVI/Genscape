import { Tabs } from 'expo-router';
import { StyleSheet } from 'react-native';
import { Chrome as Home, LayoutGrid as Layout, FolderOpen } from 'lucide-react-native';
import { BlurView } from 'expo-blur';
import Colors from '@/constants/Colors';

export default function TabLayout() {
  const tabBarBackground = () => {
    return (
      <BlurView 
        intensity={80} 
        tint="dark"
        style={StyleSheet.absoluteFill} 
      />
    );
  };

  return (
    <Tabs
      screenOptions={{
        tabBarActiveTintColor: Colors.primary,
        tabBarInactiveTintColor: '#999',
        tabBarStyle: styles.tabBar,
        tabBarBackground: tabBarBackground,
        headerShown: false,
        tabBarLabelStyle: styles.tabBarLabel,
        tabBarIconStyle: styles.tabBarIcon,
      }}>
      <Tabs.Screen
        name="home/index"
        options={{
          title: 'Home',
          tabBarIcon: ({ color, size }) => <Home size={size} color={color} />,
        }}
      />
      <Tabs.Screen
        name="scape-manager/index"
        options={{
          title: 'Scapes',
          tabBarIcon: ({ color, size }) => <Layout size={size} color={color} />,
        }}
      />
      <Tabs.Screen
        name="content-manager/index"
        options={{
          title: 'Content',
          tabBarIcon: ({ color, size }) => <FolderOpen size={size} color={color} />,
        }}
      />
    </Tabs>
  );
}

const styles = StyleSheet.create({
  tabBar: {
    position: 'absolute',
    backgroundColor: 'transparent',
    borderTopWidth: 0,
    elevation: 0,
    height: 60,
  },
  tabBarLabel: {
    fontFamily: 'Inter-Regular',
    fontSize: 12,
  },
  tabBarIcon: {
    marginTop: 4,
  }
});