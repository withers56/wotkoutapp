import { useFonts } from 'expo-font';
import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import 'react-native-reanimated';
import { ThemeProvider } from "../context/ThemeContext";
import dbInit, { DEFAULT_EXERCISES, DEFAULT_FOODS } from '../db/dbstatments';

import { useColorScheme } from '@/hooks/useColorScheme';
// import { SQLiteProvider } from 'expo-sqlite';
import * as SQLite from 'expo-sqlite';
import { SafeAreaProvider } from 'react-native-safe-area-context';

export const dbName = 'estnewv13.db';

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
          const foodCheck = await db.getAllAsync('SELECT COUNT(1) AS rowCount FROM foods')

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

    if(foodCheck[0].rowCount < 1) {
      console.log('insert default foods');
      
      DEFAULT_FOODS.forEach(item => {
        db.runAsync(
          'INSERT INTO foods (name, id, calories_per_serving, serving_size, num_servings, protein_per_serving, carbs_per_serving, fat_per_serving) VALUES (?,?,?,?,?,?,?,?)',
          [item.name, item.id, item.calories_per_serving, item.serving_size, item.num_servings, item.protein_per_serving, item.carbs_per_serving, item.fat_per_serving]
        )
      })
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
