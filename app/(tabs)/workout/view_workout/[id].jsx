/* eslint-disable react-hooks/rules-of-hooks */
import { ThemeContext } from "@/context/ThemeContext";
import { useCallback, useContext, useEffect, useState, useLayoutEffect } from 'react';
import { FlatList, Pressable, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import Animated from 'react-native-reanimated';
import { SafeAreaView } from "react-native-safe-area-context";
import { List } from 'react-native-paper';
import { useNavigation } from "@react-navigation/native";

import { useFocusEffect, useRouter, useLocalSearchParams } from 'expo-router';
import * as SQLite from 'expo-sqlite';
import { getAllWorkoutInfo, getAllWorkoutInfoById, getWorkoutInfoById } from "../../../../db/dbstatments";

const view_workout = () => {
    const { id } = useLocalSearchParams();
    const db = SQLite.useSQLiteContext();
    const {colorScheme, setColorScheme, theme} = useContext(ThemeContext)
    const styles = createStyles(theme, colorScheme)

    const navigation = useNavigation();
  
  
    const [workout, setWorkout] = useState([]);
    const [volume, setVolume] = useState(0);
    const [setCount, setSetCount] = useState(0);
    const [startTime, setStartTime] = useState('');
    const [endTime, setEndTime] = useState('');

    useLayoutEffect(() => {
      navigation.setOptions({
        title: 'My Workout #' + id // Update the header title
      });
    }, [navigation]);

    useEffect(()=>{
      getWorkout();
    }, [])

    const getWorkout = async () => {
      let volumeTracker = 0;
      let setTracker = 0;
      const workoutMap = new Map();
      const workoutData = await db.getAllAsync(getWorkoutInfoById(id));
      
      workoutData.map(data => {
        console.log(data);

        //set start and end time states
        if (startTime === '' || endTime === '') {
          setStartTime(data.start_time)
          setEndTime(data.end_time);

          console.log('time: ' + new Date(data.start_time));
          
        }
        
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

          setTracker = setTracker + 1;
          volumeTracker = volumeTracker + (set.weight * set.reps)

          setsToadd.push({weight: set.weight, reps: set.reps})
        })

        exerciseObjectToAdd.sets = setsToadd;
        setWorkout(prev => [...prev, {name: exerciseObjectToAdd.name, sets: exerciseObjectToAdd.sets}])
        setVolume(volumeTracker);
        setSetCount(setTracker);
      }
    }
    const renderSets = ({item, index}) => (
      <View style={styles.exerciseData}>
                    <Text style={[styles.text, styles.gridItem, {width: '23%'}]}>{index + 1}</Text>
                    {/* <ThemeText>-</ThemeText> */}
                    <Text style={[styles.text, styles.gridItem]}>{item.weight}</Text>
                    <Text style={[styles.text, styles.gridItem]}>{item.reps}</Text>
                    {/* <TextInput
                        style={styles.input}
                        keyboardType="numeric" 
                        value={item.weight}
                        onChangeText={(value) => {setCurrentSet((prevData) => ({...prevData, weight: value}))}}
                        placeholder='0'/>
                    <TextInput
                        style={styles.input}
                        keyboardType="numeric"
                        value={item.reps}
                        onChangeText={(value) => {setCurrentSet((prevData) => ({...prevData, reps: value}))}}
                        placeholder='0'/> */}
                    <Text style={[styles.text, styles.gridItemAdd]}>{item.weight * item.reps}</Text>

        </View>




      // <View>
      //   <Text style={styles.text}>{`${item.weight} lbs x ${item.reps}`}</Text>
      //   <Text style={styles.text}>{index + 1}</Text>
      // </View>
    )

    const renderWorkout = ({item}) => (
      <View>
        <Text style={[styles.text, {fontSize: 24}]}>{item.name}</Text>
          <View style={[styles.exerciseData, styles.bottomBorder]}>
            <Text style={[styles.text, styles.gridItem]}>Set</Text>
            <Text style={[styles.text, styles.gridItem]}>Lbs</Text>
            <Text style={[styles.text, styles.gridItem]}>Reps</Text>
            <Text style={[styles.text, styles.griditemAdd]}>Volume</Text>
          </View>
          
        <FlatList 
          data={item.sets}
          renderItem={renderSets}
          keyExtractor={(item, index) => item.id ? item.id.toString() : index.toString()}/>
      
      </View>
    )

    return (
      <View style={styles.container}>
        <View style={styles.metricsContainer}>
                    <View>
                        <Text style={styles.text}>Volume</Text>
                        <Text style={styles.text}>{volume}</Text>
                    </View>
                    <View>
                        <Text style={styles.text}>Sets</Text>
                        <Text style={styles.text}>{setCount}</Text>
                    </View>
                    <View>
                        <Text style={styles.text}>Time</Text>
                        <Text style={styles.text}>{(new Date(startTime) - new Date(endTime))}</Text>
                    </View>
                </View>

        <View style={styles.exerciseContainer}>
          <FlatList 
              data={workout}
              renderItem={renderWorkout}
              keyExtractor={(item, index) => item.id ? item.id.toString() : index.toString()}/>

        </View>
          

          
      </View>
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
      color: theme.text,
      fontSize: 18
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
    headingContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        padding: 10,
        width: '100%',
        maxWidth: 1024,
        alignItems: 'center'
    },metricsContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        padding: 10,
        borderBottomColor: 'gray',
        borderBottomWidth: 1,
        width: '100%',
        maxWidth: 1024,
    },exerciseData: {
        flexDirection: 'row',
        marginVertical: 7,
        paddingBottom: 5,
        justifyContent: 'space-between',
    },gridItem: {
        // flex: 1
        width: '25%'
    },
    griditemAdd: {
        // flex: 0,
        // width: '25%',
        // alignItems: 'flex-end',
        alignSelf: 'flex-end'

        
    },
    exerciseContainer: {
      padding: 10,
      height: '80%'
    },
    bottomBorder: {
        borderBottomColor: 'gray',
        borderBottomWidth: 1
    },
    
  })
}

export default view_workout