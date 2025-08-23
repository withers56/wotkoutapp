import { Text, View, TextInput, Pressable, StyleSheet, FlatList, Alert } from 'react-native'
import { React, useState, useContext, useEffect, useCallback} from 'react'
import { SafeAreaView } from "react-native-safe-area-context";
import { ThemeContext } from "@/context/ThemeContext";
import Animated from 'react-native-reanimated'

import { useSQLiteContext } from 'expo-sqlite';
import { useFocusEffect } from 'expo-router';


export default function Workout() {
    const [workoutHistory, setWorkoutHistory] = useState([]);
    const [name, setName] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [workout, setWorkout] = useState({
      start_time: null,
      end_time: null
    });

    const {colorScheme, setColorScheme, theme} = useContext(ThemeContext)
    const styles = createStyles(theme, colorScheme)

    const db = useSQLiteContext();

    const loadHistory = async () => {
      const result = await db.getAllAsync("SELECT * FROM workouts");
      console.log(result.rows);
      
      // setWorkoutHistory(result.rows);
    }

    useFocusEffect(
      useCallback(() => {
        loadHistory();
      }, [])
    )
    
    

    const handleSubmit = async (newWorkout) => {
      // try {
      //   //validate
      //   if (newWorkout.start_time === null || newWorkout.end_time === null) {
      //     throw new Error('missing field')
      //   }

      //   await db.runAsync(
      //     'INSERT INTO workouts (start_time, end_time) VALUES (?, ?)',
      //     [newWorkout.start_time, newWorkout.end_time]
      //   );

      //   Alert.alert('success', 'workout added');
      //   setWorkout({
      //     start_time: null,
      //     end_time: null
      //   })

      // } catch (e) {
      //   console.error(e);
      // }

      try {
        db.runAsync(
          "INSERT INTO workouts (name) VALUES (?)",
          ['test']
        );

        console.log('past run async');
      } catch (e) {
        console.error(e);
        
      }

      
        
    }

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

    const startWorkoutBtn = () => {
      console.log('start workout btn');
      const start = new Date(Date.now())

      console.log('start time: ' + new Date(start));

      const end  = new Date(Date.now() + (30 * 60000))

      console.log('end time: ' + new Date(end));

      console.log(workout);

      const mockWorkout = {
        start_time: start,
        end_time: end
      }
      
      
      console.log({...workout, start_time: start, end_time: end});
      

      setWorkout({...workout, start_time: start, end_time: end});

      // handleSubmit(mockWorkout);

    }

    const renderListItem = ({ item }) => (
      <View style={styles.workoutItem}>
        <Text style={styles.workoutText}>{item.name}</Text>
      </View>
    )

    return (
        <SafeAreaView style={styles.container}>
            <View>
                <Pressable
                  style={styles.button}
                  onPress={handleSubmit}>
                  <Text style={styles.buttonText}>Start Workout</Text>    
                </Pressable>
                <Text>{workout.start_time != null ? workout.start_time.getTime() : ''}</Text>
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
      marginTop: 15
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