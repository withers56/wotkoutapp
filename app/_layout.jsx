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
    
    await db.execAsync(dbInit()) // creates tables if not existing

    //check to see if exercises is empty

    const exerciseCheck = await db.getAllAsync('SELECT COUNT(1) AS rowCount FROM exercises');

    if(exerciseCheck[0].rowCount < 1) {
      console.log('insert default exercises');
      
    } 

    // await db.runAsync('INSERT INTO exercises (name) VALUES (?)', 'test exer');


    console.log(exerciseCheck[0].rowCount);
    
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
