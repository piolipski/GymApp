import { TouchableOpacity, StyleSheet, SafeAreaView } from 'react-native';
import { ScrollView } from 'react-native-gesture-handler';
import { Text } from '../../Text.js';
import { useType } from './TypeContext.js';

export default function TypeList({ navigation }) {
    const { selectedType, setSelectedType } = useType();

    const data = [
        {
            key: "type",
            values: ["weight - reps", "time - distance", "weight - distance"]
        }
    ];

    const handleTypeChange = (type) => {
        setSelectedType(type);
        navigation.goBack();
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