/* eslint-disable react-hooks/rules-of-hooks */
import { ThemeContext } from "@/context/ThemeContext";
import { useNavigation } from "@react-navigation/native";
import { useContext, useEffect, useLayoutEffect, useState } from 'react';
import { FlatList, StyleSheet, Text, View } from 'react-native';

import { useLocalSearchParams } from 'expo-router';
import * as SQLite from 'expo-sqlite';
import { getExercisePB, getWorkoutInfoById } from "../../../../db/dbstatments";

const view_workout = () => {
    const { id } = useLocalSearchParams();
    const db = SQLite.useSQLiteContext();
    const {colorScheme, setColorScheme, theme} = useContext(ThemeContext)
    const styles = createStyles(theme, colorScheme)

    const navigation = useNavigation();
  
  
    const [workout, setWorkout] = useState([]);
    const [workoutName, setWorkoutName] = useState('');
    const [exerciseNames, setExerciseNames] = useState([]);
    const [volume, setVolume] = useState(0);
    const [pbs, setPbs] = useState([]);
    const [setCount, setSetCount] = useState(0);
    const [startTime, setStartTime] = useState('');
    const [endTime, setEndTime] = useState('');
    const [time, setTime] = useState(0);

    useLayoutEffect(() => {
      navigation.setOptions({
        title: workoutName // Update the header title
      });
    }, [navigation, workoutName]);

    useEffect(()=>{
      getWorkout();
      console.log(exerciseNames);
      
    }, [])

    


    const spliceTime = (time) => {
          let splitTime = time.split(' ')
          let splicedData = splitTime[splitTime.length - 1]
          let splitAMPM = splicedData.replaceAll("PM","").replaceAll("AM", "");
          let hourMinuteSeconds = splitAMPM.split(':')

          let startSecondHolder = 0;

          for (let index = 0; index < hourMinuteSeconds.length; index++) {
            
            switch (index) {
              case 0: startSecondHolder = startSecondHolder + (parseInt(hourMinuteSeconds[index]) * 3600);
                break;
              case 1: startSecondHolder = startSecondHolder + (parseInt(hourMinuteSeconds[index]) * 60)  
                break;
              case 2: startSecondHolder = startSecondHolder + (parseInt(hourMinuteSeconds[index]))
                break;
              default: return 
            }
          }

          return startSecondHolder;
    }

    const getWorkout = async () => {
      let volumeTracker = 0;
      let setTracker = 0;
      let pbTracker = [];
      let idTracker = [];
      let time = 0;
      const workoutMap = new Map();
      const workoutData = await db.getAllAsync(getWorkoutInfoById(id));
      setWorkoutName(workoutData.wName);
      // console.log(workoutData.wName);
      
      
      workoutData.map(data => {

        if (!idTracker.includes(data.exercise_id)) {
          idTracker.push(data.exercise_id)
        }

        console.log('mapData: ' + data.wName);
        setWorkoutName(data.wName)

        // console.log(db.getAllAsync(getExercisePB(data.id)));
        

        //set start and end time states
        if (time === 0) {
                
          time = (spliceTime(data.end_time) - spliceTime(data.start_time)) * 1000;
          setTime(time);      
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

      //get exercise pbs by thewir ids in idTracker



      let pbArray = []
      for (let index = 0; index < idTracker.length; index++) {
        const pb = await db.getFirstAsync(getExercisePB(parseInt(parseInt(idTracker[index]))));
        pbArray.push(pb.weight);
        console.log(pb.weight);
        
      }

      console.log(idTracker)
      
      let nameArray = [];

      for (const [key, value] of workoutMap) {

        console.log('key: ' + key);
        
        nameArray.push(key);
        // const exerciseId = await db.getFirstAsync(getExerciseIdByName(key))
        // const exercisePb = await db.getAllAsync(getExercisePB(parseInt(exerciseId.id)))

        // // console.log('before info');
        
        // console.log('exerciseId: ' + parseInt(exerciseId.id));
        // console.log('exercisepb: ' + exercisePb);
        
        

        // pbTracker.push(exercisePb);

        let exerciseObjectToAdd = {
          name: '',
          sets: []
        }
        
        let setsToadd = [];
        exerciseObjectToAdd.name = key;

        value.map(set => {
          // console.log(set.weight);
          // console.log(set.reps);

          setTracker = setTracker + 1;
          volumeTracker = volumeTracker + (set.weight * set.reps)

          setsToadd.push({weight: set.weight, reps: set.reps})
        })

        exerciseObjectToAdd.sets = setsToadd;
        // console.log('pb tracker: ' + pbTracker);
        
        setPbs(pbArray);
        setExerciseNames(nameArray);
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

    const renderWorkout = ({item, index}) => (
      <View>
        <View style={{flexDirection: 'row', justifyContent: 'space-between'}}>
          <Text style={[styles.text, {fontSize: 24}]}>{item.name}</Text>
          <Text style={[styles.text, {fontSize: 24}]}>PR: {pbs[index]}</Text>
        </View>
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
                        <Text style={styles.text}>{new Date(time).toISOString().substring(14, 19)}</Text>
                    </View>
                </View>

        <View style={styles.exerciseContainer}>
          <FlatList 
              data={workout}
              showsVerticalScrollIndicator={false}
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