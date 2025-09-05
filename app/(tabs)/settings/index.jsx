import { ThemeContext } from "@/context/ThemeContext";
import { useSQLiteContext } from 'expo-sqlite';
import { React, useContext } from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from "react-native-safe-area-context";

import * as FileSystem from 'expo-file-system';
import * as Sharing from 'expo-sharing';




export default function TabTwoScreen() {
  const {colorScheme, setColorScheme, theme} = useContext(ThemeContext)
  const styles = createStyles(theme, colorScheme)

  const db = useSQLiteContext();

  const handleImport = async () => {
    console.log('clicked import');
    
  }

  const formatDataIntoCSV = (data) => {
        if (!data || data.length === 0) {
            console.log('No data to export.');
            return;
        }

        // 2. Format Data as CSV String
        const headers = Object.keys(data[0]).join(',');
        const csvRows = data.map(row => Object.values(row).map(value => {
        // Basic CSV escaping for values containing commas or double quotes
        if (typeof value === 'string' && (value.includes(',') || value.includes('"'))) {
            return `"${value.replace(/"/g, '""')}"`;
        }
        return value;
        }).join(','));

        const csvContent = [headers, ...csvRows].join('\n');

        return csvContent;
  }

  const handleExport = async (table) => {
    console.log('clicked export');

    try {
        const result = await db.getAllAsync(`SELECT * FROM ${table}`);
        const data = result; 
        
        console.log(data);

        const csvContent = formatDataIntoCSV(data)

        console.log(csvContent);

        // 3. Write to File System
        const fileUri = FileSystem.cacheDirectory + `${table}_history.csv`;
        await FileSystem.writeAsStringAsync(fileUri, csvContent);
            
        // 4. Share or Save the File
        if (await Sharing.isAvailableAsync()) {
            await Sharing.shareAsync(fileUri);
        } else {
            console.log('Sharing not available on this device.');
            // Handle alternative saving methods for Android if needed
        }

    } catch (e) {
        console.error(e);
        
    }
    
  }

  return (
    <SafeAreaView style={styles.container}>
      <View>
        <Pressable
            style={styles.startButton}
            onPress={handleImport}>
            <Text style={styles.buttonText}>Import Data</Text>
        </Pressable>
        <Pressable
            style={styles.startButton}
            onPress={() => handleExport('weight')}>
            <Text style={styles.buttonText}>Export Weight Data</Text>
        </Pressable>
        <Pressable
            style={styles.startButton}
            onPress={() => handleExport('workouts')}>
            <Text style={styles.buttonText}>Export Workout Data</Text>
        </Pressable>
        <Pressable
            style={styles.startButton}
            onPress={() => handleExport('exercises')}>
            <Text style={styles.buttonText}>Export Exercise Data</Text>
        </Pressable>
        <Pressable
            style={styles.startButton}
            onPress={() => handleExport('sets')}>
            <Text style={styles.buttonText}>Export Sets Data</Text>
        </Pressable>
      </View>
    </SafeAreaView>
  );
}

function createStyles(theme, colorScheme) {
  return StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: theme.background,
      color: 'white'
    },
    text: {
      color: theme.text
    },
    startButton: {
      marginHorizontal: 'auto',
      height: 60,
      width: 250,
      borderRadius: 20,
      justifyContent: 'center',
      backgroundColor: theme.tabIconSelected,
      padding: 6,
      marginBottom: 15,
      marginTop: 15
    },
    button: {
      backgroundColor: theme.tabIconSelected,
      borderRadius: 20,
      padding: 6,
    },
    buttonText: {
      color: 'black',
      justifyContent: 'center',
      marginHorizontal: 'auto',
      fontSize: 28
    },
  })
}
