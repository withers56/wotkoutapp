import { ThemeContext } from '@/context/ThemeContext';
import { useFocusEffect, useRouter } from 'expo-router';
import { useSQLiteContext } from 'expo-sqlite';
import { React, useCallback, useContext, useState, useEffect } from 'react';
import { Dimensions, Pressable, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { LineChart } from "react-native-gifted-charts";
import { MaterialIcons } from '@expo/vector-icons';
import Animated from 'react-native-reanimated';
import { SafeAreaView, useSafeAreaInsets } from 'react-native-safe-area-context';
import { getMaxWeight, getMinWeight, getWeightByFilter, getAllWeight } from '@/db/dbstatments';
import { formatDateRangeFromToday } from '@/constants/util';


// import { Image } from 'expo-image';
// import { HelloWave } from '@/components/HelloWave';
// import ParallaxScrollView from '@/components/ParallaxScrollView';
// import { ThemedText } from '@/components/ThemedText';
// import { ThemedView } from '@/components/ThemedView';




export default function HomeScreen() {
  const {colorScheme, setColorScheme, theme} = useContext(ThemeContext)
  const styles = createStyles(theme, colorScheme)

  const [maxWeight, setMaxWeight] = useState(500);
  const [minWeight, setMinWeight] = useState(100);
  const [entries, setEntries] = useState([]);
  const [lineData, setLineData] = useState([]);
  const [showTimeFilter, setShowTimeFilter] = useState(false);
  const [timeFilter, setTimeFilter] = useState('ALL'); // UI-only selected range: '1M','3M','6M','1Y','ALL'
  const router = useRouter();

  const insets = useSafeAreaInsets();
  const db = useSQLiteContext();

  const monthNames = ["January", "February", "March", "April", "May", "June",
  "July", "August", "September", "October", "November", "December"
];

  const data = [{value: 15}, {value: 30}, {value: 26}, {value: 40},{value: 15}, {value: 30}, {value: 26}, {value: 40},{value: 15}, {value: 30}, {value: 26}, {value: 40},{value: 15}, {value: 30}, {value: 26}, {value: 40}];


  // useEffect(() => {
  //   loadWeightHistory(timeFilter);
  // }, [])    

  useFocusEffect(
        useCallback(() => {
          setTimeFilter('ALL');
          loadWeightHistory(timeFilter);
        }, [])
      )

  const loadWeightHistory = async (filter) => {
    let dataArray = [];
    let result = [];

    if (filter === 'ALL') {
      result = await db.getAllAsync(getAllWeight());
      console.log('in if');
      
    } else {
      result = await db.getAllAsync(getWeightByFilter(formatDateRangeFromToday(filter)));
      console.log('in else');
    
    }

    // const result = await db.getAllAsync(getWeightByFilter(formatDateRangeFromToday(filter)));
    console.log(result);

    // const test = await db.getAllAsync(getWeightByFilter(formatDateRangeFromToday(filter)));

    // console.log(test);
    
    console.log(formatDateRangeFromToday(filter));
    
   
    result.map(item => {
      // console.log(item.body_weight);

      const date = new Date(item.date);

      const month = (date.getUTCMonth() + 1).toString().padStart(2, '0'); // Months are 0-based, so add 1
      const day = date.getUTCDate().toString().padStart(2, '0'); // Get day of the month

      const formattedDate = `${month}/${day}`;

      dataArray.unshift({value: Math.round(item.body_weight), label: formattedDate})
    })
    // console.log('Data array: ' + dataArray[0].value);
    const maxWeightResult = await db.getFirstAsync(getMaxWeight());
    const minWeightResult = await db.getFirstAsync(getMinWeight());
    
    
    
    setMaxWeight(maxWeightResult.max_weight);
    setMinWeight(minWeightResult.min_weight);
    setLineData(dataArray);
    setEntries(result);
  }

  const handleSubmit = () => {
    console.log('clicked submit'); 
    router.navigate('/weight/log_weight')
  }

  const handleDelete = async (id) => {
      try {
        await db.runAsync("DELETE FROM weight WHERE id = ?;", [id]);
        loadWeightHistory(timeFilter)
      } catch (e) {
        console.error(e);
      }
    }
    

  const renderListItem = ({ item }) => (
        
          <TouchableOpacity
            // onPress={() => {handleWorkoutPress(item.id)}}
            >
            <View style={styles.weightItem}>
              <View>
                <Text style={styles.weightTitleText}>{monthNames[new Date(item.date).getMonth()]} {new Date(item.date).getDate()}, {new Date(item.date).getFullYear()}</Text>
                <Text style={styles.weightText}>{item.body_weight} {item.unit_of_measure}</Text>
              </View>
              <View>
                <Pressable 
                  style={styles.button}
                  onPress={() => {handleDelete(item.id)}}>
                  <Text>Delete</Text>
                </Pressable>  
              </View>
            </View>
          </TouchableOpacity>
       
  
      )

  return (

    <SafeAreaView style={styles.container}>
                <View>
                    <Pressable
                      style={styles.startButton}
                      onPress={handleSubmit}>
                      <Text style={styles.buttonText}>Enter Weight</Text>    
                    </Pressable>
                    
                </View>
                <View style={styles.chartContainer}>
                  <View style={styles.filterContainer}>
                    <Pressable
                      style={styles.filterButton}
                      onPress={() => setShowTimeFilter(prev => !prev)}
                      hitSlop={8}
                      accessibilityLabel="Open time filter"
                      >
                      <Text style={styles.text}>{timeFilter === 'ALL' ? 'All' : timeFilter}</Text>
                      <MaterialIcons name="filter-list" size={22} color={theme.text} />
                    </Pressable>
                 {showTimeFilter && (
                    <View style={styles.filterMenu}>
                      {[
                        { key: '1M', label: '1 Month' },
                        { key: '3M', label: '3 Months' },
                        { key: '6M', label: '6 Months' },
                        { key: '1Y', label: '1 Year' },
                        { key: 'ALL', label: 'All' },
                      ].map(opt => (
                        <TouchableOpacity
                          key={opt.key}
                          style={styles.filterOption}
                          onPress={() => {
                            setTimeFilter(opt.key);
                            setShowTimeFilter(false);
                            loadWeightHistory(opt.key);
                            console.log('Selected time filter:', opt.key); // replace with your DB loader
                          }}
                        >
                          <Text style={styles.text}>{opt.label}</Text>
                        </TouchableOpacity>
                      ))}
                    </View>
                 )}
               </View>
                  <Text>
                    <LineChart
                      maxValue={maxWeight - minWeight + 50}
                      yAxisOffset={minWeight - 25}
                      formatYLabel={(value) => `${Math.round(value)}`} //make y axis values whole numbers
                      width={Dimensions.get('window').width - 70}
                      // disableScroll={true}
                      // spacing={20}
                      rulesColor="gray"
                      rulesType="solid"
                      noOfSections={2}
                      xAxisColor={'grey'}
                      yAxisColor={'grey'}
                      yAxisTextStyle={{color: 'lightgray'}}
                      xAxisLabelTextStyle={{color: 'lightgray'}}
                      color1='grey'
                      color={'purple'}
                      thickness={3}
                      dataPointsColor={'red'}
                      data={lineData}/>
                  </Text>    
                </View>
              
                <Animated.FlatList
                  data={entries}
                  renderItem={renderListItem}
                  keyExtractor={data => data.id} 
                  contentContainerStyle={{ paddingBottom: insets.bottom + 64 }}
/>
    
                
            </SafeAreaView>

  );
}

function createStyles(theme, colorScheme) {
  return StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: theme.background,
      color: 'white'
    },
    chartContainer: {
      // width: '100%',
      backgroundColor: theme.background,
      // paddingEnd: 10
    },
    text: {
      color: theme.text
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
    weightTitleText: {
      // flex: 1,
      fontSize: 18,
      fontFamily: 'Inter_500Medium',
      color: theme.text,
    },
    weightText: {
      // flex: 1,
      fontSize: 14,
      fontFamily: 'Inter_500Medium',
      color: theme.text,
    },





    filterContainer: {
     width: '100%',
     maxWidth: 1024,
     marginHorizontal: 'auto',
     alignItems: 'flex-end',
     paddingHorizontal: 20,
     position: 'relative',
   },
   filterButton: {
     padding: 8,
     borderRadius: 8,
     backgroundColor: 'transparent',
     alignItems: 'center',
     justifyContent: 'center',
   },
   filterMenu: {
     position: 'absolute',
     top: 44,
     right: 20,
     backgroundColor: theme.background,
     borderRadius: 8,
     paddingVertical: 6,
     paddingHorizontal: 8,
     shadowColor: '#000',
     shadowOffset: { width: 0, height: 2 },
     shadowOpacity: 0.15,
     shadowRadius: 4,
     elevation: 5,
     zIndex: 50,
  },
   filterOption: {
     paddingVertical: 8,
     paddingHorizontal: 12,
     minWidth: 120,
   },
  })
}
