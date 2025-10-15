import { Text, View, TextInput, Pressable, StyleSheet, FlatList, Button, Platform } from 'react-native'
import { React, useState, useContext, useEffect} from 'react'
import { SafeAreaView } from "react-native-safe-area-context";
import { ThemeContext } from "@/context/ThemeContext";
import { ScrollView } from 'react-native-gesture-handler';

const log_food = () => {
    const {colorScheme, setColorScheme, theme} = useContext(ThemeContext)
    const styles = createStyles(theme, colorScheme)
  
    return (
    <View style={styles.container}>
        <Text style={styles.text}>test</Text>
    </View>
  )
}

function createStyles(theme, colorScheme) {
  return StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: theme.background,
    },
    text: {
      color: theme.text
    },
    dateText: {
      fontSize: 24, width: '100%'
    },
    dateContainer: {
      display: 'flex',
      flexDirection: 'row',
      justifyContent: 'center',
      alignItems: 'center'
    },
    dateContainerButtons: {
      paddingHorizontal: 20
    },
    calendarContainer: {
      display:'flex',
      justifyContent: 'center',
      flexDirection: 'row'
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
    buttonText: {
      color: 'black',
      justifyContent: 'center',
      marginHorizontal: 'auto',
      fontSize: 28
    },
    addFoodContainer: {
      borderBottomColor: 'gray',
      borderBottomWidth: 1,
    }
  })
}

export default log_food