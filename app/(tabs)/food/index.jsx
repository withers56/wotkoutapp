import { Text, View, TextInput, Pressable, StyleSheet, FlatList, Button, Platform, Animated, ScrollView, TouchableOpacity } from 'react-native'
import { React, useState, useContext, useEffect, useCallback} from 'react'
import { SafeAreaView } from "react-native-safe-area-context";
import { ThemeContext } from "@/context/ThemeContext";
import DateTimePicker from '@react-native-community/datetimepicker';
import FontAwesome5 from '@expo/vector-icons/FontAwesome5';
import { useFocusEffect, useLocalSearchParams, useRouter } from 'expo-router';
import { useSQLiteContext } from 'expo-sqlite';
import { Swipeable } from 'react-native-gesture-handler';
import { PieChart } from "react-native-gifted-charts";



// import { Collapsible } from '@/components/Collapsible';
// import { ExternalLink } from '@/components/ExternalLink';
// import ParallaxScrollView from '@/components/ParallaxScrollView';
// import { ThemedText } from '@/components/ThemedText';
// import { ThemedView } from '@/components/ThemedView';
// import { IconSymbol } from '@/components/ui/IconSymbol';

export default function TabTwoScreen() {
  const {colorScheme, setColorScheme, theme} = useContext(ThemeContext)
  const styles = createStyles(theme, colorScheme)
  const [date, setDate] = useState(new Date());
  const [show, setShow] = useState(false);
  const [isEmpty, setIsEmpty] = useState(true);
  const [calories, setCalories] = useState(0);
  const [protein, setProtein] = useState(0);
  const [carbs, setCarbs] = useState(0);
  const [fat, setFat] = useState(0);
  const [logId, setLogId] = useState();
  const [food, setFood] = useState([]);
  const router = useRouter();
  const db = useSQLiteContext();

  const [pieData, setPieData] = useState([{value: 20}, {value: 40}, {value: 5}]);
  
 

//  useEffect(() =>{
//     //function to either create an empty lof entry, or if they have already logged for the day then fetch the data

//     fetchLogData()
//  }, [date])

 useFocusEffect(
      useCallback(() => {
        
        fetchLogData();
      }, [date])
  )


 const fetchLogData = async () => {
  console.log('in fetch food log');

  console.log(await db.getAllAsync('SELECT * FROM foods'));
  
  


  const result = await db.getAllAsync(
              `SELECT 
                L.id AS log_id, FLE.id AS entryId, L.log_date, F.name, FLE.num_servings, F.calories_per_serving, F.id AS food_id, F.protein_per_serving, F.fat_per_serving, F.carbs_per_serving
               FROM 
                 food_logs AS L 
               LEFT JOIN 
                 log_food_entries AS FLE ON L.id = FLE.log_id 
               LEFT JOIN 
                 foods AS F ON FLE.food_id = F.id WHERE log_date = '${date.toISOString().split('T')[0]}'`)

  console.log(result);

  if(result.length === 0){
    console.log('should be empty');
    
    const result = await db.runAsync('INSERT INTO food_logs (log_date, notes) VALUES (?, ?)',
      [date.toISOString().split('T')[0], 'this is going to be the stuff that was inputed on ' + date.toISOString().split('T')[0]]
    )

    setLogId(result.lastInsertRowId);

    //could cause recursion, problems??
    fetchLogData();
  }


  if (result.length > 0) {
    setIsEmpty(true)
    console.log('there is a log');
    // console.log(result);
    
    let calorieCounter = 0;
    let proteinCounter = 0;
    let carbCounter = 0;
    let fatCounter = 0;
    
    setLogId(result[0].log_id)
    setFood(result)

    result.forEach(item => {
      console.log(item);
      calorieCounter = calorieCounter + Number((item.num_servings * item.calories_per_serving))
      proteinCounter = proteinCounter + Number((item.num_servings * item.protein_per_serving))
      carbCounter = carbCounter + Number((item.num_servings * item.carbs_per_serving))
      fatCounter = fatCounter + Number((item.num_servings * item.fat_per_serving))
    })
    console.log(result[0].entryId);
    

    if (result[0].entryId != null) {
      console.log('entries, set to view');
      
      setIsEmpty(false);
    }
    setCalories(calorieCounter.toFixed());
    setProtein(proteinCounter.toFixed(1));
    setCarbs(carbCounter.toFixed(1));
    setFat(fatCounter.toFixed(1));

    // percentageCalc(calorieCounter.toFixed(), (proteinCounter.toFixed(1) * 4))
    

    setPieData([
      {value: Number(proteinCounter.toFixed(1)), text: percentageCalc(calorieCounter, (proteinCounter * 4)) + '%', color: '#d24b62'}, 
      {value: Number(carbCounter.toFixed(1)), text: percentageCalc(calorieCounter, (carbCounter * 4)) + '%', color: '#3d98c1'}, 
      {value: Number(fatCounter.toFixed(1)), text: percentageCalc(calorieCounter, (fatCounter * 9)) + '%', color: '#85b063'}
    ])

  }
 }
  
 const percentageCalc = (totalCals, partialCals) => {
  console.log(((partialCals / totalCals) * 100));
  
    return ((partialCals / totalCals) * 100).toFixed()
 }

  const onChange = (event, selectedDate) => {
        const currentDate = selectedDate || date;
        setDate(currentDate);
        setShow(false);
  };
  

  const handleBack = () => {
    console.log('clicked back');
    setDate(new Date(date.setDate(date.getDate() - 1)));
    setShow(false)
    setFood([]);
  }

  const handleForward = () => {
    console.log('clicked forward');
    setDate(new Date(date.setDate(date.getDate() + 1)));
    setShow(false)
    setFood([]);
  }

  const handleDatePick = () => {
    console.log(show);
    
    console.log('handle date selection');

    handleCalendarToggle()
    
  }

  const handleCalendarToggle = () => {
    setShow(!show);
  }

  const handleAddFood = () => {
    console.log('clicked add food');
    // router.navigate('/food/food_list')

    router.push({
      pathname: '/food/food_list',
      params: { log_Id: logId, date: date},
    });
  }
  const handleDelete = async (id) => {
      try {
        await db.runAsync("DELETE FROM log_food_entries WHERE id = ?;", [id]);
        fetchLogData();
      } catch (e) {
        console.error(e);
      }
    }

  const renderSwipeRightActions = (id) => {
      return (
        <TouchableOpacity
          style={{
            backgroundColor: theme.danger,
            borderBottomColor: 'gray',
            borderBottomWidth: 1,
            flexDirection: 'row',
            alignItems:'center',
            paddingHorizontal: 5
            
          }}
          onPress={() => handleDelete(id)}>
          <Text>DELETE</Text>
        </TouchableOpacity>
      )

    }

      const handleItemPress = (entryId, foodId, logId, servings) => {
        console.log('clicked entry with entryid: ' + entryId);
        console.log('clicked entry with foodid: ' + foodId);
        console.log('clicked entry with logid: ' + logId);

        router.push({
          pathname: '/food/log_food',
          params: { log_id: logId, food_id: foodId, entry_id: entryId, prevServings: servings},
        });    
        
      } 

  const renderFoodList = ({ item }) => {
    return (
      <Swipeable
        renderRightActions={() => renderSwipeRightActions(item.entryId)}>
        <TouchableOpacity
          onPress={() => handleItemPress(item.entryId, item.food_id, item.log_id, item.num_servings)}>
          
            <View style={styles.workoutItem}>    
              <View>
                <Text style={styles.workoutText}>{item.name}</Text>
              </View>
              <View>
                <Text style={styles.workoutText}>{ Number((item.num_servings * item.calories_per_serving).toFixed())} cal</Text>
              </View>    
            </View>
        </TouchableOpacity>
      </Swipeable>
  )}

  const renderFooter = () => (
    <View style={styles.footer}>
      <Text style={styles.text}>Total Calories: </Text>
    </View>
  )

  const renderDot = color => {
  return (
        <View
          style={{
            height: 10,
            width: 10,
            borderRadius: 5,
            backgroundColor: color,
            marginRight: 10,
          }}
        />
      );
  };
  

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.dateContainer}>
        <Pressable
          style={styles.dateContainerButtons}
          onPress={handleBack}>
            <FontAwesome5 name="less-than" size={20} color={theme.color} />
        </Pressable>  
        <Pressable
          style={[styles.dateContainerButtons, {width: '65%'}]}
          onPress={handleDatePick}>
                  <Text style={[styles.text, styles.dateText, {textAlign: 'center'}]}>{date.toLocaleDateString('en-US', {
                        year: 'numeric',
                        month: 'long',
                        day: 'numeric'    
                    })}</Text>
        </Pressable>
        <Pressable
          style={styles.dateContainerButtons}
          onPress={handleForward}>
            <FontAwesome5 name="greater-than" size={20} color={theme.color} />
        </Pressable>
      </View>

      <View style={styles.calendarContainer}>
        {show && (
            <DateTimePicker
              testID="dateTimePicker"
              value={date}
              mode='date'
              is24Hour={true}
              display="inline" // or 'spinner', 'inline' (iOS 14+)
              onChange={onChange}
            />
          )}

      </View>
      <View style={styles.addFoodContainer}>
        <Pressable
                  style={styles.startButton}
                  onPress={handleAddFood}>
                  <Text style={styles.buttonText}>Add Food</Text>    
        </Pressable>
      </View>
      {!isEmpty && (
      <View style={styles.foodEntryContainer}>
        
          <Animated.FlatList
            data={food}
            renderItem={renderFoodList}
            keyExtractor={data => data.entryId}
            // ListFooterComponent={renderFooter}
          />
          <View style={styles.footer}>
            <View style={{disply: 'flex',flexDirection: 'row', justifyContent:'space-evenly'}}>
              <View style={{width: '50%', alignItems: 'center'}}>
                <PieChart
                  fontWeight='bold' 
                  showText
                  textColor='black'
                  data={pieData}
                  radius={70}/>
              </View>
              <View style={{display: 'flex', flexDirection: 'column', justifyContent: 'space-evenly', width: '50%'}}>
                <View>
                  <Text style={styles.text}>{renderDot('#3d98c1')} C: ({carbs}g), {renderDot('#d24b62')} P: ({protein}g)</Text>
                </View>
                <View>
                  <Text style={styles.text}>{renderDot('#85b063')} F: ({fat}g), Calories: {calories}</Text>
                </View>  
              </View>  
            </View>
            
            {/* <Text style={[styles.text, {paddingHorizontal: 10, fontSize: 20}]}>Calories: {calories}, F: {fat}, C: {carbs}, P: {protein}</Text> */}
          </View>
      </View>)}
    </SafeAreaView>
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
    foodEntryContainer: {
      flex: 1
    },
    footer: {
    // Styling for your fixed footer
    height: '30%', // Example fixed height
    
    // display:'flex',
    // flexDirection: 'row',
    // justifyContent: 'flex-start',
    // alignItems: 'flex-start',
  },
  workoutItem: {
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
    workoutText: {
      // flex: 1,
      fontSize: 18,
      fontFamily: 'Inter_500Medium',
      color: theme.text,
    }
  })
}
