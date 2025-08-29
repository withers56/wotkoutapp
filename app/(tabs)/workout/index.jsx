import { ThemeContext } from "@/context/ThemeContext";
import { useCallback, useContext, useState } from 'react';
import { Pressable, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import Animated from 'react-native-reanimated';
import { SafeAreaView } from "react-native-safe-area-context";
import { List } from 'react-native-paper';

import { useFocusEffect, useRouter } from 'expo-router';
import { useSQLiteContext } from 'expo-sqlite';
import { getAllWorkoutInfo, getAllWorkoutInfoById, getWorkoutInfoById } from "../../../db/dbstatments";



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

    const router = useRouter();


    const db = useSQLiteContext();

    const loadHistory = async () => {
      const result = await db.getAllAsync("SELECT * FROM workouts ORDER BY id DESC");
      const sets = await db.getAllAsync("SELECT * FROM sets");

      // const ws = await db.getAllAsync("SELECT * FROM workout_sets");



      // const test = await db.getAllAsync(
      //   "SELECT w.id, w.start_time, s.weight, s.reps, e.name FROM workouts AS w INNER JOIN sets AS ws ON w.id = ws.workout_id INNER JOIN sets AS s ON ws.set_id = s.id INNER JOIN exercises AS e ON s.exercise_id = e.id");

      // const test = await db.getAllAsync("SELECT weight, reps FROM sets INNER JOIN workouts on workouts.id = sets.workout_id ORDER BY workouts.id")
      const test = await db.getAllAsync("SELECT w.id, w.start_time, s.weight, s.reps, e.name FROM workouts AS w LEFT OUTER JOIN sets AS s ON w.id = s.workout_id LEFT OUTER JOIN exercises AS e ON s.exercise_id = e.id")


      test.sort((a, b) => {
        return a.id - b.id;
      });
      // console.log(test);


      
      // console.log(sets);

    
      
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
        // db.runAsync(
        //   "INSERT INTO workouts (name, start_time, end_time) VALUES (?, ?, ?)",
        //   ['test v2', start, end]
        // );

        console.log('past run async');
        // loadHistory()

        router.navigate('/workout/start_workout/[id]')
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

    // const mapWorkoutHistoryData = async () => {
    //   const workoutMap = new Map();
    //   const exerciseMap = new Map();

    //   const workoutData = await db.getAllAsync(getAllWorkoutInfo());
      
    //   workoutData.map(data => {
    //     console.log(data);
        
    //     if (!workoutMap.has(data.wname)) {
    //       console.log('create outer map key with name: ' + data.wname);


    //       if (!exerciseMap.has(data.ename)) {
    //         console.log('create inner map key with name: ' + data.ename);

    //           exerciseMap.set(data.ename, [{
              
    //           weight: data.weight,
    //           reps: data.reps
    //         }]);
    //       } else {
    //         console.log('add to keys value inner map');

    //         exerciseMap.set(data.ename, [...exerciseMap.get(data.ename), {
            
    //         weight: data.weight,
    //         reps: data.reps
    //       }])
    //       }




    //       // workoutMap.set(data.wname, exerciseMap.get(data.ename));
    //       workoutMap.set(data.wname, 'test');

          
    //     } else {
    //       console.log('add to keys value');
          
    //       // workoutMap.set(data.wname, [...workoutMap.get(data.wname), exerciseMap.get(data.ename)])
    //       workoutMap.set(data.wname, [...workoutMap.get(data.wname), 'test'])

    //     }
    //   })

    //   console.log(exerciseMap);
      
    //   // console.log(workoutMap);
    // }

    const handleWorkoutPress = async (id) => {
      console.log('clicked workout with id of: ' + id);

      const workoutMap = new Map();

      const workoutData = await db.getAllAsync(getWorkoutInfoById(id));
      
      workoutData.map(data => {
        console.log(data);
        
        if (!workoutMap.has(data.name)) {
          console.log('create key with name');

          workoutMap.set(data.name, [{
            weight: data.weight,
            reps: data.reps
          }]);
          
        } else {
          console.log('add to keys value');
          
          workoutMap.set(data.name, [...workoutMap.get(data.name), {
            weight: data.weight,
            reps: data.reps
          }])
        }
      })

      console.log(workoutMap);
      
      // router.navigate(`/workout/start_workout${id}`)
      // router.push({ pathname: "/workout/start_workout[id]", params: { id: 1 } });
      router.push(`workout/start_workout/${id}`)
    }

    const renderListItem = ({ item }) => (
      <TouchableOpacity
        onPress={() => {handleWorkoutPress(item.id)}}>
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
      </TouchableOpacity>
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