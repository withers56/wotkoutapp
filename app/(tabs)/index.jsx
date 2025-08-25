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
      const result = await db.getAllAsync("SELECT * FROM workouts ORDER BY id DESC");
      console.log(result);
      
      setWorkoutHistory(result);
    }

    useFocusEffect(
      useCallback(() => {
        loadHistory();
      }, [])
    )
    
    

    const handleSubmit = async (newWorkout) => {


      const start = new Date(Date.now()).toLocaleString('en-US', {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
    })

      // console.log('start time: ' + new Date(start));

      const end  = new Date(Date.now() + (30 * 60000)).toLocaleString('en-US', {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
    })



      try {
        db.runAsync(
          "INSERT INTO workouts (name, start_time, end_time) VALUES (?, ?, ?)",
          ['test v2', start, end]
        );

        console.log('past run async');

        loadHistory()
      } catch (e) {
        console.error(e);
        
      }

      
        
    }

    const handleDelete = async (id) => {
      try {
        await db.runAsync("DELETE FROM workouts WHERE id = ?;", [id]);
        loadHistory()
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
        {/* <Text style={styles.workoutText}>{item.name}</Text> */}
        <View>
          <Text style={styles.workoutText}>{item.start_time}</Text>
          {/* <Text style={styles.workoutText}>{item.end_time}</Text> */}
        </View>
        <View>
          <Pressable 
            style={styles.button}
            onPress={() => {handleDelete(item.id)}}>
            <Text>Delete</Text>
          </Pressable>  
        </View>
      </View>
    )

    return (
        <SafeAreaView style={styles.container}>
            <View>
                <Pressable
                  style={styles.startButton}
                  onPress={handleSubmit}>
                  <Text style={styles.buttonText}>Start Workout</Text>    
                </Pressable>
                <Text>{workout.start_time != null ? workout.start_time.getTime() : ''}</Text>
            </View>
            <Animated.FlatList
              data={workoutHistory}
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
    workoutItem: {
      flexDirection: 'row',
      // alignItems: 'center',
      justifyContent: 'space-between',
      // gap: 4,
      padding: 10,
      borderBottomColor: 'gray',
      borderBottomWidth: 1,
      width: '100%',
      maxWidth: 1024,
      marginHorizontal: 'auto',
      pointerEvents: 'auto',
    },
    workoutText: {
      // flex: 1,
      fontSize: 18,
      fontFamily: 'Inter_500Medium',
      color: theme.text,
    }
  })
}