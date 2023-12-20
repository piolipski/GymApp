import { View, StyleSheet, Pressable } from 'react-native';
import { Text } from '../Text.js';
import { useState } from 'react';
import { useNavigation } from '@react-navigation/native';
import { deleteItem, getAllWorkoutsWithDates } from '../database/DataStorage.js';

export default function ExerciseDetails({ exercise, setDetailModalOpen }) {
    const navigation = useNavigation();
    
    const [numberOfLines, setNumberOfLines] = useState(0);

    const handleEditExercise = () => {
        setDetailModalOpen(false);
        navigation.navigate('EditExerciseTab', { exercise: exercise });
    }

    const deleteExercise = async () => {
        const existingWorkouts = await getAllWorkoutsWithDates();

        const isExerciseInWorkouts = existingWorkouts.some(workout => {
            const workoutExercises = Object.values(workout)[0];
            return Object.keys(workoutExercises).includes(exercise.name);
        });

        if (isExerciseInWorkouts) {
            alert('Exercise is already in use and cannot be deleted');
            return;
        }

        setDetailModalOpen(false);
        await deleteItem(['exercise', exercise.name]);
    }

    return (
        <View style={[{
            backgroundColor: 'white',
            shadowColor: '#000',
            shadowOffset: {
                width: 0,
                height: 2,
            },
            shadowOpacity: 0.25,
            shadowRadius: 4,
            elevation: 5,
            borderRadius: 6,
            gap: 5
        }]}>
            <View style={[
                {
                    borderBottomWidth: 0.5,
                    padding: 10
                }]}>
                <Text style={[{
                    fontSize: 18,
                }]}>Exercise Details</Text>
            </View>
            <View style={[{

            }]}>
                <Text style={[{
                    fontSize: 14,
                    paddingHorizontal: 10,
                    marginHorizontal: 10,
                }]}>
                    Name
                </Text>
                <Text style={[{
                    borderWidth: 0.5,
                    borderRadius: 6,
                    marginHorizontal: 10,
                    marginBottom: 10,
                    padding: 20,
                    width: 280,
                    height: 60,
                    fontSize: 16,
                }]}>
                    {exercise.name}
                </Text>
            </View>
            <View>
                <Text style={[{
                    fontSize: 14,
                    paddingHorizontal: 10,
                    marginHorizontal: 10,
                }]}>
                    Category
                </Text>
                <Text style={[{
                    borderWidth: 0.5,
                    borderRadius: 6,
                    marginHorizontal: 10,
                    marginBottom: 10,
                    padding: 20,
                    width: 280,
                    height: 60,
                    fontSize: 16,
                }]}>
                    {exercise.category}
                </Text>
            </View>
            <View>
                <Text style={[{
                    fontSize: 14,
                    paddingHorizontal: 10,
                    marginHorizontal: 10,
                }]}>
                    Type
                </Text>
                <Text style={[{
                    borderWidth: 0.5,
                    borderRadius: 6,
                    marginHorizontal: 10,
                    marginBottom: 10,
                    padding: 20,
                    width: 280,
                    height: 60,
                    fontSize: 16,
                }]}>
                    {exercise.type}
                </Text>
            </View>
            {exercise.description && (
                <View>
                    <Text style={[{
                        fontSize: 14,
                        paddingHorizontal: 10,
                        marginHorizontal: 10,

                    }]}>
                        Description
                    </Text>
                    <Text style={[{
                        borderWidth: 0.5,
                        borderRadius: 6,
                        marginHorizontal: 10,
                        marginBottom: 10,
                        width: 280,
                        padding: 20,
                        fontSize: 16,
                    }]} numberOfLines={numberOfLines}
                        onLayout={(e) => {
                            setNumberOfLines({ numberOfLines: e.nativeEvent.layout.height > 16 ? 2 : 1 })
                        }}>
                        {exercise.description}
                    </Text>
                </View>
            )}
            <View style={[{ flexDirection: 'row' }]}>
                <Pressable style={[{ flex: 1 }]} onPress={handleEditExercise}>
                    <Text style={[{
                        textAlign: 'center',
                        color: 'white',
                        borderBottomLeftRadius: 6,
                        backgroundColor: '#006EE6',
                        fontSize: 16,
                        padding: 15,
                    }]}>
                        Edit
                    </Text>
                </Pressable>
                <Pressable style={[{ flex: 1 }]} onPress={deleteExercise}>
                    <Text style={[{
                        textAlign: 'center',
                        color: 'white',
                        borderBottomRightRadius: 6,
                        backgroundColor: 'red',
                        fontSize: 16,
                        padding: 15,
                    }]}>
                        Delete
                    </Text>
                </Pressable>
            </View>
        </View >
    );
}

const styles = StyleSheet.create({
});