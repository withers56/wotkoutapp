import { ThemeContext } from '@/context/ThemeContext';
import { useFocusEffect, useRouter } from 'expo-router';
import { useSQLiteContext } from 'expo-sqlite';
import { React, useCallback, useContext, useState } from 'react';
import { Dimensions, Pressable, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { LineChart } from "react-native-gifted-charts";
import Animated from 'react-native-reanimated';
import { SafeAreaView } from 'react-native-safe-area-context';


// import { Image } from 'expo-image';
// import { HelloWave } from '@/components/HelloWave';
// import ParallaxScrollView from '@/components/ParallaxScrollView';
// import { ThemedText } from '@/components/ThemedText';
// import { ThemedView } from '@/components/ThemedView';




export default function HomeScreen() {
  const {colorScheme, setColorScheme, theme} = useContext(ThemeContext)
  const styles = createStyles(theme, colorScheme)

  const [entries, setEntries] = useState([]);
  const [lineData, setLineData] = useState([]);
  const router = useRouter();

  const db = useSQLiteContext();

  const monthNames = ["January", "February", "March", "April", "May", "June",
  "July", "August", "September", "October", "November", "December"
];

  const data = [{value: 15}, {value: 30}, {value: 26}, {value: 40},{value: 15}, {value: 30}, {value: 26}, {value: 40},{value: 15}, {value: 30}, {value: 26}, {value: 40},{value: 15}, {value: 30}, {value: 26}, {value: 40}];


  // useEffect(() => {
  //   loadWeightHistory();
  // }, [])    

  useFocusEffect(
        useCallback(() => {
          loadWeightHistory();
        }, [])
      )

  const loadWeightHistory = async () => {
    let dataArray = [];
    // await db.runAsync('INSERT INTO weight (body_weight, unit_of_measure, date) VALUES (?,?,?)',
    //     [297.7, 'lbs', new Date() + '']);    
    const result = await db.getAllAsync('SELECT id, body_weight, unit_of_measure, date FROM weight ORDER BY date DESC');
    console.log(result);
   
    result.map(item => {
      console.log(item.body_weight);

      const date = new Date(item.date);

      const month = (date.getUTCMonth() + 1).toString().padStart(2, '0'); // Months are 0-based, so add 1
      const day = date.getUTCDate().toString().padStart(2, '0'); // Get day of the month

      const formattedDate = `${month}/${day}`;

      dataArray.unshift({value: item.body_weight, label: formattedDate})
    })
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
        loadWeightHistory()
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
                <Text style={styles.weightText}>{monthNames[new Date(item.date).getMonth()]} {new Date(item.date).getDate()}, {new Date(item.date).getFullYear()}</Text>
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
                  <LineChart
                    maxValue={400}
                    
                    width={Dimensions.get('window').width - 70}
                    rulesColor="gray"
                    rulesType="solid"
                    noOfSections={3}
                    xAxisColor={'grey'}
                    yAxisColor={'grey'}
                    yAxisTextStyle={{color: 'lightgray'}}
                    xAxisLabelTextStyle={{color: 'lightgray'}}
                    color1='grey'
                    color={'purple'}
                    thickness={3}
                    dataPointsColor={'red'}
                    data={lineData}/>;
                </View>
                <Animated.FlatList
                  data={entries}
                  renderItem={renderListItem}
                  keyExtractor={data => data.id} />
    
                
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
      backgroundColor: theme.background,
      paddingEnd: 10
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
    weightText: {
      // flex: 1,
      fontSize: 18,
      fontFamily: 'Inter_500Medium',
      color: theme.text,
    }
  })
}
