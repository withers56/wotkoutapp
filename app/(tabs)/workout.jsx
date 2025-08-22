import { Text, View, TextInput, Pressable, StyleSheet, FlatList } from 'react-native'
import { React, useState, useContext, useEffect} from 'react'
import { SafeAreaView } from "react-native-safe-area-context";
import { ThemeContext } from "@/context/ThemeContext";

export default function Workout() {
    const {colorScheme, setColorScheme, theme} = useContext(ThemeContext)
    const styles = createStyles(theme, colorScheme)

    return (
        <SafeAreaView style={styles.container}>
            <View>
                <Text style={styles.text}>workout</Text>
            </View>
        </SafeAreaView>
        
    )
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
    }
  })
}