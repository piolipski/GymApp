import { View, StyleSheet, Pressable } from 'react-native';
import { Text } from '../Text.js';
import { useNavigation } from '@react-navigation/native';
import { deleteItem } from '../database/DataStorage.js';

export default function ExerciseDetails({ exercise, setDetailModalOpen }) {
    const navigation = useNavigation();

    const handleEditExercise = () => {
        setDetailModalOpen(false);
        navigation.navigate('EditExerciseTab', { exercise: exercise });
    }

    const deleteExercise = async () => {
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
            <View>
                <Text style={[{
                    fontSize: 14,
                    paddingHorizontal: 10,
                }]}>
                    Name
                </Text>
                <Text style={[{
                    backgroundColor: 'lightgray',
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
                }]}>
                    Category
                </Text>
                <Text style={[{
                    backgroundColor: 'lightgray',
                    fontSize: 16,
                    padding: 20,
                }]}>
                    {exercise.category}
                </Text>
            </View>
            <View>
                <Text style={[{
                    fontSize: 14,
                    paddingHorizontal: 10,
                }]}>
                    Type
                </Text>
                <Text style={[{
                    backgroundColor: 'lightgray',
                    fontSize: 16,
                    padding: 20,
                }]}>
                    {exercise.type}
                </Text>
            </View>
            <View>
                <Text style={[{
                    fontSize: 14,
                    paddingHorizontal: 10,
                }]}>
                    Description
                </Text>
                <Text style={[{
                    backgroundColor: 'lightgray',
                    fontSize: 16,
                    padding: 20,
                }]}>
                    {exercise.description}
                </Text>
            </View>
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