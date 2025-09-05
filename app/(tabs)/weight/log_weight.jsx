/* eslint-disable react-hooks/rules-of-hooks */
import { ThemeContext } from '@/context/ThemeContext';
import AntDesign from '@expo/vector-icons/AntDesign';
import DateTimePicker from '@react-native-community/datetimepicker';
import { useNavigation } from '@react-navigation/native';
import * as Haptics from 'expo-haptics';
import { useRouter } from 'expo-router';
import { useSQLiteContext } from 'expo-sqlite';

import { React, useContext, useEffect, useState } from 'react';
import { Platform, Pressable, ScrollView, StyleSheet, Text, TextInput, View } from 'react-native';


const log_weight = () => {
    const [count, setCount] = useState(0);
    const [currentWeight, setCurrentWeight] = useState(0.0);
    const [date, setDate] = useState(new Date());
    const [show, setShow] = useState(true);
    const [uoa, setUOA] = useState('Lbs');
    const [recentWeight, setRecentWeight] = useState(0);
    const {colorScheme, setColorScheme, theme} = useContext(ThemeContext)
    const styles = createStyles(theme, colorScheme);
    const db = useSQLiteContext();
    const navigation = useNavigation();
    const router = useRouter();

    const onChange = (event, selectedDate) => {
      const currentDate = selectedDate
      console.log(new Date(selectedDate));
      
      console.log(Platform.OS);
      
      setShow(Platform.OS === 'ios'); // Hide picker on iOS after selection
      setDate(selectedDate);
    };

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
          headerLeft: () => (
            <Pressable
              style={{padding: 5}}
              onPress={() => {
                Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium)              
                router.back()
              }}
            >
              <AntDesign name="close" size={24} color={theme.text} />
            </Pressable>
          ),
        });
    }, [navigation, currentWeight, uoa, date]); 

    useEffect(()=>{
      loadData()
    }, []);

  const loadData = async () => {
    console.log('in loadData');
    
    const result = await db.getFirstAsync('SELECT body_weight, unit_of_measure FROM weight ORDER BY date DESC LIMIT 1');

    console.log(result);

    setRecentWeight(result.body_weight);
    setUOA(result.unit_of_measure);
  }

  const handleSubmit = async () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium)              
    console.log('submit workout');
    // console.log(date);
        
    const weightToSubmit = {
      body_weight: currentWeight,
      unit_of_measure: uoa,
      date: date.toISOString()
    }

    console.log(weightToSubmit);
    

    await db.runAsync('INSERT INTO weight (body_weight, unit_of_measure, date) VALUES (?, ?, ?)',
                [weightToSubmit.body_weight, weightToSubmit.unit_of_measure, weightToSubmit.date]
    )
      
    router.back();
  }

  return (
    <ScrollView style={styles.container}>
        <View style={styles.weightItem}>
            <Text style={styles.text}>Log Weight</Text>
            <View style={{flexDirection: 'row', alignItems:'center'}}>
                <TextInput
                style={[styles.text, styles.input, {textAlign: 'right'}]}
                keyboardType='decimal-pad'
                value={currentWeight}
                onChangeText={value => setCurrentWeight(Math.round(value * 10) / 10 )}
                placeholder={recentWeight + ''}/>
                <Text style={styles.text}> {uoa}</Text>
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
    </ScrollView>
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
    input: {
      width: 100
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