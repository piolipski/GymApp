import { TextInput, View, SafeAreaView, StyleSheet, ScrollView, Modal, Pressable } from 'react-native';
import SearchSVG from '../../images/SearchSVG.svg';
import { Text } from '../Text.js';
import CheckBox from '../CheckBox.js';
import { useState, useEffect } from 'react';
import { getAllExercises } from '../database/DataStorage.js';
import { useIsFocused } from '@react-navigation/native';
import { TouchableOpacity } from 'react-native-gesture-handler';
import Accordion from '../Accordion.js';
import EditCategory from './category/EditCategory.js';
import { useCategoryActions } from './category/CategoryActions.js';
import ExerciseDetails from './ExerciseDetails.js';

export default Exercises = ({ route, navigation }) => {
    const isRoutine = route.params?.isRoutine ?? false;

    const isFocused = useIsFocused();

    const [exercises, setExercises] = useState([]);
    const [categories, setCategories] = useState([]);
    const [searchText, setSearchText] = useState('');

    const [editModalOpen, setEditModalOpen] = useState(false);
    const [detailModalOpen, setDetailModalOpen] = useState(false);
    const { selectedCategoryIndex, handleEditCategory, handleDeleteCategory, setSelectedCategoryIndex } = useCategoryActions();

    const [selectedExercise, setSelectedExercise] = useState(null);

    const [checkedExercises, setCheckedExercises] = useState(route.params?.selectedExercises || []);

    const handleCheckboxPress = (exercise) => {
        if (checkedExercises.some((ex) => ex.name === exercise.name)) {
            setCheckedExercises(checkedExercises.filter((ex) => ex.name !== exercise.name));
        } else {
            setCheckedExercises([...checkedExercises, exercise]);
        }
    };

    useEffect(() => {
        console.log(checkedExercises);
    }, [checkedExercises]);

    useEffect(() => {
        if (route.params?.onCheckedExercisesChange) {
            route.params.onCheckedExercisesChange(checkedExercises);
        }
    }, [checkedExercises]);

    useEffect(() => {
        if (isFocused) {
            fetchExercises();
        }
    }, [isFocused]);

    useEffect(() => {
        if (!editModalOpen) {
            fetchExercises();
        }
    }, [editModalOpen]);

    useEffect(() => {
        if (!detailModalOpen) {
            fetchExercises();
        }
    }, [detailModalOpen]);

    const fetchExercises = async () => {
        const exerciseData = await getAllExercises();
        const categoriesData = exerciseData.map(exercise => { return exercise.category });
        const filteredCategories = categoriesData.filter((item, index) => categoriesData.indexOf(item) === index)
        setCategories(filteredCategories.sort());
        setExercises(exerciseData || []);
    };

    const filteredExercises = exercises.filter(exercise => {
        return exercise.name.includes(searchText);
    });

    const handleChosenExerciseButton = (name) => {
        navigation.navigate('ExerciseForm', { key1: name });
    }

    const handleLongPress = (index) => {
        setSelectedCategoryIndex(index);
        setEditModalOpen(true);
    };

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
                <ScrollView>
                    {categories.map((category, index) => (
                        <Accordion
                            onLongPress={() => handleLongPress(index)}
                            key={index}
                            title={category}
                            data={filteredExercises.filter(exercise => exercise.category === category)}
                            renderItem={(exercise, index) => {
                                const backgroundColor = index % 2 === 0 ? '' : 'lightgray';
                                return isRoutine ? (
                                    <TouchableOpacity
                                        style={[styles.exerciseItem, { backgroundColor }]}
                                        key={index}
                                        onPress={() => handleCheckboxPress(exercise)}
                                    >
                                        <View style={[{
                                            flexDirection: 'row',
                                            justifyContent: 'space-between',
                                            alignItems: 'center',
                                        }]}>
                                            <Text style={[styles.exerciseName, {}]}>{exercise.name}</Text>
                                            <CheckBox isChecked={checkedExercises.some((ex) => ex.name === exercise.name)} />
                                        </View>
                                    </TouchableOpacity>
                                ) : (
                                    <TouchableOpacity
                                        style={[styles.exerciseItem, { backgroundColor }]}
                                        key={index}
                                        onPress={() => { handleChosenExerciseButton(exercise.name) }}
                                        onLongPress={() => { setSelectedExercise(exercise); setDetailModalOpen(true) }}
                                    >
                                        <Text style={styles.exerciseName}>{exercise.name}</Text>
                                    </TouchableOpacity>
                                );
                            }}
                        />
                    ))}
                </ScrollView>
            </View>
            <Modal
                animationType="fade"
                transparent={true}
                visible={editModalOpen}
                onRequestClose={() => {
                    setEditModalOpen(!editModalOpen);
                }}
            >
                <Pressable
                    onPress={(event) => event.currentTarget === event.target && setEditModalOpen(false)}
                    style={styles.modalContainer}
                >
                    <EditCategory
                        handleEditCategory={handleEditCategory}
                        handleDeleteCategory={handleDeleteCategory}
                        initialCategoryName={categories[selectedCategoryIndex]}
                        setEditModalOpen={setEditModalOpen}
                    />
                </Pressable>
            </Modal>
            <Modal
                animationType="fade"
                transparent={true}
                visible={detailModalOpen}
                onRequestClose={() => {
                    setEditModalOpen(!detailModalOpen);
                }}
            >
                <Pressable
                    onPress={(event) => event.currentTarget === event.target && setDetailModalOpen(false)}
                    style={styles.modalContainer}
                >
                    <ExerciseDetails
                        exercise={selectedExercise}
                        setDetailModalOpen={setDetailModalOpen}
                    />
                </Pressable>
            </Modal>
        </SafeAreaView >
    );
};

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
        padding: 15,
        borderBottomWidth: 1,
        borderBottomColor: 'hsla(0, 0%, 0%, 0.35)',
    },
    exerciseName: {
        fontSize: 16,
        fontFamily: 'Inter_400Regular',
    },
    modalContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: 'rgba(0,0,0,0.5)'
    },
    saveButton: {
        padding: 15,
        marginHorizontal: 15,
        borderRadius: 5,
    },
    saveButtonText: {
        color: 'white',
        textAlign: 'center',
        fontSize: 16,
        fontFamily: 'Inter_700Bold',
    }
})