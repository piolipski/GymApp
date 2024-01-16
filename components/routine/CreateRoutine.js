import { View, StyleSheet, SafeAreaView, TextInput, TouchableOpacity } from 'react-native';
import { Text } from '../Text.js';
import { useState, useEffect } from 'react';
import { ScrollView } from 'react-native-gesture-handler';
import { setItem, getAllRoutinesWithNames, deleteItem } from '../database/DataStorage.js';
import { useRoutine } from './RoutineContext.js';

export default function CreateRoutine({ navigation, route }) {
    const { data } = route.params;

    const [routineName, setRoutineName] = useState('');
    const { checkedExercises, setCheckedExercises } = useRoutine();

    useEffect(() => {
        if (route.params?.key !== "Create Exercise") {
            setCheckedExercises([]);
        }

        if (route.params?.routine) {
            setRoutineName(route.params.routine.title);
            setCheckedExercises(route.params.routine.data);
        } else if (data) {
            const exercises = Object.entries(data).map(([name, details]) => ({ name, ...details }));
            setCheckedExercises(exercises);
        }
    }, [route.params]);

    const handleSaveRoutine = async () => {
        const existingRoutines = await getAllRoutinesWithNames();

        if (!routineName) {
            alert('Routine name cannot be empty');
            return;
        }

        const routineExists = existingRoutines.some(routine => routine.hasOwnProperty(routineName));
        if (routineExists) {
            alert('Routine with provided name already exists');
            return;
        }

        if (checkedExercises.length === 0) {
            alert('Routine must have at least one exercise');
            return;
        }

        await setItem(['routine', routineName], checkedExercises);
        navigation.goBack();
        setCheckedExercises([]);
    }

    const handleUpdateRoutine = async () => {
        const existingRoutines = await getAllRoutinesWithNames();

        if (!routineName) {
            alert('Routine name cannot be empty');
            return;
        }
        
        if (checkedExercises.length === 0) {
            alert('Routine must have at least one exercise');
            return;
        }

        const routineExists = existingRoutines.some(routine => routine.hasOwnProperty(routineName));
        if (routineExists && routineName !== route.params.routine.title) {
            alert('Routine with provided name already exists');
            return;
        }
        
        await deleteItem(['routine', route.params.routine.title]);
        await setItem(['routine', routineName], checkedExercises);

        navigation.goBack();
        setCheckedExercises([]);
    }

    const handleDeleteRoutine = async () => {
        await deleteItem(['routine', routineName]);
        navigation.goBack();
        setCheckedExercises([]);
    }

    return (
        <SafeAreaView style={styles.safeAreaView}>
            <View style={styles.exerciseNameView}>
                <TextInput
                    style={styles.textInput}
                    placeholder='Routine Name'
                    value={routineName}
                    onChangeText={text => setRoutineName(text)}
                />
            </View>
            <View style={[{ flexDirection: 'row', justifyContent: 'center', marginHorizontal: 15, gap: 20 }]}>
                <TouchableOpacity style={[{
                    flexGrow: 1,
                    alignItems: 'center',
                    backgroundColor: checkedExercises.length > 0 ? '#006EE6' : 'red',
                    padding: 15,
                    flexBasis: 0,
                    color: 'white',
                    borderRadius: 6,
                }]}
                    onPress={route.params?.key === 'Edit Routine' ? handleUpdateRoutine : handleSaveRoutine}>
                    <Text style={[{
                        fontSize: 16,
                        fontFamily: 'Inter_700Bold',
                        color: 'white',
                    }]}>
                        {route.params?.key === 'Edit Routine' ? 'Update' : 'Save'}
                    </Text>
                </TouchableOpacity>
                <TouchableOpacity style={[{
                    alignItems: 'center',
                    flexGrow: 1,
                    flexBasis: 0,
                    backgroundColor: 'green',
                    padding: 15,
                    color: 'white',
                    borderRadius: 6,
                }]}
                    onPress={() => navigation.navigate('Exercises', {
                        isRoutine: true,
                        checkedExercises: checkedExercises
                    })}>
                    <Text style={[{
                        fontSize: 16,
                        fontFamily: 'Inter_700Bold',
                        color: 'white',
                    }]}>
                        {checkedExercises.length > 0 ? 'Edit list' : 'Add exercise'}
                    </Text>
                </TouchableOpacity>
            </View>
            <View style={[{ flexDirection: 'row', justifyContent: 'center', marginHorizontal: 15, gap: 20 }]}>
                {route.params?.key === 'Edit Routine' && (
                    <TouchableOpacity style={[{
                        alignItems: 'center',
                        flexGrow: 1,
                        flexBasis: 0,
                        backgroundColor: 'red',
                        padding: 15,
                        color: 'white',
                        borderRadius: 6,
                    }]}
                        onPress={handleDeleteRoutine}>
                        <Text style={[{
                            fontSize: 16,
                            fontFamily: 'Inter_700Bold',
                            color: 'white',
                        }]}>
                            Delete
                        </Text>
                    </TouchableOpacity>
                )}
            </View>
            <ScrollView>
                <View style={styles.exerciseListView}>
                    {checkedExercises.map((exercise, index) => (
                        <View key={index} style={styles.exerciseItem}>
                            <Text style={styles.exerciseText}>{exercise.name}</Text>
                        </View>
                    ))}
                </View>
            </ScrollView>
        </SafeAreaView>
    );
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
    },
    exerciseListView: {
        padding: 10,
        backgroundColor: '#f5f5f5',
        borderRadius: 5,
        marginVertical: 10,
    },
    exerciseItem: {
        padding: 10,
        borderBottomWidth: 1,
        borderBottomColor: 'hsla(0, 0%, 0%, 0.35)',
    },
    exerciseText: {
        fontSize: 16,
    },
});