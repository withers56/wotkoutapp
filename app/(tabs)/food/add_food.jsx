/* eslint-disable react-hooks/rules-of-hooks */
import { ThemeContext } from "@/context/ThemeContext";
import { Picker } from '@react-native-picker/picker';
import { useNavigation } from '@react-navigation/native';
import { useRouter } from 'expo-router';
import { useSQLiteContext } from 'expo-sqlite';
import { React, useContext, useRef, useState, useEffect } from 'react';
import { ScrollView, StyleSheet, Text, TextInput, View, KeyboardAvoidingView, Platform, Pressable } from 'react-native';
import AntDesign from '@expo/vector-icons/AntDesign';




const add_food = () => {
    const {colorScheme, setColorScheme, theme} = useContext(ThemeContext)
    const styles = createStyles(theme, colorScheme)
    const router = useRouter();
    const db = useSQLiteContext();
    const navigation = useNavigation();
    
    const [name, setName] = useState('');
    const [weight, setWeight] = useState(0);
    const [volume, setVolume] = useState('');
    const [protein, setProtein] = useState(0);
    const [carbs, setCarbs] = useState(0);
    const [fats, setFats] = useState(0);
    const [calories, setCalories] = useState((fats * 9) + (protein * 4) + (carbs * 4))
    const [servingUOM, setServingUOM] = useState([])
    const [selectedMeasurement, setSelectedMeasurement] = useState('g');
    const [selectedLanguage, setSelectedLanguage] = useState();


    const [selectedValue, setSelectedValue] = useState('opt1');

    const pickerRef = useRef();

    useEffect(() => {
        navigation.setOptions({
          headerRight: () => (
            <Pressable
              style={{padding: 5}}
              onPress={handleCreateFood}
            >
              <AntDesign name="check" size={24} color={theme.text} />
            </Pressable>
          ),
        });
    }, [navigation, name, protein, carbs, fats, volume, selectedMeasurement, weight]);

    const handleCreateFood = async () => {
      console.log('clicked creat food');
      console.log(protein);
      console.log('(' + weight + selectedMeasurement + ')');
      

      if(weight === 0) {
        console.log('weight req');
        return
        
      }
      if(name === '') {
        console.log('name req');
        return
        
      }
      if(volume === '') {
        console.log('serving size req req');
        return
        
      }

      

      const item = {
        'name': name,
        calories_per_serving: (fats * 9) + (protein * 4) + (carbs * 4),
        serving_size: volume + ' ' + '(' + weight + selectedMeasurement + ')',
        protein_per_serving: protein,
        carbs_per_serving: carbs,
        fat_per_serving: fats
      }

      console.log('food to add: ' + JSON.stringify(item));
      

      await db.runAsync(
          'INSERT INTO foods (name, calories_per_serving, serving_size, protein_per_serving, carbs_per_serving, fat_per_serving) VALUES (?,?,?,?,?,?)',
          [item.name, item.calories_per_serving, item.serving_size, item.protein_per_serving, item.carbs_per_serving, item.fat_per_serving]
        )

      router.back(); 
      
    }

  
    return (
      <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      style={[{ flex: 1, backgroundColor: theme.background }]}
      keyboardVerticalOffset={Platform.OS === 'ios' ? 100 : 20} // Adjust offset as needed
    >
        <ScrollView style={styles.container}>
            <View style={styles.weightItem}>
                <Text style={styles.text}>Name</Text>
                <TextInput
                    style={[styles.input, styles.text]} 
                    value={name}
                    keyboardType='default'
                    onChangeText={value => setName(value)}
                    placeholder="enter name"/>
            </View>

            <View style={[styles.weightItem]}>
                <Text style={[styles.text]}>Serving Size</Text>
                <TextInput
                    style={[styles.input, styles.text]}
                    value={volume}
                    keyboardType='default'
                    onChangeText={value => setVolume(value)}
                    placeholder="ex. 1 Cup"/>    
            </View>

           <View style={[styles.weightItem, {height: 175}]}>
              <View>
                <Text style={[styles.text, {marginBottom: 10}]}>Weight*</Text>
                <TextInput
                    style={[styles.input, styles.text]}
                    value={weight}
                    keyboardType='number-pad'
                    onChangeText={value => setWeight(value)}
                    placeholder="ex. 100g"/>  
              </View>
              
                <View style={{width: '50%'}}>
                  <Picker
                        style={{width: '100%'}}
                        ref={pickerRef}
                        selectedValue={selectedMeasurement}
                        onValueChange={(itemValue, itemIndex) => {
                            setSelectedMeasurement(itemValue)
                        }}>
                      <Picker.Item label='Grams' value='g'/>
                      <Picker.Item label='Ounce' value='oz'/>
                      <Picker.Item label='Mililiters' value='ml'/>
                  </Picker>         
                </View>  
          </View> 
          <View style={[styles.weightItem]}>
                <Text style={[styles.text]}>Protein</Text>
                <TextInput
                    style={[styles.input, styles.text]}
                    value={protein}
                    keyboardType='decimal-pad'
                    onChangeText={value => {
                        setProtein(value)
                        setCalories((fats * 9) + (protein * 4) + (carbs * 4))}}
                    placeholder="ex. 20"/>    
            </View>
            <View style={[styles.weightItem]}>
                <Text style={[styles.text]}>Carbs</Text>
                <TextInput
                    style={[styles.input, styles.text]}
                    value={carbs}
                    keyboardType='decimal-pad'
                    onChangeText={value => setCarbs(value)}
                    placeholder="ex. 20"/>    
            </View>
            <View style={[styles.weightItem]}>
                <Text style={[styles.text]}>Fats</Text>
                <TextInput
                    style={[styles.input, styles.text]}
                    value={fats}
                    keyboardType='decimal-pad'
                    onChangeText={value => setFats(value)}
                    placeholder="ex. 20"/>    
            </View>
            <View style={[styles.weightItem]}>
                <Text style={[styles.text]}>Total Calories: {(fats * 9) + (protein * 4) + (carbs * 4)}</Text>  
            </View>
        </ScrollView>
      </KeyboardAvoidingView>
    )
}

function createStyles(theme, colorScheme) {
  return StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: theme.background,
    
    },
    text: {
      color: theme.text,
      fontSize: 18
    },
    dateText: {
      fontSize: 24, width: '100%'
    },
    input: {
        height: 40,
        borderColor: 'gray',
        borderWidth: 1,
        paddingHorizontal: 10,
        width: 150
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
      marginHorizontal: 'auto',
      pointerEvents: 'auto',
    },
    weightText: {
      // flex: 1,
      fontSize: 18,
      fontFamily: 'Inter_500Medium',
      color: theme.text,
    },
  })
}

export default add_food