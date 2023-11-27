import { View, StyleSheet, SafeAreaView, TextInput, TouchableOpacity } from 'react-native';
import { Text } from '../Text.js';
import RightArrowSVG from '../../images/RightArrowSVG.svg';
import { useEffect, useState } from 'react';
import { useCategory } from './category/CategoryContext.js';
import { useType } from './type/TypeContext.js';
import { getAllExercises, setItem, deleteItem, getItem, getAllWorkouts } from '../database/DataStorage.js';
import AsyncStorage from '@react-native-async-storage/async-storage';

export default function EditExercise({ route, navigation }) {
    const exercise = route.params.exercise;

    const [exerciseName, setExerciseName] = useState(exercise.name);
    const { selectedCategory, setSelectedCategory } = useCategory();
    const { selectedType, setSelectedType } = useType();
    const [exerciseDescription, setExerciseDescription] = useState(exercise.description);

    useEffect(() => {
        setSelectedCategory(exercise.category);
        setSelectedType(exercise.type);
    }, []);

    const capitalizeFirstLetter = (string) => {
        return string.charAt(0).toUpperCase() + string.slice(1);
    }

    const editExercise = async () => {
        const existingExercises = await getAllExercises();

        const originalName = exercise.name;

        if (!exerciseName) {
            alert('Exercise name cannot be empty');
            return;
        }

        if (existingExercises.some(ex => ex.name.toLowerCase() === exerciseName.toLowerCase() && ex.name !== originalName)) {
            alert('Exercise with provided name already exists');
            return;
        }

        if (!selectedCategory) {
            alert('Category must be selected');
            return;
        }

        const updatedExercise = {
            name: exerciseName,
            category: selectedCategory,
            type: selectedType,
            description: exerciseDescription
        };

        //await deleteItem(['exercise', originalName]);
        //await setItem(['exercise', exerciseName], updatedExercise);
        /*
        const workoutHistory = await getItem(['history', exercise.name]);
        console.log('--------------------START FROM HERE--------------------');
        console.log('');
        console.log("[WORKOUT HISTORY]", workoutHistory);
        if (workoutHistory) {
            const dates = Object.keys(workoutHistory);
            console.log("[DATES]", dates);
        }

        const allWorkouts = await getAllWorkouts();
        console.log('');
        console.log("[ALL WORKOUTS]", allWorkouts);
        if (allWorkouts) {
            const updatedWorkouts = await Promise.all(allWorkouts.map(async (workout, index) => {
                const keys = Object.keys(workout);
                if (workout[originalName]) {
                    console.log('INDEX: ', index);
                    console.log('KEY: ', keys);
                    console.log("[Workout[ON]]", workout[originalName]);
                    console.log("[AllWorkouts[ON]", allWorkouts[index][originalName]);
                    let updatedWorkout = { ...workout };
                    updatedWorkout[exerciseName] = updatedWorkout[originalName];
                    delete updatedWorkout[originalName];
                    console.log("[AllWorkouts[EN]", updatedWorkout[exerciseName]);
                    return updatedWorkout;
                } else {
                    return workout;
                }
            }));
            console.log("[UPDATED WORKOUTS]", updatedWorkouts);
        }
        */
        //navigation.navigate('Exercises');
    }

    return (
        <SafeAreaView style={styles.safeAreaView}>
            <View style={styles.exerciseNameView}>
                <TextInput
                    style={styles.textInput}
                    placeholder='Exercise Name'
                    value={exerciseName}
                    onChangeText={text => setExerciseName(text)}
                />
            </View>
            <View style={styles.button}>
                <TouchableOpacity style={styles.buttonTouch} onPress={() => navigation.navigate('CategoryList')}>
                    <Text style={styles.buttonText}>
                        {selectedCategory ? selectedCategory : 'Exercise Category'}
                    </Text>
                    <RightArrowSVG />
                </TouchableOpacity>
            </View>
            <View style={styles.button}>
                <Text style={styles.buttonTouch}>
                    <Text style={styles.buttonText}>
                        {selectedType ? selectedType : 'Exercise Type'}
                    </Text>
                </Text>
            </View>
            <View style={styles.descriptionView}>
                <TextInput style={styles.textInput}
                    placeholder='Description'
                    multiline={true}
                    maxLength={100}
                    value={exerciseDescription}
                    onChangeText={text => setExerciseDescription(text)}
                />
            </View>
            <View style={{ marginTop: 10 }}>
                <TouchableOpacity style={styles.saveButton} onPress={editExercise}>
                    <Text style={styles.saveButtonText}>Save</Text>
                </TouchableOpacity>
            </View>
        </SafeAreaView >
    )
}

const styles = StyleSheet.create({
    safeAreaView: {
        gap: 10,
    },
    exerciseNameView: {
        borderBottomWidth: 1,
        borderBottomColor: 'hsla(0, 0%, 0%, 0.35)',
        margin: 15,
    },
    descriptionView: {
        borderBottomWidth: 1,
        borderBottomColor: 'hsla(0, 0%, 0%, 0.35)',
        margin: 15,
    },
    textInput: {
        padding: 10,
        fontSize: 16,
        fontFamily: 'Inter_700Bold',
    },
    button: {
        padding: 10,
        margin: 15,
        borderBottomWidth: 1,
        borderBottomColor: 'hsla(0, 0%, 0%, 0.35)'
    },
    buttonTouch: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
    },
    buttonText: {
        color: 'hsla(0, 0%, 0%, 0.35)',
        fontSize: 16,
        fontFamily: 'Inter_700Bold',
    },
    saveButton: {
        backgroundColor: '#006EE6',
        padding: 15,
        marginHorizontal: 60,
        borderRadius: 15,
    },
    saveButtonText: {
        color: 'white',
        textAlign: 'center',
        fontSize: 16,
        fontFamily: 'Inter_700Bold',
    }
})