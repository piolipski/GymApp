import AsyncStorage from '@react-native-async-storage/async-storage';

const SEP = '\u1F408';

export const validateKey = (key) => {
    for (const keyPart of key) {
        if (keyPart.includes(SEP)) {
            throw new Error('AsyncStorage key must not contain U+1F408 character');
        }
    }
};

export const setItem = async (key, data) => {
    validateKey(key);

    try {
        const jsonValue = JSON.stringify(data);
        await AsyncStorage.setItem(key.join(SEP), jsonValue);
    } catch (error) {
        console.error('Error saving data:', error);
    }
};

export const getItem = async (key) => {
    validateKey(key);
    try {
        const jsonValue = await AsyncStorage.getItem(key.join(SEP));
        return jsonValue != null ? JSON.parse(jsonValue) : null;
    } catch (error) {
        console.error('Error retrieving data: ', error);
        return null;
    }
};

export const deleteItem = async (key) => {
    validateKey(key);
    try {
        await AsyncStorage.removeItem(key.join(SEP));
    } catch (error) {
        console.error('Error clearing data: ', error);
    }
};

export const deleteItems = async (key) => {
    validateKey(key);
    try {
        await AsyncStorage.multiRemove(key.join(SEP));
    } catch (error) {
        console.error('Error clearing data: ', error);
    }
};

export const getAllExercises = async () => {
    try {
        let keys = await AsyncStorage.getAllKeys();
        let values = [];

        for (const key of keys) {
            if (key.includes('exercise')) {
                try {
                    const jsonValue = await AsyncStorage.getItem(key);
                    values.push(jsonValue != null ? JSON.parse(jsonValue) : null);
                } catch (error) {
                    console.error('Error retrieving data: ', error);
                    return null;
                }
            }
        }

        return values;

    } catch (error) {
        console.error('Error retrieving data: ', error);
        return null;
    }
};

export const getAllWorkouts = async () => {
    try {
        let keys = await AsyncStorage.getAllKeys();;
        let values = [];

        for (const key of keys) {
            if (key.includes('workout')) {
                try {
                    const jsonValue = await AsyncStorage.getItem(key);
                    values.push(jsonValue != null ? JSON.parse(jsonValue) : null);
                } catch (error) {
                    console.error('Error retrieving data: ', error);
                    return null;
                }
            }
        }

        return values;

    } catch (error) {
        console.error('Error retrieving data: ', error);
        return null;
    }
};

export const getAllWorkoutsWithDates = async () => {
    try {
        let keys = await AsyncStorage.getAllKeys();
        let values = [];

        for (const key of keys) {
            if (key.includes('workout')) {
                try {
                    const workoutDate = key.split(SEP)[1];
                    const jsonValue = await AsyncStorage.getItem(key);
                    const valuesWithDate = { [workoutDate]: JSON.parse(jsonValue) };

                    values.push(jsonValue != null ? valuesWithDate : null);
                } catch (error) {
                    console.error('Error retrieving data: ', error);
                    return null;
                }
            }
        }

        return values;

    } catch (error) {
        console.error('Error retrieving data: ', error);
        return null;
    }
};

export const getAllRoutinesWithNames = async () => {
    try {
        let keys = await AsyncStorage.getAllKeys();
        let values = [];

        for (const key of keys) {
            if (key.includes('routine')) {
                try {
                    const routineName = key.split(SEP)[1];
                    const jsonValue = await AsyncStorage.getItem(key);
                    const valuesWithName = { [routineName]: JSON.parse(jsonValue) }

                    values.push(jsonValue != null ? valuesWithName : null);
                } catch (error) {
                    console.error('Error retrieving data: ', error);
                    return null;
                }
            }
        }

        return values;

    } catch (error) {
        console.error('Error retrieving data: ', error);
        return null;
    }
}

export const synchronizeRoutine = async (data) => {
    try {
        const keys = await AsyncStorage.getAllKeys();
        const routineKeys = keys.filter((key) => key.includes('routine'));

        for (const key of routineKeys) {
            await AsyncStorage.removeItem(key);
        }

        for (const item of data) {
            const routineName = Object.keys(item)[0];
            await setItem(['routine', routineName], item[routineName]);
        }
    } catch (error) {
        console.error('Error synchronizing routine: ', error);
    }
};

export const synchronizeExercise = async (data) => {
    try {
        const keys = await AsyncStorage.getAllKeys();
        const exerciseKeys = keys.filter((key) => key.includes('exercise'));

        for (const key of exerciseKeys) {
            await AsyncStorage.removeItem(key);
            await AsyncStorage.removeItem('category');
        }
        let categoryArray = [];

        for (const exercise of data) {
            await setItem(['exercise', exercise.name], exercise);
            categoryArray.push(exercise.category);
        }
        categoryArray = [...new Set(categoryArray)];
        await setItem(['key', 'category'], categoryArray);
    } catch (error) {
        console.error('Error synchronizing exercise: ', error);
    }
};

export const synchronizeTrainingLog = async (data) => {
    try {
        const keys = await AsyncStorage.getAllKeys();
        const workoutKeys = keys.filter((key) => key.includes('workout'));

        for (const key of workoutKeys) {
            await AsyncStorage.removeItem(key);
        }

        for (const entry of data) {
            for (const [dateKey, exerciseDetails] of Object.entries(entry)) {
                await setItem(['workout', dateKey], exerciseDetails);
            }
        }
    } catch (error) {
        console.error('Error synchronizing training log: ', error);
    }
};

export const synchronizeHistoryOfExercise = async (data) => {
    try {
        const keys = await AsyncStorage.getAllKeys();
        const historyKeys = keys.filter((key) => key.includes('history'));

        for (const key of historyKeys) {
            await AsyncStorage.removeItem(key);
        }
        for (const entry of data) {
            for (const [dateKey, exerciseDetails] of Object.entries(entry)) {
                for(const [exerciseName, exerciseData] of Object.entries(exerciseDetails)){
                    const series = exerciseData.series || [];
                    const fetchedHistoryData = await getItem(['history', exerciseName]);
                    const transformedData = {
                        ...fetchedHistoryData,
                        [dateKey]: series
                    }
                    await setItem(['history', exerciseName], transformedData);
                }
            }
        }

    } catch (error) {
        console.error('Error parsing and saving to the database: ', error);
    }
};


const checkFirstTimeOpening = async () => {
    try {
        const isFirstTimeOpened = await getItem(['key', 'isFirstTimeOpened']);

        if (!isFirstTimeOpened) {
            await setItem(['key', 'vibration'], [250, 250, 250, 250]);
            await setItem(['key', 'sound'], 'default');
            await setItem(['key', 'autoStart'], false);
            await setItem(['key', 'weight'], 'kg');
            await setItem(['key','distance'],'km');
            await setItem(['key','token'],'logout');

            await setItem(['key', 'isFirstTimeOpened'], true);
        }
    } catch (error) {
        console.error('Error checking first time opening: ', error);
    }
};

checkFirstTimeOpening();