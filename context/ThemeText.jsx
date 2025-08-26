import { Colors } from '@/constants/Colors';
import { Appearance, StyleSheet, Text } from "react-native";



const colorScheme = Appearance.getColorScheme();
const theme = colorScheme === 'dark' ? Colors.dark : Colors.light;
const styles = createStyles(theme, colorScheme);

export default function ThemeText({children}) {
  return <Text style={styles.text}>{children}</Text>
}

function createStyles(theme, colorScheme) {
    return StyleSheet.create({
        text: {
            color: theme.text,
            fontSize: 18
        }
    })
}