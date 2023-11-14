import { SafeAreaView, View, TouchableOpacity, StyleSheet, StatusBar, TextInput } from "react-native"
import { Text } from "../Text"
import { useRoute, useIsFocused } from '@react-navigation/native';
import { useEffect, useState } from "react";
import { format, addDays, subDays } from 'date-fns';
import { setItem, getItem, deleteItem } from "../database/DataStorage";
import { ScrollView } from "react-native-gesture-handler";

const paddingTop = Platform.OS === 'android' ? StatusBar.currentHeight : 0;
export default function ExerciseForm() {

    const route = useRoute();
    const isFocused = useIsFocused();

    const exerciseName = route.params.key1;
    const [currentDate, setCurrentDate] = useState(new Date()); //useRef
    const [trackContent, setTrackContent] = useState(false); 
    const [exerciseData, setExerciseData] = useState(null);
    const [series, setSeries] = useState([]);
    const [type, setType] = useState({
        type1: null,
        type2: null,
    });
    const [typeValue, setValueType] = useState({
        type1: null,
        type2: null,
    })


    const handleContentChange = () => {
        const bool = trackContent;
        setTrackContent(!bool);
    }

    const onFirstTypeChange = (text) => {
        const value = text.replace(/[,.\-\s]/, '');
        setValueType((prevValue) => ({ ...prevValue, type1: value }));
    }

    const onSecondTypeChange = (text) => {
        const value = text.replace(/[,.\-\s]/, '');
        setValueType((prevValue) => ({ ...prevValue, type2: value }));
    }

    const handleSaveButton = async () => {

        const singleSeries = {
            id: new Date().getTime(),
            [type.type1]: typeValue.type1,
            [type.type2]: typeValue.type2
        }

        setSeries((prevSeries) => [...prevSeries, singleSeries]);

        const thisWorkoutData = {
            [exerciseName]: {
                series: [
                    ...series,
                    singleSeries
                ]
            }
        }
        console.log(exerciseData?.[exerciseName]);

        await setItem(['workout', format(currentDate, 'dd-MM-yyyy')], { ...(exerciseData ?? {}), ...thisWorkoutData })

    }

    useEffect(() => {
        const fetchExercise = async () => {
            const fetchedExerciseData = await getItem(['exercise', exerciseName]);
            const fetchedWorkoutData = await getItem(['workout', format(currentDate, 'dd-MM-yyyy')]);
            const fetchedType = fetchedExerciseData.type.split(' - ');
            console.log(fetchedWorkoutData?.[exerciseName]);

            if (fetchedWorkoutData) {
                const existingExercise = fetchedWorkoutData?.[exerciseName]?.series;

                if (existingExercise) {

                    setSeries(existingExercise);
                }

                setExerciseData(fetchedWorkoutData);
            }

            setType({ type1: fetchedType[0], type2: fetchedType[1] })
        }

        if (isFocused) {
            fetchExercise();
        }
    }, [isFocused])


    /*
    [workout:date]
    {
            squat:{
                serie:[
                    id:
                    waga:
                    powtorzenia:
                
            bench press:{
                serie:[
                    id:
                    waga:
                    powtorzenia:
                ]
            }
    }
    */

    return (
        <SafeAreaView style={styles.container}>
            <View style={styles.trackHistoryContainer}>
                <TouchableOpacity>
                    <Text>
                        Today
                    </Text>
                </TouchableOpacity>
                <TouchableOpacity>
                    <Text>
                        All time
                    </Text>
                </TouchableOpacity>
            </View>
            <View>
                <Text>{`Weight ( ${type.type1} )`}</Text>
            </View>
            <View>
                <View style={styles.typeContainer}>
                    <TouchableOpacity>
                        <Text style={{ fontSize: 35 }}> - </Text>
                    </TouchableOpacity>
                    <TextInput
                        style={styles.inputContainer}
                        onChangeText={onFirstTypeChange}
                        value={typeValue.type1}
                        keyboardType='numeric'
                        maxLength={4}
                    />
                    <TouchableOpacity>
                        <Text style={{ fontSize: 35 }}> + </Text>
                    </TouchableOpacity>
                </View>
                <View>
                    <Text>{type.type2}</Text>
                </View>
                <View style={styles.typeContainer}>
                    <TouchableOpacity>
                        <Text style={{ fontSize: 35 }}> - </Text>
                    </TouchableOpacity>
                    <TextInput
                        style={styles.inputContainer}
                        onChangeText={onSecondTypeChange}
                        value={typeValue.type2}
                        keyboardType='numeric'
                        maxLength={4}
                    />
                    <TouchableOpacity>
                        <Text style={{ fontSize: 35 }}> + </Text>
                    </TouchableOpacity>
                </View>
                <View style={styles.saveEditButtonContainer}>
                    <TouchableOpacity onPress={handleSaveButton}>
                        <Text>Save</Text>
                    </TouchableOpacity>
                </View>
            </View>
            <ScrollView>
                {
                    series.map((element, index) => (
                        <View key={element.id} style={styles.seriesContainer}>
                            <Text style={styles.seriesText}>{`Serie ${index + 1}:`}</Text>
                            <Text style={styles.seriesText}>{`${element[type.type1]} kg`}</Text>
                        </View>
                    ))
                }
            </ScrollView>
        </SafeAreaView>
    )
}

const styles = StyleSheet.create({
    container: {
        paddingTop,
        flexGrow: 1,
    },
    trackHistoryContainer: {
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
        gap: 10,
        paddingBottom: 15,
    },
    typeContainer: {
        borderTopWidth: 1,
        paddingBottom: 20,
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
        gap: 10,
    },
    inputContainer: {
        height: 60,
        width: 120,
        borderBottomWidth: 1,
        textAlign: 'center',
        fontSize: 25,
    },
    saveEditButtonContainer: {
        justifyContent: 'center',
        alignItems: 'center',

    },
    seriesContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        padding: 10,
        borderBottomWidth: 1,
        borderBottomColor: '#006EE6',
    },
    seriesText: {
        color: '#006EE6',
        fontSize: 18,
    },
})