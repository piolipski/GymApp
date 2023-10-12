import { View, Text, TouchableOpacity, StyleSheet, StatusBar, Platform, SafeAreaView } from 'react-native';


const paddingTop = Platform.OS === 'android' ? StatusBar.currentHeight : 0;

export default function Settings(){

    return(
        <SafeAreaView>
            <Text>cos3</Text>
        </SafeAreaView>
    )
}

