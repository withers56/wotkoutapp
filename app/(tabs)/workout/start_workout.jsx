import { ThemeContext } from "@/context/ThemeContext";
import { useContext, useEffect, useState } from 'react';
import { Alert, Modal, Pressable, SafeAreaView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import Animated from 'react-native-reanimated';
import ThemeText from "../../../context/ThemeText";

import { useRouter } from 'expo-router';
import { useSQLiteContext } from 'expo-sqlite';


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
    const [exercises, setExercises] = useState([]);
    const [exerciseList, setExerciseList] = useState([]);
    const [selectedExercise, setSelectedExercise] = useState({});

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
        console.log(result);

        setExerciseList(result)
        
    }

    const handleSubmit = () => {
        console.log('clicked add exercise');

        exerciseList.forEach(item => {
            console.log(item.name);
            
        })

        setModalVisible(true)
        
    }

    const handleCancel = () => {
        console.log('cancel');
        router.back()
    }   

    const handleExerciseSelection = (exercise) => {
        console.log('Selected: ' + exercise.name);

        setSelectedExercise(exercise);

        setExercises([...exercises, {id: exercise.id, name: exercise.name}])


        setModalVisible(!modalVisible)
    }

    const renderItem = ({ item }) => (
        <TouchableOpacity onPress={() => handleExerciseSelection(item)}>
            <View style={styles.exerciseItem}>
                <ThemeText>{item.name}</ThemeText>
            </View>
        </TouchableOpacity>
    )


  return (
    <SafeAreaView style={styles.container}>
        <View style={styles.headingContainer}>
            <ThemeText style={styles.text}>{currentWorkout.name}</ThemeText>
            {/* <ThemeText style={styles.text}>{currentWorkout.start_time}</ThemeText> */}
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
        <View style={styles.exerciseContainer}>
            <Animated.FlatList 
                data={exercises}
                renderItem={renderItem}
                keyExtractor={data => data.id}/>

            <View>
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
            </View>
        </View>

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
                        renderItem={renderItem}
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
    headingContainer: {
        padding: 10,
        width: '100%',
        maxWidth: 1024,
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
        height: '77.5%'
    },
    addButton: {
      marginHorizontal: 'auto',
      height: 45,
      width: 200,
      borderRadius: 20,
      justifyContent: 'center',
      backgroundColor: theme.tabIconSelected,
      padding: 6,
      marginBottom: 15,
      marginTop: 15
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

export default start_workout