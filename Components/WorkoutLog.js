import { View, Text, TouchableOpacity, StyleSheet, StatusBar, Platform, SafeAreaView } from 'react-native';

const paddingTop = Platform.OS === 'android' ? StatusBar.currentHeight : 0;

export default function WorkoutLog(){

    return(
        <SafeAreaView style={styles.container}>
            <Text>cos</Text>
        </SafeAreaView>
    )
}

const styles = StyleSheet.create({
    container:{
        paddingTop,
    }
});