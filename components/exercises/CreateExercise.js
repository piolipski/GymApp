import { View, StyleSheet, SafeAreaView, TextInput, TouchableOpacity } from 'react-native';
import { Text } from '../Text.js';
import RightArrowSVG from '../../images/RightArrowSVG.svg';
import { useState, useEffect } from 'react';
import { setItem, getAllExercises } from '../database/DataStorage.js';
import { useCategory } from './category/CategoryContext.js';
import { useType } from './type/TypeContext.js';

export default function CreateExercise({ navigation }) {
    const [exerciseName, setExerciseName] = useState('');
    const { selectedCategory, setSelectedCategory } = useCategory(null);
    const { selectedType, setSelectedType } = useType(null);
    const [exerciseDescription, setExerciseDescription] = useState('');

    useEffect(() => {
        setSelectedCategory(null);
        setSelectedType(null);
    }, []);

    useEffect(() => {
        return () => {
            setSelectedCategory(null);
            setSelectedType(null);
        };
    }, []);

    const capitalizeFirstLetter = (string) => {
        return string.charAt(0).toUpperCase() + string.slice(1);
    };

    const saveExercise = async () => {
        const existingExercises = await getAllExercises();

        if (!exerciseName) {
            alert('Exercise name cannot be empty');
            return;
        }

        if (existingExercises.some(exercise => exercise.name.toLowerCase() === exerciseName.toLowerCase())) {
            alert('Exercise with provided name already exists');
            return;
        }

        if (!selectedCategory) {
            alert('Category must be selected');
            return;
        }
        if (!selectedType) {
            alert('Type must be selected');
            return;
        }

        const exerciseData = {
            name: exerciseName,
            category: selectedCategory,
            type: selectedType,
            description: exerciseDescription
        };

        await setItem(['exercise', exerciseName], exerciseData);
        navigation.navigate('Exercises');
    };

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
                <TouchableOpacity style={styles.buttonTouch} onPress={() => navigation.navigate('TypeList')}>
                    <Text style={styles.buttonText}>
                        {selectedType ? selectedType : 'Exercise Type'}
                    </Text>
                    <RightArrowSVG />
                </TouchableOpacity>
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
                <TouchableOpacity style={styles.saveButton} onPress={saveExercise}>
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