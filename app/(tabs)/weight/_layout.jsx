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
                name="log_weight"
                options={{
                    title: 'Weight',
                    headerShown: true,
                    headerBackTitle: 'Home',
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