import { ThemeContext } from "@/context/ThemeContext";
import { useContext, useState } from 'react';
import { SafeAreaView, StyleSheet, Text, View } from 'react-native';
import ThemeText from "../../../context/ThemeText";



const start_workout = () => {
    const [currentWorkout, setCurrentWorkout] = useState({
        name: 'My Workout',
        start_time: new Date(Date.now()).toLocaleString('en-US', {
                        year: 'numeric',
                        month: 'long',
                        day: 'numeric',
                        hour: '2-digit',
                        minute: '2-digit'
                    }),
        end_time: null
    });
    const [currentExercises, setCurrentExercise] = useState({});
    const {colorScheme, setColorScheme, theme} = useContext(ThemeContext)
    const styles = createStyles(theme, colorScheme)


  return (
    <SafeAreaView style={styles.container}>
        <View>
            <Text style={styles.text}>{currentWorkout.name}</Text>
            <Text style={styles.text}>{currentWorkout.start_time}</Text>
        </View>
        <View style={styles.metricsContainer}>
            <View>
                <ThemeText>Volume</ThemeText>
                <ThemeText>22938</ThemeText>
            </View>
            <View>
                <ThemeText>Sets</ThemeText>
                <ThemeText>12</ThemeText>
            </View>
            <View>
                <ThemeText>Time</ThemeText>
                <ThemeText>15:04</ThemeText>
            </View>
        </View>
    </SafeAreaView>
  )
}

function createStyles(theme, colorScheme) {
  return StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: theme.background,
    //   flexDirection: 'column',
      padding: 10
    },
    text: {
      color: theme.text
    },
    metricsContainer: {
        flexDirection: 'row',
        justifyContent: 'space-evenly'
    }
    
  })
}

export default start_workout