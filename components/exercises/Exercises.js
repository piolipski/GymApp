import { TextInput, View, SafeAreaView, StyleSheet, ScrollView } from 'react-native';
import SearchSVG from '../../images/SearchSVG.svg';
import { Text } from '../Text.js';
import { useState, useEffect } from 'react';
import { getAllExercises } from '../database/DataStorage.js';
import { useIsFocused } from '@react-navigation/native';

export default function Exercises() {
    const isFocused = useIsFocused();

    const [searchText, setSearchText] = useState('');
    const [exercises, setExercises] = useState([]);

    useEffect(() => {
        if (isFocused) {
            fetchExercises();
        }
    }, [isFocused]);

    const fetchExercises = async () => {
        const exerciseData = await getAllExercises();
        setExercises(exerciseData || []);
    };

    const filteredExercises = exercises.filter(exercise => {
        return exercise.name.includes(searchText);
    });

    return (
        <SafeAreaView style={{ flex: 1 }}>
            <View style={styles.searchBar}>
                <SearchSVG />
                <TextInput
                    style={styles.textInput}
                    placeholder='Search'
                    value={searchText}
                    onChangeText={text => setSearchText(text)}
                />
            </View>
            <View style={{ flex: 1 }}>
                <ScrollView style={styles.scrollView}>
                    {filteredExercises.map((exercise, index) => (
                        <View style={styles.exerciseItem} key={index}>
                            <Text style={styles.exerciseName}>{exercise.name}</Text>
                            <Text style={styles.exerciseCategory}>{exercise.category}</Text>
                            <Text style={styles.exerciseDescription}>{exercise.description}</Text>
                        </View>
                    ))}
                </ScrollView>
            </View>
        </SafeAreaView>
    )
}

const styles = StyleSheet.create({
    searchBar: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#D9D9D9',
        borderRadius: 5,
        padding: 15,
        margin: 15
    },
    textInput: {
        fontSize: 16,
        flex: 1,
        marginLeft: 10,
        fontFamily: 'Inter_700Bold',
    },
    exerciseItem: {
        margin: 15,
        padding: 10,
        borderBottomWidth: 1,
        borderBottomColor: 'hsla(0, 0%, 0%, 0.35)',
    },
    exerciseName: {
        fontSize: 16,
        fontFamily: 'Inter_700Bold',
    },
    exerciseCategory: {
        fontSize: 14,
        fontFamily: 'Inter_400Regular',
    },
    exerciseDescription: {
        fontSize: 12,
        fontFamily: 'Inter_400Regular',
    }
})