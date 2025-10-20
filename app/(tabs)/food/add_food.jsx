/* eslint-disable react-hooks/rules-of-hooks */
import { ThemeContext } from "@/context/ThemeContext";
import { Picker } from '@react-native-picker/picker';
import { useNavigation } from '@react-navigation/native';
import { useRouter } from 'expo-router';
import { useSQLiteContext } from 'expo-sqlite';
import { React, useContext, useState } from 'react';
import { ScrollView, StyleSheet, Text, TextInput, View } from 'react-native';


const add_food = () => {
    const {colorScheme, setColorScheme, theme} = useContext(ThemeContext)
    const styles = createStyles(theme, colorScheme)
    const router = useRouter();
    const db = useSQLiteContext();
    const navigation = useNavigation();
    
    const [name, setName] = useState('');
    const [weight, setWeight] = useState(0);
    const [servingUOM, setServingUOM] = useState([])
    const [selectedMeasurement, setSelectedMeasurement] = useState();
    const [selectedLanguage, setSelectedLanguage] = useState();
  
    return (
        <ScrollView style={styles.container}>
            <View style={styles.weightItem}>
                <Text style={styles.text}>Name</Text>
                <TextInput 
                    value={name}
                    keyboardType='default'
                    onChangeText={value => setName(value)}
                    placeholder="enter name"/>
            </View>
            <View style={[styles.weightItem, {height: 100}]}>
                <Text style={[styles.text, {width: '25%'}]}>Serving Size</Text>
                <TextInput
                    style={[styles.input, styles.text, {width: '20%'}]}
                    value={name}
                    keyboardType='default'
                    onChangeText={value => setName(value)}
                    placeholder="Volume"/>    
                <TextInput
                                    style={[styles.input, styles.text, {width: '20%'}]}

                    value={weight}
                    keyboardType='number-pad'
                    onChangeText={value => setWeight(value)}
                    placeholder="Weight"/>    
                <View style={{width: '35%'}}>
                    <ScrollView>
                    <Picker
                        selectedValue={selectedMeasurement}
                        onValueChange={(itemValue, itemIndex) =>
                            setSelectedMeasurement(itemValue)
                        }>
                        <Picker.Item label='Gram' value='test'/>
                        <Picker.Item label='Ounce' value='test1'/>
                        <Picker.Item label='Ml' value='test2x'/>
                    </Picker>   
                    </ScrollView>    
                 </View>    
                
            </View>
            
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
    input: {
        height: 40,
        borderColor: 'gray',
        borderWidth: 1,
        paddingHorizontal: 10,
        width: '45%'
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
  })
}

export default add_food