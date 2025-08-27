import { ThemeContext } from "@/context/ThemeContext";
import { useContext, useEffect, useState } from 'react';
import { Alert, KeyboardAvoidingView, Modal, Platform, Pressable, SafeAreaView, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';
import Animated from 'react-native-reanimated';
import ThemeText from "../../../context/ThemeText";


import { useRouter } from 'expo-router';
import * as SQLite from 'expo-sqlite';
import { useSQLiteContext } from 'expo-sqlite';
import { dbName } from "../../_layout";


const start_workout = () => {
    const [modalVisible, setModalVisible] = useState(false);
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
    const [currentExerciseId, setCurrentExerciseId] = useState('');
    const [prevExerciseId, setPrevExeciseId] = useState('');
    const [exercises, setExercises] = useState([{
        id: '',
        name: '',
        sets: []
    }]);
    const [exerciseList, setExerciseList] = useState([]);
    const [selectedExercise, setSelectedExercise] = useState([{
        id: '',
        name: '',
        sets: [
            {
                weight: 0,
                reps: 0
            }
        ]
    }]);

    const [savedSets, setSavedSets] = useState([]);
    const [currentSets, setCurrentSets] = useState([]);
    const [currentSet, setCurrentSet] = useState({
        exerciseId: '',
        weight: 0,
        reps: 0
    });

    const [count, setCount] = useState(0);

    const {colorScheme, setColorScheme, theme} = useContext(ThemeContext)
    const styles = createStyles(theme, colorScheme)

    const router = useRouter();
    const db = useSQLiteContext();

    useEffect(()=> {
        loadExercises();
    }, [])

    const loadExercises = async () => {
        console.log('in load exercises');
        
        const result = await db.getAllAsync("SELECT * FROM exercises ORDER BY id DESC");
        // console.log(result);

        setExerciseList(result)
        
    }

    const handleSubmit = () => {
        console.log('clicked add exercise');

        exerciseList.forEach(item => {
            // console.log(item.name);
            
        })

        setModalVisible(true)
        
    }

    const handleCancel = () => {
        console.log('cancel');
        router.back()
    }   

    const handleExerciseSelection = (exercise) => {
        console.log('Selected: ' + exercise.name);

        if (currentExerciseId === '') {
            setPrevExeciseId(exercise.id)
        }

        if(currentExerciseId != exercise.id) {
            setPrevExeciseId(currentExerciseId);
        }

        setCurrentExerciseId(exercise.id)



        // setSelectedExercise([...selectedExercise, {id: exercise.id, name: exercise.name, sets: [{weight: 0, reps: 0}]}]);


        if (exercises[0].id === '') {
            setExercises([{
                id: exercise.id,
                name: exercise.name,
                sets: []
            }])
        } else {
            setExercises([...exercises, {id: exercise.id, name: exercise.name, sets: []}])
        }

        setCurrentSet({
            exerciseId: '',
            weight: 0,
            reps: 0
        })

        // setCurrentSet((prevData) => ({...prevData, exerciseId: exercise.id}))


        setModalVisible(!modalVisible)
    }

    const handleCompletedSet = () => {
        console.log('set that was completed: ' + currentSet.weight, currentSet.reps);
        console.log('exercise id to add to: ' + currentExerciseId);
        
        const setToAdd = {
            exerciseId: currentExerciseId,
            weight: currentSet.weight,
            reps: currentSet.reps
        }

        setExercises(prevItems => prevItems.map(item => item.id === setToAdd.exerciseId ? 
            {...item, sets: [...item.sets, setToAdd]} : item
        ))

        exercises.map(item => item.id === setToAdd.exerciseId ? console.log(item.sets) : console.log('not found'))
        
        const index = exercises.findIndex(item => item.id === currentExerciseId);

        console.log(index);

        exercises.map(item => {console.log('item name: ' + item. name, 'item sets: ');
            item.sets.map(set => {console.log('weight: ' + set.weight, 'reps: ' + set.reps);
            })
        })

        // if (index !== -1) {
        //     data[index] = { ...data[index], ...objectToUpdate }; // Update properties or replace entirely
        // }


        

    
        // setCurrentSets([...currentSets, {exerciseId: currentSet.exerciseId, weight: currentSet.weight, reps: currentSet.reps}])

        

        // setSelectedExercise([...selectedExercise.sets, {weight: currentSet.weight, reps: currentSet.reps}])

        if (prevExerciseId != currentExerciseId) {
                        console.log('keeps value in fields');

        } else {
                        console.log('sets fields to zero');

        }
        
    } 

    const renderDataRow = ({item, index}) => (
        <View style={styles.exerciseData}>
                    <ThemeText>{index + 1}</ThemeText>
                    <ThemeText>-</ThemeText>
                    <ThemeText>{item.weight}</ThemeText>
                    <ThemeText>{item.reps}</ThemeText>
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
                    <Pressable
                        // onPress={handleCompletedSet}
                        >
                        <ThemeText>add</ThemeText>
                    </Pressable>
                </View>
    )

    const renderExercise = ({ item }) => (
            <View style={styles.exerciseCurrentContainer}>
                <ThemeText>{item.name}</ThemeText>
                {exercises[0].id != '' ? (<View style={styles.exerciseData}>
                    <ThemeText>Set</ThemeText>
                    <ThemeText>Previous</ThemeText>
                    <ThemeText>Lbs</ThemeText>
                    <ThemeText>Reps</ThemeText>
                    <ThemeText>^</ThemeText>
                </View>) : ('')}
                
                <Animated.FlatList 
                    data={item.sets}
                    renderItem={renderDataRow}
                    keyExtractor={data => data.length}
                    />


                {exercises[0].id === '' || item.id != currentExerciseId ? ('') : (
                    <View style={styles.exerciseData}>
                        <ThemeText>{item.sets.length + 1}</ThemeText>
                        <ThemeText>-</ThemeText>
                        <TextInput
                            style={styles.input}
                            keyboardType="numeric" 
                            value={currentSet.weight}
                            onChangeText={(value) => {setCurrentSet((prevData) => ({...prevData, weight: value}))}}
                            placeholder='0'/>
                        <TextInput
                            style={styles.input}
                            keyboardType="numeric"
                            value={currentSet.reps}
                            onChangeText={(value) => {setCurrentSet((prevData) => ({...prevData, reps: value}))}}
                            placeholder='0'/>
                        <Pressable
                            onPress={handleCompletedSet}>
                            <ThemeText>add</ThemeText>
                        </Pressable>
                    </View>
                )}


                

            </View>
    )

    const renderExerciseList = ({ item }) => (
        <TouchableOpacity onPress={() => handleExerciseSelection(item)}>
            <View style={styles.exerciseItem}>
                <ThemeText>{item.name}</ThemeText>
            </View>
        </TouchableOpacity>
    )

    const handleFinishWorkout = async () => {
        
        const dbTrans = await SQLite.openDatabaseAsync(dbName);


        const workoutToSubmit = currentWorkout;
        let setsToSubmit = [];

        workoutToSubmit.end_time = new Date(Date.now()).toLocaleString('en-US', {
                        year: 'numeric',
                        month: 'long',
                        day: 'numeric',
                        hour: '2-digit',
                        minute: '2-digit'
                    })
        
        console.log('workout to submit: ');
        console.log(JSON.stringify(workoutToSubmit));

        exercises.map(exercise => {
            setsToSubmit.push(...exercise.sets);
        })

        console.log('sets to submit: ');
        console.log(JSON.stringify(setsToSubmit));


        Promise.all([
            dbTrans.withTransactionAsync(async () => {

                try {

                    let workoutId = '';
                    let setIds = [];

                    const result = await dbTrans.runAsync("INSERT INTO workouts (name, start_time, end_time) VALUES (?, ?, ?)",
                    [workoutToSubmit.name, workoutToSubmit.start_time, workoutToSubmit.end_time]);

                    const newWorkoutId = result.lastInsertRowId;
                    console.log('New row ID:', newWorkoutId);
                    
                    workoutId = newWorkoutId;

                    for (let index = 0; index < setsToSubmit.length; index++) {
                        const set = setsToSubmit[index];
                
                        const id = await dbTrans.runAsync('INSERT INTO sets (reps, weight, exercise_id, workout_id) VALUES (?, ?, ?, ?)',
                                [set.reps, set.weight, set.exerciseId, workoutId]);

                        const setId = id.lastInsertRowId;

                        // await dbTrans.runAsync("INSERT INTO workout_sets (workout_id, set_id) VALUES (?, ?)",
                        //     [workoutId, setId]
                        // )
                    
                    }



                } catch (e) {
                    console.error(e);
                    
                }
                
                    router.back()
            })
        ])



        // try {
        //     dbTrans.transaction(tx => {
        //         tx.executeSql("INSERT INTO workouts (name, start_time, end_time) VALUES (?, ?, ?)",
        //             [workoutToSubmit.name, workoutToSubmit.start_time, workoutToSubmit.end_time],
        //             (transaction, resultset) => {
        //                 const newRowId = resultSet.insertId;
        //                 console.log('New row ID:', newRowId);
        //             },
        //             (transaction, error) => {
        //                 console.error('Error inserting data:', error);
        //                 return true; 
        //             })
        //     })

        //     // await db.runAsync("INSERT INTO workouts (name, start_time, end_time) VALUES (?, ?, ?)",
        //     //         [workoutToSubmit.name, workoutToSubmit.start_time, workoutToSubmit.end_time]
        //     // )

        //     for (let index = 0; index < setsToSubmit.length; index++) {
        //         const set = setsToSubmit[index];
                
        //         const id = await db.runAsync('INSERT INTO sets (reps, weight, exercise_id) VALUES (?, ?, ?)',
        //             [set.reps, set.weight, set.exerciseId]);

        //         console.log(id);
                    
        //     }




        //     router.back()
            
        // } catch (e) {
        //     console.error(e);
            
        // }
        
    }

    const renderFooter = () => {
        return (<View>
            <Pressable
                    style={[styles.addButton, styles.addButtonPrimary]}
                    onPress={handleSubmit}>
                    <Text style={styles.buttonText}>Add Exercise</Text>
            </Pressable>
            <Pressable 
                    style={[styles.addButton, styles.cancelButton]}
                    onPress={handleCancel}>
                    <Text style={styles.buttonText}>Cancel Workout</Text>
            </Pressable>
        </View>)
    }


  return (
    <SafeAreaView style={styles.container}>
        <View style={styles.headingContainer}>
            <ThemeText style={styles.text}>{currentWorkout.name}</ThemeText>
            {/* <ThemeText style={styles.text}>{currentWorkout.start_time}</ThemeText> */}
            <Pressable 
                style={styles.finishButton}
                onPress={handleFinishWorkout}>
                <Text style={styles.buttonText}>Finish</Text>
            </Pressable>
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
        <KeyboardAvoidingView
                style={styles.exerciseContainer}
                // keyboardVerticalOffset={200}
                behavior={Platform.OS === 'ios' ? 'padding' : 'height'}>
            <View >
                
                    <Animated.FlatList 
                        data={exercises}
                        renderItem={renderExercise}
                        keyExtractor={data => data.id}
                        ListFooterComponent={renderFooter}/>
                
            </View>
        </KeyboardAvoidingView>

        <Modal
          animationType="slide"
          transparent={true}
          visible={modalVisible}
          onRequestClose={() => {
            Alert.alert('Modal has been closed.');
            setModalVisible(!modalVisible);
          }}>
            <View style={styles.centeredView}>
                <View style={styles.modalView}>
                    <View style={styles.modalButtons}>
                        <Pressable
                            // style={[styles.button, styles.buttonClose]}
                            onPress={() => setModalVisible(!modalVisible)}>
                            <Text style={styles.textStyle}>X</Text>
                        </Pressable>    
                        <Pressable
                            // style={[styles.button, styles.buttonClose]}
                            onPress={() => setModalVisible(!modalVisible)}>
                            <Text style={styles.textStyle}>Add</Text>
                        </Pressable>
                    </View>

                    <Animated.FlatList 
                        data={exerciseList}
                        renderItem={renderExerciseList}
                        keyExtractor={data => data.id}/>
                    
                </View>
            </View>
          </Modal>

    </SafeAreaView>
  )
}

function createStyles(theme, colorScheme) {
  return StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: theme.background,
      flexDirection: 'column',
    },
    text: {
      color: theme.text
    },
    input: {
    height: 40,
    borderColor: 'gray',
    borderWidth: 1,
    paddingHorizontal: 10,
  },
    headingContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        padding: 10,
        width: '100%',
        maxWidth: 1024,
        alignItems: 'center'
    },
    metricsContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        padding: 10,
        borderBottomColor: 'gray',
        borderBottomWidth: 1,
        width: '100%',
        maxWidth: 1024,
    },
    exerciseContainer: {
        height: '75%'
    },
    exerciseCurrentContainer: {
        padding: 10
    },
    addButton: {
      marginHorizontal: 'auto',
      height: 45,
      width: 200,
      borderRadius: 20,
      justifyContent: 'center',
      backgroundColor: theme.tabIconSelected,
      padding: 6,
      marginTop: 20
    },
    finishButton: {
      width: 100,
      borderRadius: 20,
      justifyContent: 'center',
      backgroundColor: theme.tabIconSelected,
      padding: 6
    },
    cancelButton: {
        backgroundColor: theme.danger
    },
    addButtonPrimary: {
        backgroundColor: theme.primary
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
      fontSize: 21
    },
     exerciseItem: {
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
    exerciseData: {
        flexDirection: 'row',
        justifyContent: 'space-between'
    },
    centeredView: {
      flex: 1,
      justifyContent: 'flex-end',
      alignItems: 'center',
    },
    modalButtons: {
        flexDirection: 'row',
        justifyContent: 'space-between'
    },

    modalView: {
      margin: 20,
      width: '95%',
      height: '72%',
      backgroundColor: theme.modalBackground,
      borderRadius: 20,
      padding: 10,
      
    //   alignItems: 'center',
      shadowColor: '#000',
      shadowOffset: {
        width: 0,
        height: 2,
      },
      shadowOpacity: 0.25,
      shadowRadius: 4,
      elevation: 5,
    },
    
  })
}

const filterSets = (allSets, targetId) => {
    return currentSet.filter(set => set.exerciseId == currentSet.exerciseId)
}

export default start_workout