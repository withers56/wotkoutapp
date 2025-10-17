/* eslint-disable react-hooks/rules-of-hooks */
import { ThemeContext } from "@/context/ThemeContext";
import FontAwesome from '@expo/vector-icons/FontAwesome';
import { useContext, useEffect, useState } from 'react';
import { Alert, KeyboardAvoidingView, Modal, Platform, Pressable, SafeAreaView, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';
import Animated from 'react-native-reanimated';
import ThemeText from "../../../context/ThemeText";

import * as Haptics from 'expo-haptics';
import { useRouter } from 'expo-router';
import * as SQLite from 'expo-sqlite';
import { dbName } from "../../_layout";


const start_workout = () => {
    const [modalVisible, setModalVisible] = useState(false);
    const [newExerciseModalVisible, setNewExerciseModalVisible] = useState(false);

    const [currentWorkout, setCurrentWorkout] = useState({
        name: 'My Workout',
        start_time: new Date(Date.now()).toLocaleString('en-US', {
                        year: 'numeric',
                        month: 'long',
                        day: 'numeric',
                        hour: '2-digit',
                        minute: '2-digit',
                        second: '2-digit'
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
    const [newExercise, setNewExercise] = useState('');
    const [exerciseList, setExerciseList] = useState([]);
    const [exerciseListFiltered, setExerciseListFiltered] = useState([]);
    const [searchQuery, setSearchQuery] = useState('');
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

    const [timerStart, setTimerStart] = useState(Date.now())
    const [timer, setTimer] = useState(0);

    const [volumeTracker, setVolumeTracker] = useState(0);
    const [setTracker, setSetTracker] = useState(0);

    const {colorScheme, setColorScheme, theme} = useContext(ThemeContext)
    const styles = createStyles(theme, colorScheme)

    const router = useRouter();
    const db = SQLite.useSQLiteContext();

    useEffect(() => {
        const interval = setInterval(() => {
            
            const timePast = ((Date.now() - timerStart) / 1000)
            setTimer(timePast);
         }, 1000);

         return () => clearInterval(interval);
    }, [])

    useEffect(()=> {
        getWorkoutNumber();
        loadExercises();
    }, [])

    const getWorkoutNumber = async () => {
        console.log('in get workout number');

        const result = await db.getAllAsync("SELECT COUNT(1) AS numberOfWorkouts FROM workouts")

        console.log(result[0].numberOfWorkouts);
        
        setCurrentWorkout({...currentWorkout, name: 'My Workout #' + result[0].numberOfWorkouts})
    }

    const loadExercises = async () => {
        console.log('in load exercises');
        
        const result = await db.getAllAsync("SELECT * FROM exercises ORDER BY name");
        // console.log(result);

        setExerciseList(result);
        setExerciseListFiltered(result);
        
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
        console.log('Selected: ' + exercise.name + 'id: ' + exercise.id);

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

        //sets exercise selection modal to no searchquery and the full list of exercises
        setSearchQuery('');
        setExerciseListFiltered(exerciseList)

        // setCurrentSet((prevData) => ({...prevData, exerciseId: exercise.id}))


        setModalVisible(!modalVisible)
    }

    const handleCompletedSet = () => {


        Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light)

        console.log('set that was completed: ' + currentSet.weight, currentSet.reps);
        console.log('exercise id to add to: ' + currentExerciseId);

        let filteredWeight = 0;
        let filteredReps = 0;

        if (currentSet.weight !== '' || currentSet.reps !== '') {
            filteredWeight = currentSet.weight;
            filteredReps = currentSet.reps;
        }
        
        const setToAdd = {
            id: setTracker,
            exerciseId: currentExerciseId,
            weight: filteredWeight,
            reps: filteredReps
        }

        setExercises(prevItems => prevItems.map(item => item.id === setToAdd.exerciseId ? 
            {...item, sets: [...item.sets, setToAdd]} : item
        ))

        setVolumeTracker(prevVolume => prevVolume + (setToAdd.weight * setToAdd.reps))
        setSetTracker(prevSets => prevSets + 1);

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
                    <Text style={[styles.text, styles.gridItem]}>{index + 1}</Text>
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
                    <Pressable
                        // onPress={handleCompletedSet}
                        style={styles.griditemAdd}    
                        >
                        <Text style={styles.text}>
                            <FontAwesome name="check" size={24} color={theme.color} />
                        </Text>
                    </Pressable>
                </View>
    )

    const renderExercise = ({ item }) => (
            <View style={styles.exerciseCurrentContainer}>
                <View style={styles.exerciseNameContainer}>
                    <Text style={[styles.text, {fontSize: 24}]}>{item.name}</Text>
                </View>
                {exercises[0].id != '' ? (<View style={[styles.exerciseData, styles.bottomBorder]}>
                    <Text style={[styles.text, styles.gridItem]}>Set</Text>
                    {/* <ThemeText>Previous</ThemeText> */}
                    <Text style={[styles.text, styles.gridItem]}>Lbs</Text>
                    <Text style={[styles.text, styles.gridItem]}>Reps</Text>
                    <Text style={[styles.text, styles.griditemAdd]}>
                        <FontAwesome name="check" size={24} color={theme.color} />
                    </Text>
                </View>) : ('')}
                
                <Animated.FlatList 
                    data={item.sets}
                    renderItem={renderDataRow}
                    keyExtractor={data => data.id}
                    />


                {exercises[0].id === '' || item.id != currentExerciseId ? ('') : (
                    <View style={styles.exerciseData}>
                        <Text style={[styles.text, styles.gridItem]}>{item.sets.length + 1}</Text>
                        {/* <ThemeText>-</ThemeText> */}
                        <View style={styles.gridItem}>
                            <TextInput
                            style={[styles.input, styles.text, {fontSize: 16}]}
                            keyboardType="numeric" 
                            value={currentSet.weight}
                            onChangeText={(value) => {setCurrentSet((prevData) => ({...prevData, weight: value}))}}
                            placeholder='0'/>
                        </View>
                        <View style={styles.gridItem}>
                            <TextInput
                            style={[styles.input, styles.text, {fontSize: 16}]}
                            keyboardType="numeric"
                            value={currentSet.reps}
                            onChangeText={(value) => {setCurrentSet((prevData) => ({...prevData, reps: value}))}}
                            placeholder='0'/>
                        </View>

                        <TouchableOpacity
                            style={styles.griditemAdd}
                            onPress={handleCompletedSet}>
                            <Text style={styles.text}>
                                <FontAwesome name="check" size={24} color={theme.colorInactive} />
                            </Text>        
                        </TouchableOpacity>
                        
                        {/* <Pressable
                            style={styles.griditemAdd}
                            onPress={handleCompletedSet}>
                            
                        </Pressable> */}
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
                        minute: '2-digit',
                        second: '2-digit'
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

    const handleSearchFilter = (value) => {
        setSearchQuery(value);
        if (value.trim() === '') {
            setExerciseListFiltered(exerciseList); // Show all data if search is empty
            return;
        }

        const lowercasedQuery = value.toLowerCase();
        const newData = exerciseList.filter(item => {
            return item.name.toLowerCase().includes(lowercasedQuery)
        });

        setExerciseListFiltered(newData);
    }

    const handleNameChange = () => {
        console.log('changed name');
        
    }

    const handleCreatingNewExercise = async () => {
        const exerciseName = newExercise;
        console.log('exercise to add: ' + exerciseName);
        const result = await db.runAsync("INSERT INTO exercises (name) VALUES (?)", [newExercise]);

        console.log(result);

        loadExercises();
        
        
    }


  return (
    <SafeAreaView style={styles.container}>
        <View style={styles.headingContainer}>
            {/* <Text style={styles.text} onPress={handleNameChange}>{currentWorkout.name}</Text> */}
            <TextInput
                style={styles.text}
                onChangeText={(value) => {setCurrentWorkout((prevData) => ({...prevData, name: value}))}}
                value={currentWorkout.name}
                maxLength={30}    
                />
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
                <ThemeText>{volumeTracker}</ThemeText>
            </View>
            <View>
                <ThemeText>Sets</ThemeText>
                <ThemeText>{setTracker}</ThemeText>
            </View>
            <View>
                <ThemeText>Time</ThemeText>
                <ThemeText>{new Date(timer * 1000).toISOString().substring(14, 19)}</ThemeText>
            </View>
        </View>
        <KeyboardAvoidingView
                style={styles.exerciseContainer}
                // keyboardVerticalOffset={200}
                behavior={Platform.OS === 'ios' ? 'padding' : 'height'}>
            <View >
                
                    <Animated.FlatList 
                        data={exercises}
                        keyboardShouldPersistTaps='handled'
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
                            onPress={() => {
                                Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
                                setModalVisible(!modalVisible)}}>
                            <Text style={styles.text}>
                                <FontAwesome name="close" size={32} color={theme.color} />
                            </Text>
                        </Pressable>    
                        <Pressable
                            // style={[styles.button, styles.buttonClose]}
                            onPress={() => {
                                Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
                                setModalVisible(!modalVisible)
                                setNewExerciseModalVisible(!newExerciseModalVisible)}}>
                            <Text style={styles.text}>Add</Text>
                        </Pressable>
                    </View>
                    <View style={styles.modalSearchbar}>
                        <TextInput 
                            style={styles.searchInput}
                            value={searchQuery}
                            onChangeText={handleSearchFilter}
                            placeholder='search exercise'/>
                    </View>

                    <Animated.FlatList 
                        data={exerciseListFiltered}
                        renderItem={renderExerciseList}
                        keyExtractor={data => data.id}/>
                    
                </View>
            </View>
          </Modal>

          <Modal
            animationType="slide"
            transparent={true}
            visible={newExerciseModalVisible}
            onRequestClose={() => {
                Alert.alert('Modal has been closed.');
                setModalVisible(!newExerciseModalVisible);
            }}>
                <View style={styles.centeredView}>
                    <View style={styles.modalView}>
                        <View style={styles.modalButtons}>
                        <Pressable
                            // style={[styles.button, styles.buttonClose]}
                            onPress={() => {
                                Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
                                setNewExerciseModalVisible(!newExerciseModalVisible)
                                setModalVisible(!modalVisible)}}>
                            <Text style={styles.text}>
                                <FontAwesome name="close" size={32} color={theme.color} />
                            </Text>
                        </Pressable>    
                        <Pressable
                            // style={[styles.button, styles.buttonClose]}
                            onPress={() => {
                                Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
                                handleCreatingNewExercise()
                                setNewExerciseModalVisible(!newExerciseModalVisible)
                                setModalVisible(!modalVisible)
                                }}>
                            <Text style={styles.text}>Add</Text>
                        </Pressable>
                    </View>
                        <TextInput
                            style={[styles.newExerciseInput, styles.text, {fontSize: 16}]}
                            value={newExercise}
                            placeholder="Enter new exercise name."
                            onChangeText={(value) => setNewExercise(value)}/>
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
      color: theme.text,
      fontSize: 18
    },
    input: {
        height: 40,
        borderColor: 'gray',
        borderWidth: 1,
        paddingHorizontal: 10,
        width: '45%'
    },
    newExerciseInput: {
        height: 40,
        borderColor: 'gray',
        borderWidth: 1,
        paddingHorizontal: 10,
        width: '100%'
    },
  searchInput: {
    color: theme.text,
    height: 40,
    borderColor: 'gray',
    borderWidth: 1,
    paddingHorizontal: 10
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
    bottomBorder: {
        borderBottomColor: 'gray',
        borderBottomWidth: 1
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
    exerciseNameContainer: {
        marginBottom: 10
    },
    exerciseData: {
        flexDirection: 'row',
        marginVertical: 7,
        paddingBottom: 5
        // justifyContent: 'space-between',
    },
    centeredView: {
      flex: 1,
      justifyContent: 'flex-end',
      alignItems: 'center',
    },
    gridItem: {
        flex: 1
    },
    griditemAdd: {
        flex: 0,
        alignItems: 'flex-end'
    },
    modalButtons: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        padding: 5,
        alignItems: 'center',
        marginBottom: 7
    },
    modalSearchbar: {
        marginBottom: 10
    },

    modalView: {
      margin: 20,
      width: '95%',
      height: '90%',
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

// const filterSets = (allSets, targetId) => {
//     return currentSet.filter(set => set.exerciseId == currentSet.exerciseId)
// }

export default start_workout