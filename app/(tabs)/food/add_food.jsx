/* eslint-disable react-hooks/rules-of-hooks */
import { ThemeContext } from "@/context/ThemeContext";
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
    const [servingUOM, setServingUOM] = useState([])
  
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
            <View style={styles.weightItem}>
                <Text style={styles.text}>Serving Size</Text>
                <TextInput 
                    value={name}
                    keyboardType='default'
                    onChangeText={value => setName(value)}
                    placeholder="volume"/>
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