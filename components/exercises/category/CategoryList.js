import { View, TouchableOpacity, StyleSheet, SafeAreaView, Modal, Pressable, TextInput, Button } from 'react-native';
import { Text } from '../../Text.js';
import { ScrollView } from 'react-native-gesture-handler';
import CreateCategory from './CreateCategory.js';
import EditCategory from './EditCategory.js';
import { useIsFocused } from '@react-navigation/native';
import { useEffect, useState } from 'react';
import { getAllExercises, getItem, setItem } from '../../database/DataStorage.js';

export default function CategoryList({ route, navigation, modalOpen, setModalOpen }) {
    const isFocused = useIsFocused();
    const { onCategorySelected, selectedCategory } = route?.params;

    const [categories, setCategories] = useState([]);

    const [editModalOpen, setEditModalOpen] = useState(false);
    const [selectedCategoryIndex, setSelectedCategoryIndex] = useState(null);

    useEffect(() => {
        if (isFocused) {
            fetchCategories();
        }
    }, [isFocused]);

    const fetchCategories = async () => {
        const categoryArray = await getItem(['key', 'category']) || [];
        setCategories(categoryArray);
    };

    const handleCategoryChange = (category) => {
        onCategorySelected(category);
        navigation.goBack({
            selectedCategory: category
        });
    };

    const refreshCategories = async () => {
        fetchCategories();
    };

    const handleLongPress = (index) => {
        setSelectedCategoryIndex(index);
        setEditModalOpen(true);
    };

    const handleEditCategory = async (newCategoryName) => {
        newCategoryName = newCategoryName.charAt(0).toUpperCase() + newCategoryName.slice(1);

        const newCategories = [...categories];
        const oldCategoryName = newCategories[selectedCategoryIndex];
        newCategories[selectedCategoryIndex] = newCategoryName;
        setCategories(newCategories);
        await setItem(['key', 'category'], newCategories);

        const exercises = await getAllExercises();
        const updatedExercises = exercises.map(exercise => {
            if (exercise.category === oldCategoryName) {
                exercise.category = newCategoryName;
            }
            return exercise;
        });

        await Promise.all(updatedExercises.map(exercise => setItem(['exercise', exercise.name], exercise)));
        setEditModalOpen(false);
    };

    const handleDeleteCategory = async (categoryName) => {
        const exercises = await getAllExercises();
        const exercisesInCategory = exercises.filter(exercise => exercise.category === categoryName);

        if (exercisesInCategory.length > 0) {
            alert("Please remove all exercises from the category before deleting it.");
        } else {
            const newCategories = categories.filter(category => category !== categoryName);
            setCategories(newCategories);
            await setItem(['key', 'category'], newCategories);
            setEditModalOpen(false);
        }
    };

    return (
        <SafeAreaView>
            <ScrollView style={{ marginHorizontal: 15 }}>
                {categories.map((category, index) => (
                    <TouchableOpacity
                        key={index}
                        onPress={() => handleCategoryChange(category)}
                        onLongPress={() => handleLongPress(index)}
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
            </ScrollView>
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
                    <EditCategory handleEditCategory={handleEditCategory} handleDeleteCategory={handleDeleteCategory} initialCategoryName={categories[selectedCategoryIndex]} />
                </Pressable>
            </Modal>
            <Modal
                animationType="fade"
                transparent={true}
                visible={modalOpen}
                onRequestClose={() => {
                    setModalOpen(!modalOpen);
                }}
            >
                <Pressable
                    onPress={(event) => event.currentTarget === event.target && setModalOpen(false)}
                    style={styles.modalContainer}
                >
                    <CreateCategory setModalOpen={setModalOpen} refreshCategories={refreshCategories} />
                </Pressable>
            </Modal>
        </SafeAreaView >
    );
}

const styles = StyleSheet.create({
    container: {
        backgroundColor: 'white',
        justifyContent: 'center',
        alignItems: 'center'
    },
    modalContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: 'rgba(0,0,0,0.5)'
    }
})