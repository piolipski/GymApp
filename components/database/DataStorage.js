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

export const getAllTrainings = async () => {
    try {
        let keys = [];
        let values = [];
        keys = await AsyncStorage.getAllKeys();

        for (const key of keys) {
            if (key.includes('training')) {
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


const checkFirstTimeOpening = async () => {
    try {
        const isFirstTimeOpened = await getItem(['key','isFirstTimeOpened']);

        if (!isFirstTimeOpened) {
            await setItem(['key','vibration'],false);
            await setItem(['key','sound'],true);
            await setItem(['key','autoStart'],false);
            console.log('test',await getItem(['key','vibration']),await getItem(['key','sound']),await getItem(['key','autoStart']))

            await setItem(['key', 'isFirstTimeOpened'], true);
        }
    } catch (error) {
        console.error('Error checking first time opening: ', error);
    }
};

checkFirstTimeOpening();