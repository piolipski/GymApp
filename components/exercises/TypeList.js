import { View, TouchableOpacity, StyleSheet, SafeAreaView } from 'react-native';
import { ScrollView } from 'react-native-gesture-handler';
import { Text } from '../Text.js';

export default function TypeList({ route, navigation }) {
    const { onTypeSelected, selectedType } = route?.params;

    const data = [
        {
            key: "type",
            values: ["kg - rep", "time - km", "kg - km", "time", "rep"]
        }
    ];

    const handleTypeChange = (type) => {
        onTypeSelected(type);
        navigation.goBack({
            selectedType: type
        })
    };

    return (
        <SafeAreaView>
            <ScrollView>
            {data[0].values.map((type, index) => (
                    <TouchableOpacity
                        key={index}
                        onPress={() => handleTypeChange(type)}
                        style={{
                            padding: 16,
                            borderBottomWidth: 1,
                            borderBottomColor: '#ddd',
                        }}
                    >
                        <Text style={{ fontSize: 16, color: selectedType === type ? '#006EE6' : 'black' }}>
                            {type}
                        </Text>
                    </TouchableOpacity>
                ))}
            </ScrollView>
        </SafeAreaView>
    )
}

const styles = StyleSheet.create({
    container: {
        backgroundColor: 'white',
        margin: 100,
        flex: 1,
        flexGrow: 0.5,
        justifyContent: 'center',
        alignItems: 'center'
    }
})