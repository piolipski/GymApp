import { useEffect, useState } from 'react';
import { useIsFocused } from '@react-navigation/native';
import { ScrollView, SafeAreaView, View } from 'react-native';
import { Text } from '../Text.js';
import { format } from 'date-fns';
import { useDate } from '../date/DateContext';
import { getAllRoutinesWithNames, setItem } from '../database/DataStorage.js';
import RoutineAccordion from './RoutineAccordion.js';
import { TouchableOpacity } from 'react-native-gesture-handler';

export default function Routines({ navigation }) {
    const isFocused = useIsFocused();
    const date = useDate();
    const [routines, setRoutines] = useState([]);

    const fetchRoutines = async () => {
        const routinesData = await getAllRoutinesWithNames();
        const routines = routinesData.map(routine => ({
            title: Object.keys(routine)[0],
            data: Object.values(routine)[0],
        }));
        setRoutines(routines);
    }

    const handleLongPress = (routine) => {
        const routineData = {
            title: routine.title,
            data: routine.data,
        };
        navigation.navigate('CreateRoutine', { routine: routineData, key: 'Edit Routine' });
    };

    const handleSelect = (routine) => {
        const routineData = routine.data.reduce((acc, exercise) => {
            acc[exercise.name] = { series: [] };
            return acc;
        }, {});
        setItem(['workout', format(date.currentDate, 'dd-MM-yyyy')], routineData);
        navigation.navigate('WorkoutLog');
    }

    useEffect(() => {
        if (isFocused) {
            fetchRoutines();
        }
    }, [isFocused]);

    return (
        <SafeAreaView style={[{ flex: 1 }]}>
            {routines.length === 0 ? (
                <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', gap: 5 }}>
                    <Text style={[{
                        fontSize: 18,
                        fontFamily: 'Inter_700Bold',
                    }]}
                    >
                        No routines available
                    </Text>
                    <TouchableOpacity onPress={() => {navigation.navigate('CreateRoutine')}}>
                        <Text style={
                            [{
                                color: '#006EE6',
                                fontSize: 16,
                            }]

                        }>
                            Create one
                        </Text>
                    </TouchableOpacity>
                </View>
            ) : (
                <ScrollView>
                    {routines.map((routine, index) => (
                        <RoutineAccordion
                            key={index}
                            title={routine.title}
                            data={routine.data}
                            onLongPress={() => handleLongPress(routine)}
                            onSelect={() => handleSelect(routine)}
                        />
                    ))}
                </ScrollView>
            )}
        </SafeAreaView>
    );
}