import { TextInput, View, SafeAreaView, StyleSheet, ScrollView } from 'react-native';
import SearchSVG from '../../images/SearchSVG.svg';
import { Text } from '../Text.js';
import { useState, useEffect } from 'react';
import { getAllExercises } from '../database/DataStorage.js';
import { useIsFocused } from '@react-navigation/native';
import { TouchableOpacity } from 'react-native-gesture-handler';

export default function Exercises({navigation}) {

    const isFocused = useIsFocused();

    const [searchText, setSearchText] = useState('');
    const [exercises, setExercises] = useState([]);
    const [categories, setCategories] = useState([]);
    const [selectedExercises, setSelectedExercises] = useState([]);
    const [filter, setFilter] = useState(false);

    useEffect(() => {
        if (isFocused) {
            fetchExercises();
        } else{
            setSelectedExercises([]);
            setFilter(false);
        }
    }, [isFocused]);

    const fetchExercises = async () => {
        const exerciseData = await getAllExercises();
        const categoriesData = exerciseData.map(exercise => { return exercise.category });
        const filteredCategories = categoriesData.filter((item, index) => categoriesData.indexOf(item) === index)
        setCategories(filteredCategories);
        setExercises(exerciseData || []);
    };

    const handleCategoryButton = (e) => {
        const filterdArray = exercises.filter((exercise) => exercise.category === e);
        setSelectedExercises(filterdArray.sort());
        setFilter(true);
    };

    const filteredExercises = exercises.filter(exercise => {
        return exercise.name.includes(searchText);
    });

    const handleChosenExerciseButton = (name) => {
        navigation.navigate('ExerciseForm', {key1: name});
    }

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
                    {filter ? (
                        selectedExercises.map((exercise, index) => (
                            <View style={styles.exerciseItem} key={index}>
                                <TouchableOpacity onPress={() => {handleChosenExerciseButton(exercise.name)}}>
                                <Text style={styles.exerciseName}>{exercise.name}</Text>
                                </TouchableOpacity>
                            </View>
                        ))
                    ) : (
                        categories.map((category, index) => (
                            <View style={styles.exerciseItem} key={index}>
                                <TouchableOpacity onPress={() => {handleCategoryButton(category)}}>
                                    <Text style={styles.exerciseName}>{category}</Text>
                                </TouchableOpacity>
                            </View>
                        ))
                    )}

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