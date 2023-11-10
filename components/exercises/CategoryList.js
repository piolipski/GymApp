import { View, TouchableOpacity, StyleSheet, SafeAreaView } from 'react-native';
import { Text } from '../Text.js';
import { ScrollView } from 'react-native-gesture-handler';

export default function CategoryList({ route, navigation }) {
    const { onCategorySelected, selectedCategory } = route.params;

    const data = [
        {
            key: "category",
            values: ["Shoulders", "Chest", "Biceps", "Triceps", "Legs"]
        }
    ]

    const handleCategoryChange = (category) => {
        onCategorySelected(category);
        navigation.goBack({
            selectedCategory: category
        });
    };

    return (
        <SafeAreaView>
            <ScrollView style={{ marginHorizontal: 15 }}>
                {data[0].values.map((category, index) => (
                    <TouchableOpacity
                        key={index}
                        onPress={() => handleCategoryChange(category)}
                        style={{
                            padding: 16,
                            borderBottomWidth: 1,
                            borderColor: 'hsla(0, 0%, 0%, 0.35)',
                        }}
                    >
                        <Text style={{ fontSize: 16, color: selectedCategory === category ? '#006EE6' : 'black' }}>
                            {category}
                        </Text>
                    </TouchableOpacity>
                ))}
                <TouchableOpacity style={{ alignItems: 'center', padding: 16 }}>
                    <Text style={{ fontSize: 16 }}>
                        Add new category
                    </Text>
                </TouchableOpacity>
            </ScrollView>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: {
        backgroundColor: 'white',
        justifyContent: 'center',
        alignItems: 'center'
    }
})