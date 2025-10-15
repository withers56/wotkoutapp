import { Text, View, TextInput, Pressable, StyleSheet, FlatList, Button, Platform, Animated, ScrollView, TouchableOpacity } from 'react-native'
import { React, useState, useContext, useEffect} from 'react'
import { SafeAreaView } from "react-native-safe-area-context";
import { ThemeContext } from "@/context/ThemeContext";
import DateTimePicker from '@react-native-community/datetimepicker';
import FontAwesome5 from '@expo/vector-icons/FontAwesome5';
import { useFocusEffect, useRouter } from 'expo-router';
import { useSQLiteContext } from 'expo-sqlite';


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
  const [calories, setCalories] = useState(0);
  const [food, setFood] = useState([
  { id: 1, name: 'Apple', calories: 52 },
  { id: 2, name: 'Banana', calories: 89 },
  { id: 3, name: 'Bread', calories: 265 },
  { id: 4, name: 'Rice', calories: 130 },
  { id: 5, name: 'Chicken Breast', calories: 165 },
  { id: 6, name: 'Egg', calories: 155 },
  { id: 7, name: 'Milk', calories: 42 },
  { id: 8, name: 'Potato', calories: 77 },
  { id: 9, name: 'Carrot', calories: 41 },
  { id: 10, name: 'Broccoli', calories: 34 },
  { id: 11, name: 'Tomato', calories: 18 },
  { id: 12, name: 'Orange', calories: 47 },
  { id: 13, name: 'Beef', calories: 250 },
  { id: 14, name: 'Cheese', calories: 402 },
  { id: 15, name: 'Butter', calories: 717 },
  { id: 16, name: 'Pasta', calories: 131 },
  { id: 17, name: 'Oats', calories: 389 },
  { id: 18, name: 'Yogurt', calories: 61 },
  { id: 19, name: 'Spinach', calories: 23 },
  { id: 20, name: 'Lettuce', calories: 15 },
  { id: 21, name: 'Strawberry', calories: 32 },
  { id: 22, name: 'Grapes', calories: 69 },
  { id: 23, name: 'Salmon', calories: 208 },
  { id: 24, name: 'Tuna', calories: 132 },
  { id: 25, name: 'Almonds', calories: 579 },
  { id: 26, name: 'Peanut Butter', calories: 588 },
  { id: 27, name: 'Avocado', calories: 160 },
  { id: 28, name: 'Onion', calories: 40 },
  { id: 29, name: 'Garlic', calories: 149 },
  { id: 30, name: 'Corn', calories: 86 },
  { id: 31, name: 'Beans', calories: 347 },
  { id: 32, name: 'Lentils', calories: 116 },
  { id: 33, name: 'Pork', calories: 242 },
  { id: 34, name: 'Lamb', calories: 294 },
  { id: 35, name: 'Turkey', calories: 135 },
  { id: 36, name: 'Shrimp', calories: 99 },
  { id: 37, name: 'Quinoa', calories: 120 },
  { id: 38, name: 'Barley', calories: 123 },
  { id: 39, name: 'Cucumber', calories: 16 },
  { id: 40, name: 'Bell Pepper', calories: 26 },
  { id: 41, name: 'Mushroom', calories: 22 },
  { id: 42, name: 'Zucchini', calories: 17 },
  { id: 43, name: 'Watermelon', calories: 30 },
  { id: 44, name: 'Pineapple', calories: 50 },
  { id: 45, name: 'Blueberry', calories: 57 },
  { id: 46, name: 'Pear', calories: 57 },
  { id: 47, name: 'Peach', calories: 39 },
  { id: 48, name: 'Olive Oil', calories: 884 },
  { id: 49, name: 'Honey', calories: 304 },
  { id: 50, name: 'Sugar', calories: 387 }
]);
  const router = useRouter();
  const db = useSQLiteContext();
  

 
  

  const onChange = (event, selectedDate) => {
        const currentDate = selectedDate || date;
        setDate(currentDate);
        setShow(false);
  };
  

  const handleBack = () => {
    console.log('clicked back');
    setDate(new Date(date.setDate(date.getDate() - 1)));
    setShow(false)
  }

  const handleForward = () => {
    console.log('clicked forward');
    setDate(new Date(date.setDate(date.getDate() + 1)));
    setShow(false)
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
    router.navigate('/food/log_food')
  }

  const renderFoodList = ({ item }) => (
      <TouchableOpacity>
        
              <View style={styles.workoutItem}>
               
                
                  <Text style={styles.workoutText}>{item.name}</Text>
                  <Text style={styles.workoutText}>{item.calories} cal</Text>
                  
                
                
              </View>
      </TouchableOpacity>
  )

  const renderFooter = () => (
    <View style={styles.footer}>
      <Text style={styles.text}>Total Calories: </Text>
    </View>
  )
  

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.dateContainer}>
        <Pressable
          style={styles.dateContainerButtons}
          onPress={handleBack}>
            <FontAwesome5 name="less-than" size={20} color={theme.color} />
        </Pressable>  
        <Pressable
          style={styles.dateContainerButtons}
          onPress={handleDatePick}>
                  <Text style={[styles.text, styles.dateText]}>{date.toLocaleDateString('en-US', {
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
      <View style={styles.foodEntryContainer}>
          <Animated.FlatList
            data={food}
            renderItem={renderFoodList}
            keyExtractor={data => data.id}
            // ListFooterComponent={renderFooter}
          />
          <View style={styles.footer}>
            <Text style={[styles.text, {paddingHorizontal: 10, fontSize: 20}]}>Total Calories: {calories}</Text>
          </View>
      </View>
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
    height: '12%', // Example fixed height
    display:'flex',
    flexDirection: 'row',
    justifyContent: 'flex-end',
    alignItems: 'flex-start',
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
