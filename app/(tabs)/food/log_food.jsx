/* eslint-disable react-hooks/rules-of-hooks */
import { Text, View, TextInput, Pressable, StyleSheet, FlatList, Button, Platform, TouchableOpacity, } from 'react-native'
import { React, useState, useContext, useEffect} from 'react'
import { SafeAreaView } from "react-native-safe-area-context";
import { ThemeContext } from "@/context/ThemeContext";
import { ScrollView } from 'react-native-gesture-handler';
import { useFocusEffect, useLocalSearchParams, useRouter } from 'expo-router';
import { useSQLiteContext } from 'expo-sqlite';
import { useNavigation } from '@react-navigation/native';
import AntDesign from '@expo/vector-icons/AntDesign';

const log_food = () => {
    const {colorScheme, setColorScheme, theme} = useContext(ThemeContext)
    const styles = createStyles(theme, colorScheme)
    const { log_id, food_id} = useLocalSearchParams();
    const router = useRouter();
    const db = useSQLiteContext();
    const navigation = useNavigation();

    const [foodItem, setFoodItem] = useState({});
    const [numOfServings, setNumOfServings] = useState(1);

    useEffect(() => {
        navigation.setOptions({
          headerRight: () => (
            <Pressable
              style={{padding: 5}}
              onPress={handleSubmit}
            >
              <AntDesign name="check" size={24} color={theme.text} />
            </Pressable>
          ),
        });
    }, [navigation, foodItem, numOfServings]);

    useEffect(() => {
      console.log('logId: ' + log_id + ' food ID: ' + food_id);
      
      loadFoodItem();
    }, [])

    const loadFoodItem = async () => {
      const result = await db.getFirstAsync(`SELECT * FROM foods WHERE id = ${food_id}`);

      console.log(result);

      setFoodItem(result);
    }

    const handleSubmit = async () => {
      console.log('clickjed submit')
      console.log('num servings: ' + numOfServings);

      console.log('food item: ' + foodItem);
      

      await db.runAsync(`INSERT INTO log_food_entries (log_id, food_id, num_servings) VALUES (?, ?, ?)`,
        [log_id, food_id, numOfServings]);

      router.back()
      router.back()
      
      
      
    }

    const calcualtedServing = () => {
      if (Object.keys(foodItem).length === 0) {
        console.log('there is no item');
        return;
      }

      return foodItem.serving_size.replace(/[^0-9]/g, '');
    }
  
    return (
          <ScrollView style={styles.container}>
            <View style={styles.weightItem}>
                <Text style={[styles.text, {fontSize: 24}]}>{foodItem.name}</Text>
            </View>
            <View style={styles.weightItem}>
                <Text style={styles.text}>Serving size</Text>
                <View style={{flexDirection: 'row', alignItems:'center'}}>
                  <Text style={styles.text}> {foodItem.serving_size}</Text>
                </View>  
            </View>
            <View style={styles.weightItem}>
                <Text style={styles.text}>Number of servings</Text>
                <View style={{flexDirection: 'row', alignItems:'center'}}>
                    <TextInput
                    style={[styles.text, styles.input, {textAlign: 'right'}]}
                    keyboardType='decimal-pad'
                    value={numOfServings}
                    onChangeText={value => setNumOfServings(value)}
                    placeholder={numOfServings + ''}/>
                    <Text style={styles.text}> Servings</Text>
                </View>  
            </View>
            <View style={styles.weightItem}>
                <Text style={styles.text}>Calories: {Number((numOfServings * foodItem.calories_per_serving).toFixed())}</Text>
                <Text style={styles.text}>Protein: {Number((numOfServings * foodItem.protein_per_serving).toFixed(1))}</Text>
                <Text style={styles.text}>Carbs: {Number((numOfServings * foodItem.carbs_per_serving).toFixed(1))}</Text>
                <Text style={styles.text}>Fat: {Number((numOfServings * foodItem.fat_per_serving).toFixed(1))}</Text>
            </View>
            {/* <View style={styles.weightItem}>
                <Text style={styles.text}>Date</Text>
                {(show && <DateTimePicker
                testID="dateTimePicker"
                value={date}
                mode="date" // or "time" or "datetime"
                is24Hour={true}
                display="default"
                onChange={onChange}
                />)}
        
            </View> */}
        </ScrollView>
    )
}

function createStyles(theme, colorScheme) {
  return StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: theme.background,
    },
    text: {
      color: theme.text
    },
    dateText: {
      fontSize: 24, width: '100%'
    },
    dateContainer: {
      display: 'flex',
      flexDirection: 'row',
      justifyContent: 'center',
      alignItems: 'center'
    },
    dateContainerButtons: {
      paddingHorizontal: 20
    },
    calendarContainer: {
      display:'flex',
      justifyContent: 'center',
      flexDirection: 'row'
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
    buttonText: {
      color: 'black',
      justifyContent: 'center',
      marginHorizontal: 'auto',
      fontSize: 28
    },
    addFoodContainer: {
      borderBottomColor: 'gray',
      borderBottomWidth: 1,
    },
    listItem: {
      flexDirection: 'row',
      // alignItems: 'center',
      justifyContent: 'space-between',
      // gap: 4,
      padding: 10,
      borderBottomColor: '#83838341',
      borderBottomWidth: 1,
      width: '100%',
      maxWidth: 1024,
      marginHorizontal: 'auto',
      pointerEvents: 'auto',
    },
    listText: {
      // flex: 1,
      fontSize: 18,
      fontFamily: 'Inter_500Medium',
      color: theme.text,
    },
    searchInput: {
    color: theme.text,
    height: 40,
    borderColor: 'gray',
    borderWidth: 1,
    paddingHorizontal: 10,
    marginHorizontal: 10
  },
  
    weightItem: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
      // gap: 4,
      padding: 15,
      borderBottomColor: 'gray',
      borderBottomWidth: 1,
      width: '100%',
      maxWidth: 1024,
      marginHorizontal: 'auto',
      pointerEvents: 'auto',
    },
    weightText: {
      // flex: 1,
      fontSize: 18,
      fontFamily: 'Inter_500Medium',
      color: theme.text,
    },
    input: {
      width: 100
    }
  })
}

export default log_food