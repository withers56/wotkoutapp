import { useFonts } from 'expo-font';
import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import 'react-native-reanimated';
import { ThemeProvider } from "../context/ThemeContext";
import dbInit from '../db/dbstatments';

import { useColorScheme } from '@/hooks/useColorScheme';
import { SQLiteProvider } from 'expo-sqlite';
import { SafeAreaProvider } from 'react-native-safe-area-context';

export default function RootLayout() {
  const colorScheme = useColorScheme();
  const [loaded] = useFonts({
    SpaceMono: require('../assets/fonts/SpaceMono-Regular.ttf'),
  });

  if (!loaded) {
    // Async font loading only occurs in development.
    return null;
  }

  const createDbIfNeeded = async (db) => {
    console.log('creating database if working');
    
    await db.execAsync(dbInit())
  }

  return (
   
      <ThemeProvider>
        <SafeAreaProvider>
          <SQLiteProvider databaseName="testnew.db" onInit={createDbIfNeeded}>
            <Stack>
              <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
              <Stack.Screen name="+not-found" />
            </Stack>
          </SQLiteProvider>
          <StatusBar style="auto" />
        </SafeAreaProvider>    
      </ThemeProvider>
  );
}
