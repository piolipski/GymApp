import { useEffect, useState } from 'react';
import { getAllExercises, setItem, getItem } from '../../database/DataStorage.js';

export const useCategoryActions = () => {
    const [categories, setCategories] = useState([]);
    const [selectedCategoryIndex, setSelectedCategoryIndex] = useState(null);

    const fetchCategories = async () => {
        const categoryArray = await getItem(['key', 'category']) || [];
        setCategories(categoryArray);
    };

    const handleEditCategory = async (newCategoryName) => {
        newCategoryName = newCategoryName.charAt(0).toUpperCase() + newCategoryName.slice(1);

        const newCategories = await getItem(['key', 'category']) || [];
        newCategories.sort();
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
        }
    };

    return {
        categories,
        selectedCategoryIndex,
        fetchCategories,
        handleEditCategory,
        handleDeleteCategory,
        setSelectedCategoryIndex
    };
};