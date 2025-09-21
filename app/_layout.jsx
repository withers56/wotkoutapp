import { useFonts } from 'expo-font';
import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import 'react-native-reanimated';
import { ThemeProvider } from "../context/ThemeContext";
import dbInit, { DEFAULT_EXERCISES } from '../db/dbstatments';

import { useColorScheme } from '@/hooks/useColorScheme';
// import { SQLiteProvider } from 'expo-sqlite';
import * as SQLite from 'expo-sqlite';
import { SafeAreaProvider } from 'react-native-safe-area-context';

export const dbName = 'estnewv11.db';

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

    db.execAsync(`
        
        PRAGMA foreign_keys = ON;
      `)
    

      db.withTransactionAsync(async () => {
        try {

          

          await db.execAsync(dbInit())


          const exerciseCheck = await db.getAllAsync('SELECT COUNT(1) AS rowCount FROM exercises');

    if(exerciseCheck[0].rowCount < 1) {
      console.log('insert default exercises');
      // await db.execAsync(exercisesInitInsert());
      DEFAULT_EXERCISES.forEach(item => {
        db.runAsync(
          'INSERT INTO exercises (id, name) VALUES (?,?)',
          [item.id, item.name]
        );

          // console.log(item.name);
      });    
    } 
          
        } catch (e) {
          console.error(e);
        }
      })
      
  }

  return (
   <GestureHandlerRootView style={{flex: 1}}>
      <ThemeProvider>
        <SafeAreaProvider>
          <SQLite.SQLiteProvider databaseName={dbName} onInit={createDbIfNeeded}>
            <Stack>
              <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
              <Stack.Screen name="+not-found" />
            </Stack>
          </SQLite.SQLiteProvider>
          <StatusBar style="auto" />
        </SafeAreaProvider>    
      </ThemeProvider>
    </GestureHandlerRootView>
  );
}
