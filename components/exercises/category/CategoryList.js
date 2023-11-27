import { TouchableOpacity, StyleSheet, SafeAreaView, Modal, Pressable } from 'react-native';
import { Text } from '../../Text.js';
import { ScrollView } from 'react-native-gesture-handler';
import CreateCategory from './CreateCategory.js';
import EditCategory from './EditCategory.js';
import { useIsFocused } from '@react-navigation/native';
import { useEffect, useState } from 'react';
import { useCategory } from './CategoryContext.js';
import { useCategoryActions } from './CategoryActions.js';

export default function CategoryList({ navigation, modalOpen, setModalOpen }) {
    const isFocused = useIsFocused();
    const { selectedCategory, setSelectedCategory } = useCategory();

    const { categories, selectedCategoryIndex, fetchCategories, handleEditCategory, handleDeleteCategory, setSelectedCategoryIndex } = useCategoryActions();

    const [editModalOpen, setEditModalOpen] = useState(false);

    useEffect(() => {
        if (isFocused) {
            fetchCategories();
        }
    }, [isFocused]);

    useEffect(() => {
        if (!editModalOpen) {
            fetchCategories();
        }
    }, [editModalOpen]);

    const handleCategoryChange = (category) => {
        setSelectedCategory(category);
        navigation.goBack();
    };

    const refreshCategories = async () => {
        fetchCategories();
    };

    const handleLongPress = (index) => {
        setSelectedCategoryIndex(index);
        setEditModalOpen(true);
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