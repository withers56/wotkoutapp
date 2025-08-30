/* eslint-disable react-hooks/rules-of-hooks */
import { ThemeContext } from "@/context/ThemeContext";
import { useCallback, useContext, useEffect, useState } from 'react';
import { FlatList, Pressable, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import Animated from 'react-native-reanimated';
import { SafeAreaView } from "react-native-safe-area-context";
import { List } from 'react-native-paper';

import { useFocusEffect, useRouter, useLocalSearchParams } from 'expo-router';
import * as SQLite from 'expo-sqlite';
import { getAllWorkoutInfo, getAllWorkoutInfoById, getWorkoutInfoById } from "../../../../db/dbstatments";

const view_workout = () => {
    const { id } = useLocalSearchParams();
    const db = SQLite.useSQLiteContext();
    const {colorScheme, setColorScheme, theme} = useContext(ThemeContext)
    const styles = createStyles(theme, colorScheme)
  
  
    const [workout, setWorkout] = useState([]);

    useEffect(()=>{
      getWorkout();
    }, [])

    const getWorkout = async () => {
      const workoutMap = new Map();
      const workoutData = await db.getAllAsync(getWorkoutInfoById(id));
      
      workoutData.map(data => {
        console.log(data);
        
        if (!workoutMap.has(data.name)) {

          workoutMap.set(data.name, [{
            weight: data.weight,
            reps: data.reps
          }]);
          
        } else {
   
          workoutMap.set(data.name, [...workoutMap.get(data.name), {
            weight: data.weight,
            reps: data.reps
          }])
        }
      })

      for (const [key, value] of workoutMap) {
        
        let exerciseObjectToAdd = {
          name: '',
          sets: []
        }
        
        let setsToadd = [];
        exerciseObjectToAdd.name = key;

        value.map(set => {
          console.log(set.weight);
          console.log(set.reps);

          setsToadd.push({weight: set.weight, reps: set.reps})
        })

        exerciseObjectToAdd.sets = setsToadd;
        setWorkout(prev => [...prev, {name: exerciseObjectToAdd.name, sets: exerciseObjectToAdd.sets}])
      }
    }
    const renderSets = ({item}) => (
      <View>
        <Text>{item.weight}</Text>
        <Text>{item.reps}</Text>
      </View>
    )

    const renderWorkout = ({item}) => (
      <View>
        <Text>{item.name}</Text>
        <FlatList 
          data={item.sets}
          renderItem={renderSets}
          keyExtractor={(item, index) => item.id ? item.id.toString() : index.toString()}/>
        <Pressable
          style={styles.startButton}
          onPress={() => {console.log(workout)}}>
          <Text style={theme.text}>press</Text>
        </Pressable>  
      </View>
    )

    return (
    <SafeAreaView style={styles.container}>
        <Text style={styles.text}>view workout {id}</Text>

        <FlatList 
          data={workout}
          renderItem={renderWorkout}
          keyExtractor={(item, index) => item.id ? item.id.toString() : index.toString()}/>
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
  })
}

export default view_workout