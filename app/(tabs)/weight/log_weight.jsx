/* eslint-disable react-hooks/rules-of-hooks */
import { ThemeProvider, ThemeContext } from '@/context/ThemeContext';
import { SafeAreaView } from 'react-native-safe-area-context';
import { React, useState, useContext, useEffect, useCallback} from 'react'
import { Text, View, TextInput, Pressable, StyleSheet, FlatList, TouchableOpacity, Button, Platform } from 'react-native'
import { useSQLiteContext } from 'expo-sqlite';
import { useFocusEffect, useRouter } from 'expo-router';
import Animated from 'react-native-reanimated';
import DateTimePicker from '@react-native-community/datetimepicker';

const log_weight = () => {
    const [currentWeight, setCurrentWeight] = useState(0);
    const [date, setDate] = useState(new Date());
    const [show, setShow] = useState(true);
    const {colorScheme, setColorScheme, theme} = useContext(ThemeContext)
    const styles = createStyles(theme, colorScheme)

    const onChange = (event, selectedDate) => {
    const currentDate = selectedDate || date;
    console.log(Platform.OS);
    
    setShow(Platform.OS === 'ios'); // Hide picker on iOS after selection
    setDate(currentDate);
  };

  

  return (
    <View style={styles.container}>
        <View style={styles.weightItem}>
            <Text style={styles.text}>Log Weight</Text>
            <View style={{flexDirection: 'row', alignItems:'center'}}>
                <TextInput
                keyboardType='numeric'
                value={currentWeight}
                onChangeText={(value) => {setCurrentWeight(value)}}
                placeholder='0'/>
                <Text style={styles.text}> Lbs</Text>
            </View>
            
        </View>
        <View style={styles.weightItem}>
            <Text style={styles.text}>Date</Text>
            {(show && <DateTimePicker
            testID="dateTimePicker"
            value={date}
            mode="date" // or "time" or "datetime"
            is24Hour={true}
            display="default"
            onChange={onChange}
            />)}
    
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
    }
  })
}

export default log_weight