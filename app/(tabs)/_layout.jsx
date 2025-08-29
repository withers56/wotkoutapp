import { Tabs } from 'expo-router';
import { Appearance, Platform, StyleSheet } from 'react-native';

import { HapticTab } from '@/components/HapticTab';
import TabBarBackground from '@/components/ui/TabBarBackground';
import { Colors } from '@/constants/Colors';
import { ThemeProvider } from '@/context/ThemeContext';
import FontAwesome5 from '@expo/vector-icons/FontAwesome5';
import Ionicons from '@expo/vector-icons/Ionicons';
import MaterialCommunityIcons from '@expo/vector-icons/MaterialCommunityIcons';




export default function TabLayout() {
  const colorScheme = Appearance.getColorScheme();
  const theme = colorScheme === 'dark' ? Colors.dark : Colors.light;
  const styles = createStyles(theme, colorScheme);
  

  return (
    <ThemeProvider>
      <Tabs
        // initialRouteName='workout'
        screenOptions={{
          tabBarActiveTintColor: theme.tabIconSelected,
          headerShown: false,
          tabBarButton: HapticTab,
          tabBarBackground: TabBarBackground,
          tabBarStyle: Platform.select({
            ios: {
              // Use a transparent background on iOS to show the blur effect
              position: 'absolute',
            },
            default: {},
          }),
        }}>
        <Tabs.Screen
          name="weight"
          options={{
            title: 'Weight',
            tabBarIcon: ({ color }) => <FontAwesome5 name="weight" size={24} color={color} />,
          }}
        />
        <Tabs.Screen
          name="workout"
          options={{
            title: 'Workout',
            tabBarIcon: ({ color }) => <Ionicons name="barbell-outline" size={28} color={color} />,
          }}
        />
        <Tabs.Screen
          name="food"
          options={{
            title: 'Food',
            tabBarIcon: ({ color }) => <MaterialCommunityIcons name="food-apple" size={24} color={color} />,
          }}
        />
      </Tabs>
    </ThemeProvider>
  );
}

function createStyles(theme, colorScheme) {
    return StyleSheet.create({
        
    })
}
