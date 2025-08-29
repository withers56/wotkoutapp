import { Colors } from '@/constants/Colors';
import { Stack } from "expo-router";
import { Appearance, StyleSheet } from 'react-native';

const StackLayout = () => {
    const colorScheme = Appearance.getColorScheme();
    const theme = colorScheme === 'dark' ? Colors.dark : Colors.light;
    const styles = createStyles(theme, colorScheme);


    return (
        <Stack>
            <Stack.Screen 
                name="index"
                options={{
                    headerShown: false
                }}/>
            <Stack.Screen 
                name="[id]"
                options={{
                    title: new Date(Date.now()).toLocaleString('en-US', {
                        year: 'numeric',
                        month: 'long',
                        day: 'numeric'    
                    }),
                    headerShown: true,
                    headerTintColor: theme.color,
                    headerStyle: {
                        backgroundColor: theme.background,
                        
                    }
                }}/>
        </Stack>
    );
};

function createStyles(theme, colorScheme) {
    return StyleSheet.create({
        
    })
}

export default StackLayout;