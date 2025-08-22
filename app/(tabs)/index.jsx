import { Text, View, TextInput, Pressable, StyleSheet, FlatList } from 'react-native'
import { React, useState, useContext, useEffect} from 'react'
import { SafeAreaView } from "react-native-safe-area-context";
import { ThemeContext } from "@/context/ThemeContext";
import Animated from 'react-native-reanimated'

export default function Workout() {
    const {colorScheme, setColorScheme, theme} = useContext(ThemeContext)
    const styles = createStyles(theme, colorScheme)

    const dummyData = [
      {
        id: '1',
        name: 'squat'
      },
      {
        id: '2',
        name: 'bench'
      },
      {
        id: '3',
        name: 'deadlift'
      }
    ]

    const renderListItem = ({ item }) => (
      <View style={styles.workoutItem}>
        <Text style={styles.workoutText}>{item.name}</Text>
      </View>
    )

    return (
        <SafeAreaView style={styles.container}>
            <View>
                <Pressable
                  style={styles.button}>
                <Text style={styles.buttonText}>Start Workout</Text>    
                </Pressable>
            </View>
            <Animated.FlatList
              data={dummyData}
              renderItem={renderListItem}
              keyExtractor={data => data.id} />

        </SafeAreaView>
        
    )
}

function createStyles(theme, colorScheme) {
  return StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: theme.background,
      flexDirection: 'column'
    },
    text: {
      color: theme.text
    },
    button: {
      marginHorizontal: 'auto',
      height: 60,
      width: 250,
      borderRadius: 20,
      justifyContent: 'center',
      backgroundColor: theme.tabIconSelected,
      padding: 6,
      marginBottom: 15,
    },
    buttonText: {
      color: 'black',
      justifyContent: 'center',
      marginHorizontal: 'auto',
      fontSize: 28
    },
    workoutItem: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
      gap: 4,
      padding: 10,
      borderBottomColor: 'gray',
      borderBottomWidth: 1,
      width: '100%',
      maxWidth: 1024,
      marginHorizontal: 'auto',
      pointerEvents: 'auto',
    },
    workoutText: {
      flex: 1,
      fontSize: 18,
      fontFamily: 'Inter_500Medium',
      color: theme.text,
    }
  })
}