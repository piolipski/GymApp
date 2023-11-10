import { View, StyleSheet, SafeAreaView, TextInput, TouchableOpacity } from 'react-native';
import { Text } from '../Text.js';
import RightArrowSVG from '../../images/RightArrowSVG.svg';
import { useState } from 'react';
import { addItem } from '../database/DataStorage.js';

export default function CreateExercise({ navigation }) {
    const [exerciseName, setExerciseName] = useState('');
    const [selectedCategory, setSelectedCategory] = useState(null);
    const [selectedType, setSelectedType] = useState(null);
    const [exerciseDescription, setExerciseDescription] = useState('');

    const handleCategorySelected = (category) => {
        setSelectedCategory(category);
    };

    const handleTypeSelected = (type) => {
        setSelectedType(type);
    };

    const saveExercise = async () => {
        const exerciseData = {
            name: exerciseName,
            category: selectedCategory,
            type: selectedType,
            description: exerciseDescription
        };

        await addItem(['exercise', exerciseName], exerciseData);
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
                <TouchableOpacity style={styles.buttonTouch} onPress={() => navigation.navigate('CategoryList', {
                    selectedCategory: selectedCategory, onCategorySelected: handleCategorySelected
                })}>
                    <Text style={styles.buttonText}>
                        {selectedCategory ? selectedCategory : 'Exercise Category'}
                    </Text>
                    <RightArrowSVG />
                </TouchableOpacity>
            </View>
            <View style={styles.button}>
                <TouchableOpacity style={styles.buttonTouch} onPress={() => navigation.navigate('TypeList', {
                    selectedType: selectedType, onTypeSelected: handleTypeSelected
                })}>
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

/*
const [typeModal, setTypeModal] = useState(false);
const [categoryModal, setCategoryModal] = useState(false);
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
            <TouchableOpacity
                style={styles.buttonTouch}
                onPress={() => setCategoryModal(true)}
            >
                <Text style={styles.buttonText}>
                    {selectedCategory ? selectedCategory : 'Exercise Category'}
                </Text>
                <RightArrowSVG />
            </TouchableOpacity>
            <Modal
                transparent={true}
                visible={categoryModal}
                onRequestClose={() => setCategoryModal(!categoryModal)}
            >
                <Pressable
                    style={styles.modalPressable}
                    onPress={(event) => event.currentTarget === event.target && setCategoryModal(false)}
                >
                    <CategoryList
                        selectedCategory={selectedCategory}
                        onCategorySelected={handleCategorySelected}
                    />
                </Pressable>
            </Modal>
        </View>
        <View style={styles.button}>
            <TouchableOpacity
                style={styles.buttonTouch}
                onPress={() => setTypeModal(true)}>
                <Text style={styles.buttonText}>
                    {selectedType ? selectedType : 'Exercise Type'}
                </Text>
                <RightArrowSVG />
            </TouchableOpacity>
            <Modal
                transparent={true}
                visible={typeModal}
                onRequestClose={() => setTypeModal(!typeModal)}
            >
                <Pressable
                    style={styles.modalPressable}
                    onPress={(event) => event.currentTarget === event.target && setTypeModal(false)}
                >
                    <TypeList
                        selectedType={selectedType}
                        onTypeSelected={handleTypeSelected}
                    />
                </Pressable>
            </Modal>
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
            <TouchableOpacity
                style={styles.saveButton}
                onPress={saveExercise}
            >
                <Text style={styles.saveButtonText}>Save</Text>
            </TouchableOpacity>
        </View>
    </SafeAreaView >
)
*/
