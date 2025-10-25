/* eslint-disable react-hooks/rules-of-hooks */
import { ThemeContext } from "@/context/ThemeContext";
import AntDesign from '@expo/vector-icons/AntDesign';
import { useNavigation } from '@react-navigation/native';
import { useLocalSearchParams, useRouter, useFocusEffect } from 'expo-router';
import { useSQLiteContext } from 'expo-sqlite';
import { React, useCallback, useContext, useEffect, useState } from 'react';
import { Animated, Pressable, SafeAreaView, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';



const log_food = () => {
    const {colorScheme, setColorScheme, theme} = useContext(ThemeContext)
    const styles = createStyles(theme, colorScheme)
    const [foodData, setFoodData] = useState([]);
    const [foodDataFiltered, setFoodDataFiltered] = useState([]);
    const [foodQuery, setFoodQuery] = useState('');
    const router = useRouter();
    const db = useSQLiteContext();
    const navigation = useNavigation();
    

    const { log_Id} = useLocalSearchParams();

    useEffect(() => {
        navigation.setOptions({
          headerRight: () => (
            <Pressable
              style={{padding: 5}}
              onPress={handleAddFood}
            >
              <AntDesign name="plus" size={24} color={theme.text} />
            </Pressable>
          ),
        });
    }, [navigation]);

    useFocusEffect(
          useCallback(() => {
            
            loadFoods();
            console.log(log_Id);
          }, [])
      )

    const loadFoods = async () => {
      console.log('in load foods');

      const result = await db.getAllAsync("SELECT * FROM foods ORDER BY name");

      setFoodData(result);
      setFoodDataFiltered(result);
    }

    const handleAddFood = () => {
      console.log('clicked add')

      router.push('/food/add_food');
    }

    const handleFoodPress = (id) => {
      console.log('clicked food with id: ' + id);

      //update tiems_selected column0.

      //route to log food folder

      // router.push(`/food/log_food`)

      router.push({
        pathname: '/food/log_food',
        params: { log_id: log_Id, food_id: id}
      })
      
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
    <SafeAreaView style={styles.container}>
        <TextInput 
          style={styles.searchInput}
          placeholder='search food'
          value={foodQuery}
          onChangeText={handleSearchFilter}/>
        <Animated.FlatList 
          style={{marginBottom: 50}}
          data={foodDataFiltered}
          renderItem={renderFoods}
          keyExtractor={data => data.id}/>
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