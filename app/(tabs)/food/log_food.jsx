/* eslint-disable react-hooks/rules-of-hooks */
import { Text, View, TextInput, Pressable, StyleSheet, FlatList, Button, Platform, TouchableOpacity, } from 'react-native'
import { React, useState, useContext, useEffect} from 'react'
import { SafeAreaView } from "react-native-safe-area-context";
import { ThemeContext } from "@/context/ThemeContext";
import { ScrollView } from 'react-native-gesture-handler';
import { useFocusEffect, useRouter } from 'expo-router';
import { useSQLiteContext } from 'expo-sqlite';

const log_food = () => {
    const {colorScheme, setColorScheme, theme} = useContext(ThemeContext)
    const styles = createStyles(theme, colorScheme)
    const [foodData, setFoodData] = useState([]);
    const [foodDataFiltered, setFoodDataFiltered] = useState([]);
    const [foodQuery, setFoodQuery] = useState('');
    const router = useRouter();
    const db = useSQLiteContext();

    useEffect(() => {
      loadFoods();
    }, [])

    const loadFoods = async () => {
      console.log('in load foods');

      const result = await db.getAllAsync("SELECT * FROM foods ORDER BY name");

      setFoodData(result);
      setFoodDataFiltered(result);
    }

    const handleFoodPress = (id) => {
      console.log('clicked food with id: ' + id);
      
    }

    const renderFoods = ({item}) => (
      <TouchableOpacity
        onPress={() => {handleFoodPress(item.id)}}>     
        <View style={styles.listItem}>              
          <Text style={styles.listText}>{item.name}</Text>            
        </View>
      </TouchableOpacity>
    )

    const handleSearchFilter = (value) => {
        setFoodQuery(value);
        if (value.trim() === '') {
            setFoodDataFiltered(foodData); // Show all data if search is empty
            return;
        }

        const lowercasedQuery = value.toLowerCase();
        const newData = foodData.filter(item => {
            return item.name.toLowerCase().includes(lowercasedQuery)
        });

        setFoodDataFiltered(newData);
    }
  
    return (
    <View style={styles.container}>
        

        <TextInput 
          style={styles.searchInput}
          placeholder='search food'
          value={foodQuery}
          onChangeText={handleSearchFilter}/>

        <Text style={styles.text}>{foodQuery}</Text>
        <FlatList 
          // style={{marginBottom: 80}}
          data={foodDataFiltered}
          renderItem={renderFoods}
          keyExtractor={data => data.id}/>
    </View>
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
  })
}

export default log_food