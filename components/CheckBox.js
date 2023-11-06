import { Pressable, StyleSheet, Text, View } from "react-native"; 
import React from "react"; 
import { MaterialCommunityIcons } from "@expo/vector-icons"; 
  
export default function CheckBox(props) { 
    const iconName = props.isChecked ? 
        "checkbox-marked" : "checkbox-blank-outline"; 
  
    return ( 
        <View style={styles.container}> 
            <Pressable onPress={props.onPress}> 
                <MaterialCommunityIcons  
                    name={iconName} size={24} color="#006EE6" /> 
            </Pressable> 
            <Text style={styles.title}>{props.title}</Text> 
        </View> 
    ); 
}; 
  
const styles = StyleSheet.create({ 
    container: { 
        alignItems: "center", 
        flexDirection: "row", 
        marginTop: 5, 
        marginHorizontal: 5, 
    }, 
    title: { 
        fontSize: 16, 
        color: "#000", 
        marginLeft: 5, 
        fontWeight: "600", 
    }, 
}); 