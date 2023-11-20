import { SafeAreaView, View, TouchableOpacity, StyleSheet, StatusBar, TextInput } from "react-native"
import { Text } from "../Text"
import { useDate } from "../date/DateContext";
import { useRoute, useIsFocused } from '@react-navigation/native';
import { useEffect, useRef, useState } from "react";
import { format } from 'date-fns';
import { setItem, getItem, deleteItem } from "../database/DataStorage";
import { ScrollView } from "react-native-gesture-handler";

import CalendarSVG from '../../images/CalendarSVG.svg';
import WorkoutLogSVG from "../../images/WorkoutLogSVG.svg";


const paddingTop = Platform.OS === 'android' ? StatusBar.currentHeight : 0;
export default function ExerciseForm() {

    const route = useRoute();
    const isFocused = useIsFocused();
    const chosenDate = useDate();

    const exerciseName = route.params.key1;

    const selectedSeriesId = useRef(null);

    const [todaySelected, setTodaySelected] = useState(true)
    const [editMode, setEditMode] = useState(false);
    const [trackContent, setTrackContent] = useState('today');
    const [exerciseData, setExerciseData] = useState(null);
    const [exerciseHistoryData, setExerciseHistoryData] = useState([]);
    const [series, setSeries] = useState([]);
    const [type, setType] = useState({
        type1: null,
        type2: null,
    });

    const [typeValue, setTypeValue] = useState({
        type1: '0',
        type2: '1',
    });

    const [timeValues, setTimeValues] = useState({
        hours: '0',
        minutes: '0',
        seconds: '0',
    });

    const handleContentTodayChange = () => {
        setTrackContent('today');
        setTodaySelected(true);
    }

    const handleContentAllTimeChange = () => {
        setTrackContent('alltime');
        setTodaySelected(false);
    }

    const handlePlusFirstTypeButton = () => {
        const incrementedValue = Number(typeValue.type1) + 2.5
        setTypeValue((prevValue) => ({ ...prevValue, type1: incrementedValue.toString() }))
    }

    const handleMinusFirstTypeButton = () => {
        let reducedValue = Number(typeValue.type1) - 2.5
        if (reducedValue < 0) {
            reducedValue = 0;
        }
        setTypeValue((prevValue) => ({ ...prevValue, type1: reducedValue.toString() }))
    }

    const handlePlusSecondTypeButton = () => {
        const incrementedValue = Number(typeValue.type2) + 1
        setTypeValue((prevValue) => ({ ...prevValue, type2: incrementedValue.toString() }))
    }

    const handleMinusSecondTypeButton = () => {
        let reducedValue = Number(typeValue.type2) - 1
        if (reducedValue < 1) {
            reducedValue = 1;
        }
        setTypeValue((prevValue) => ({ ...prevValue, type2: reducedValue.toString() }))
    }

    const onFirstTypeChange = (text) => {
        let value = text.replace(/[,.\-\s]/, '');
        if (value.trim() === '' || value < 0) {
            value = '0'
        }
        setTypeValue((prevValue) => ({ ...prevValue, type1: value }));

    }

    const onDistaneChange = (text) => {
        let value = text.replace(/[\-\s]/, '');
        if (value.trim() === '' || value < 0) {
            value = '0'
        }
        setTypeValue((prevValue) => ({ ...prevValue, type2: value }));
    }

    const onTimeChange = (value, type) => {
        if (value.trim() === '' || parseInt(value) < 0) {
            value = '0';
        }
        setTimeValues((prevValues) => ({ ...prevValues, [type]: value }));
    };

    const onSecondTypeChange = (text) => {
        let value = text.replace(/[,.\-\s]/, '');
        if (value.trim() === '' || value < 1) {
            value = '1'
        }
        setTypeValue((prevValue) => ({ ...prevValue, type2: value }));
    }

    const handleSaveButton = async () => {

        let singleSeries = {
            id: new Date().getTime(),
            [type.type1]: typeValue.type1,
            [type.type2]: typeValue.type2
        }

        if (type.type1 === 'time') {
            let timeInMinutes = parseInt(timeValues.hours) * 60 + parseInt(timeValues.minutes) + parseInt(timeValues.seconds) / 60;
            singleSeries = {
                ...singleSeries,
                [type.type1]: timeInMinutes.toString(),

            }
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

        const updatedHistory = {
            ...exerciseHistoryData,
            [format(chosenDate.currentDate, 'dd-MM-yyyy')]: [...series, singleSeries],
        };
        setExerciseHistoryData(updatedHistory);

        await setItem(['workout', format(chosenDate.currentDate, 'dd-MM-yyyy')], { ...(exerciseData ?? {}), ...thisWorkoutData })
        await setItem(['workout', exerciseName], updatedHistory);

    }

    const handleEditMode = (id) => {
        const seriesToEdit = series.find((element) => element.id === id);
        if (id === selectedSeriesId.current && editMode === true) {
            setEditMode(false);
            selectedSeriesId.current = null;
        } else {
            setEditMode(true);
            selectedSeriesId.current = seriesToEdit.id;
        }

        if (type.type1 === 'time') {
            const timeInMinutes = Number(seriesToEdit[type.type1]);

            const hours = Math.floor(timeInMinutes / 60);
            const remainingMinutes = timeInMinutes % 60;
            const minutes = Math.floor(remainingMinutes);
            const seconds = Math.floor((remainingMinutes - minutes) * 60);
            setTimeValues({
                hours: hours.toString(),
                minutes: minutes.toString(),
                seconds: seconds.toString(),
            })
            setTypeValue((prevData) => ({ ...prevData, type2: seriesToEdit?.[type.type2] }));
        } else {
            setTypeValue({ type1: seriesToEdit?.[type.type1], type2: seriesToEdit?.[type.type2] });
        }


    }

    const handleUpdateButton = async () => {
        let updatedSeries = series.map((element) => {
            if (element.id === selectedSeriesId.current) {
                let updatedElement = { ...element };
                if (type.type1 === 'time') {
                    let timeInMinutes = parseInt(timeValues.hours) * 60 + parseInt(timeValues.minutes) + parseInt(timeValues.seconds) / 60;
                    updatedElement = {
                        ...element,
                        [type.type1]: timeInMinutes.toString(),
                        [type.type2]: typeValue.type2,
                    };
                } else {
                    updatedElement = {
                        ...element,
                        [type.type1]: typeValue.type1,
                        [type.type2]: typeValue.type2,
                    };
                }
                return updatedElement;
            }
            return element;
        });

        const updatedHistorySeries = {
            ...exerciseHistoryData,
            [format(chosenDate.currentDate, 'dd-MM-yyyy')]: exerciseHistoryData[format(chosenDate.currentDate, 'dd-MM-yyyy')].map(
                (element) => {
                    if (element.id === selectedSeriesId.current) {
                        let updatedElement = { ...element };
                        if (type.type1 === 'time') {
                            let timeInMinutes = parseInt(timeValues.hours) * 60 + parseInt(timeValues.minutes) + parseInt(timeValues.seconds) / 60;
                            updatedElement = {
                                ...element,
                                [type.type1]: timeInMinutes.toString(),
                                [type.type2]: typeValue.type2,
                            };
                        } else {
                            updatedElement = {
                                ...element,
                                [type.type1]: typeValue.type1,
                                [type.type2]: typeValue.type2,
                            };
                        }
                        return updatedElement;
                    }
                    return element;
                }
            ),
        };

        const updatedThisWorkoutData = {
            ...exerciseData,
            [exerciseName]: {
                series: updatedSeries,
            },
        };

        setSeries(updatedSeries);
        setExerciseHistoryData(updatedHistorySeries);
        setEditMode(false);
        selectedSeriesId.current = null;
        await setItem(['workout', format(chosenDate.currentDate, 'dd-MM-yyyy')], updatedThisWorkoutData);
        await setItem(['workout', exerciseName], updatedHistorySeries);
    };


    const handleDeleteButton = async () => {
        const seriesAfterDelete = series.filter((element) => { return element.id !== selectedSeriesId.current });
        const historySeriesAfterDelete = {
            ...exerciseHistoryData,
            [format(chosenDate.currentDate, 'dd-MM-yyyy')]: exerciseHistoryData[format(chosenDate.currentDate, 'dd-MM-yyyy')].filter(
                (element) => { return element.id !== selectedSeriesId.current }
            )
        }

        const updatedThisWorkoutData = {
            ...exerciseData,
            [exerciseName]: {
                series: seriesAfterDelete
            }

        }

        setSeries(seriesAfterDelete);
        setExerciseHistoryData(historySeriesAfterDelete);
        setEditMode(false);
        selectedSeriesId.current = null;
        await setItem(['workout', format(chosenDate.currentDate, 'dd-MM-yyyy')], updatedThisWorkoutData);
        await setItem(['workout', exerciseName], historySeriesAfterDelete);
    }

    const renderInputsBasedOnType = () => {
        if (type.type1 === 'kg' && type.type2 === 'rep') {
            return (
                <>
                    <View style={styles.typeContainer}>
                        <TouchableOpacity style={styles.incrementReduceButtonContainer} onPress={handleMinusFirstTypeButton}>
                            <Text style={{ fontSize: 35, textAlign: 'center', lineHeight: 40, }}> - </Text>
                        </TouchableOpacity>
                        <TextInput
                            style={styles.inputContainer}
                            onChangeText={onFirstTypeChange}
                            value={typeValue.type1}
                            keyboardType='numeric'
                            maxLength={4}
                        />
                        <TouchableOpacity style={styles.incrementReduceButtonContainer} onPress={handlePlusFirstTypeButton}>
                            <Text style={{ fontSize: 35, textAlign: 'center', lineHeight: 40 }}> + </Text>
                        </TouchableOpacity>
                    </View>
                    <View style={styles.typeTextContainer}>
                        <Text style={{ fontSize: 15, color: 'hsla(0,0%,0%, 0.75)' }}>{type.type1}</Text>
                    </View>
                    <View style={styles.typeContainer}>
                        <TouchableOpacity style={styles.incrementReduceButtonContainer} onPress={handleMinusSecondTypeButton}>
                            <Text style={{ fontSize: 35, textAlign: 'center', lineHeight: 40, }}> - </Text>
                        </TouchableOpacity>
                        <TextInput
                            style={styles.inputContainer}
                            onChangeText={onSecondTypeChange}
                            value={typeValue.type2}
                            keyboardType='numeric'
                            maxLength={4}
                        />
                        <TouchableOpacity style={styles.incrementReduceButtonContainer} onPress={handlePlusSecondTypeButton}>
                            <Text style={{ fontSize: 35, textAlign: 'center', lineHeight: 40, }}> + </Text>
                        </TouchableOpacity>
                    </View>
                    <View style={styles.typeTextContainer}>
                        <Text style={{ fontSize: 15, color: 'hsla(0,0%,0%, 0.75)' }}>{type.type2}</Text>
                    </View>
                </>
            );
        } else if (type.type1 === 'time' && type.type2 === 'km') {
            return (
                <>
                    <View style={{ justifyContent: 'center', alignItems: 'center', flexDirection: 'row' }}>
                        <View style={{ justifyContent: 'center', alignItems: 'center' }}>
                            <TextInput
                                style={styles.inputTimeContainer}
                                onChangeText={(text) => onTimeChange(text, 'hours')}
                                value={timeValues.hours}
                                keyboardType='numeric'
                                maxLength={2}
                            />
                            <Text style={{ fontSize: 15, color: 'hsla(0,0%,0%, 0.75)' }}>h</Text>
                        </View>
                        <View style={{ justifyContent: 'center', alignItems: 'center' }}>
                            <TextInput
                                style={styles.inputTimeContainer}
                                onChangeText={(text) => onTimeChange(text, 'minutes')}
                                value={timeValues.minutes}
                                keyboardType='numeric'
                                maxLength={2}
                            />
                            <Text style={{ fontSize: 15, color: 'hsla(0,0%,0%, 0.75)' }}>min</Text>
                        </View>
                        <View style={{ justifyContent: 'center', alignItems: 'center' }}>
                            <TextInput
                                style={styles.inputTimeContainer}
                                onChangeText={(text) => onTimeChange(text, 'seconds')}
                                value={timeValues.seconds}
                                keyboardType='numeric'
                                maxLength={2}
                            />
                            <Text style={{ fontSize: 15, color: 'hsla(0,0%,0%, 0.75)' }}>s</Text>
                        </View>
                    </View>
                    <View style={{ justifyContent: 'center', alignItems: 'center', }}>
                        <TextInput
                            style={styles.inputTimeContainer}
                            onChangeText={onDistaneChange}
                            value={typeValue.type2}
                            keyboardType='numeric'
                            maxLength={5}
                        />
                    </View>
                    <View style={styles.typeTextContainer}>
                        <Text style={{ fontSize: 15, color: 'hsla(0,0%,0%, 0.75)' }}>{type.type2}</Text>
                    </View>
                </>
            );
        } else if (type.type1 === 'kg' && type.type2 === 'km') {
            return (
                <>
                    <View style={styles.typeContainer}>
                        <TouchableOpacity style={styles.incrementReduceButtonContainer} onPress={handleMinusFirstTypeButton}>
                            <Text style={{ fontSize: 35, textAlign: 'center', lineHeight: 40, }}> - </Text>
                        </TouchableOpacity>
                        <TextInput
                            style={styles.inputContainer}
                            onChangeText={onFirstTypeChange}
                            value={typeValue.type1}
                            keyboardType='numeric'
                            maxLength={4}
                        />
                        <TouchableOpacity style={styles.incrementReduceButtonContainer} onPress={handlePlusFirstTypeButton}>
                            <Text style={{ fontSize: 35, textAlign: 'center', lineHeight: 40 }}> + </Text>
                        </TouchableOpacity>
                    </View>
                    <View style={styles.typeTextContainer}>
                        <Text style={{ fontSize: 15, color: 'hsla(0,0%,0%, 0.75)' }}>{type.type1}</Text>
                    </View>
                    <View style={{ justifyContent: 'center', alignItems: 'center', }}>
                        <TextInput
                            style={styles.inputTimeContainer}
                            onChangeText={onDistaneChange}
                            value={typeValue.type2}
                            keyboardType='numeric'
                            maxLength={4}
                        />
                    </View>
                    <View style={styles.typeTextContainer}>
                        <Text style={{ fontSize: 15, color: 'hsla(0,0%,0%, 0.75)' }}>{type.type2}</Text>
                    </View>
                </>
            );
        }

        return null;
    };

    useEffect(() => {
        setEditMode(false);
        selectedSeriesId.current = null;
        const fetchExercise = async () => {
            const fetchedExerciseData = await getItem(['exercise', exerciseName]);
            const fetchedWorkoutData = await getItem(['workout', format(chosenDate.currentDate, 'dd-MM-yyyy')]);
            const fetchedHistoryData = await getItem(['workout', exerciseName]);
            const fetchedType = fetchedExerciseData.type.split(' - ');
            const existingExercise = fetchedWorkoutData?.[exerciseName]?.series;
            
            if (fetchedHistoryData) {
                const sortedData = Object.entries(fetchedHistoryData)
                    .sort((a, b) => new Date(b[0]) - new Date(a[0]))
                    .reduce((obj, [key, value]) => {
                        obj[key] = value;
                        return obj;
                    }, {});
                setExerciseHistoryData(sortedData ?? []);
            }

            setSeries(existingExercise ?? []);
            setExerciseData(fetchedWorkoutData ?? null);

            setType({ type1: fetchedType[0], type2: fetchedType[1] })
        }

        if (isFocused) {
            fetchExercise();
        }
    }, [isFocused])

    return (
        <SafeAreaView style={styles.container}>
            <View style={styles.trackHistoryContainer}>
                <TouchableOpacity onPress={handleContentTodayChange} style={{ justifyContent: 'center', alignItems: 'center' }}>
                    <WorkoutLogSVG height={32} width={32} fill={todaySelected ? '#006EE6' : 'hsla(0,0%,0%, 0.35)'} />
                    <Text style={todaySelected ? { color: '#006EE6' } : { color: 'hsla(0,0%,0%, 0.35)' }}>
                        Today
                    </Text>
                </TouchableOpacity>
                <TouchableOpacity onPress={handleContentAllTimeChange} style={{ justifyContent: 'center', alignItems: 'center' }}>
                    <CalendarSVG height={32} width={32} fill={todaySelected ? 'hsla(0,0%,0%, 0.35)' : '#006EE6'} />
                    <Text style={todaySelected ? { color: 'hsla(0,0%,0%, 0.35)' } : { color: '#006EE6' }}>
                        All time
                    </Text>
                </TouchableOpacity>
            </View>
            {trackContent === 'today' ? (
                <View style={{ flex: 1 }}>
                    {renderInputsBasedOnType()}
                    <View style={styles.saveEditButtonContainer}>
                        {editMode ? (
                            <View style={{ flexDirection: 'row', justifyContent: 'center', alignItems: 'center', gap: 25 }}>
                                <View style={styles.saveEditButton}>
                                    <TouchableOpacity onPress={handleUpdateButton}>
                                        <Text style={{ fontSize: 20, textAlign: 'center', color: 'white' }}>Update</Text>
                                    </TouchableOpacity>
                                </View>
                                <View style={styles.deleteButton}>
                                    <TouchableOpacity onPress={handleDeleteButton}>
                                        <Text style={{ fontSize: 20, textAlign: 'center', color: 'white' }}>Delete</Text>
                                    </TouchableOpacity>
                                </View>
                            </View>
                        ) : (
                            <TouchableOpacity style={styles.saveEditButton} onPress={handleSaveButton}>
                                <Text style={{ fontSize: 20, textAlign: 'center', color: 'white' }}>Save</Text>
                            </TouchableOpacity>
                        )}
                    </View>

                    <View style={styles.seriesTextContainer}>
                        <Text style={{ fontSize: 20, fontFamily: 'Inter_700Bold', color: '#006EE6' }}>Series:</Text>
                    </View>
                    <ScrollView>
                        {
                            series.map((element, index) => (
                                <TouchableOpacity
                                    key={element.id}
                                    style={element.id === selectedSeriesId.current ? styles.selectedSeriesContainer : styles.seriesContainer(index)}
                                    onPress={() => { handleEditMode(element.id) }}
                                >
                                    <Text style={[styles.seriesText, { paddingLeft: 30 }]}>{`${index + 1}`}</Text>
                                    {type.type1 === 'time' ? (
                                        <Text style={[styles.seriesText, { paddingRight: 30 }]}>
                                            {`${element[type.type2]} ${type.type2}  ${parseFloat(element[type.type1]) < 1 ? element[type.type1] * 60 + ' seconds' : element[type.type1] + ' min'
                                                }`}
                                        </Text>
                                    ) : (
                                        <Text style={[styles.seriesText, { paddingRight: 30 }]}>{`${element[type.type1]} ${type.type1} x ${element[type.type2]} ${type.type2}`}</Text>
                                    )}
                                </TouchableOpacity>
                            ))
                        }

                    </ScrollView>
                </View>
            ) : (
                <View style={{ justifyContent: 'center', alignItems: 'center', flex: 1 }}>
                    <ScrollView>
                        {
                            Object.keys(exerciseHistoryData).map((date, index) => (
                                <View key={index} style={styles.allTimeContainer}>
                                    <Text style={{ fontSize: 20, borderBottomWidth: 2, borderBottomColor: '#006EE6', backgroundColor: 'white' }}>{date}</Text>
                                    {exerciseHistoryData[date].map((series, seriesIndex) => (
                                        <View key={series.id} style={styles.allTimeSeriesContainer}>
                                            <Text style={[styles.seriesText, { paddingLeft: 30 }]}>Series {seriesIndex + 1}</Text>
                                            {type.type1 === 'time' ? (
                                                <Text style={[styles.seriesText, { paddingRight: 30 }]}>
                                                    {`${series?.[type.type2]} ${type.type2}  ${parseFloat(series?.[type.type1]) < 1 ? series?.[type.type1] * 60 + ' seconds' : series?.[type.type1] + ' min'
                                                        }`}
                                                </Text>
                                            ) : (
                                                <Text style={[styles.seriesText, { paddingRight: 30 }]}>{`${series?.[type.type1]} ${type.type1} x ${series?.[type.type2]} ${type.type2}`}</Text>
                                            )}
                                        </View>
                                    ))}
                                </View>
                            ))
                        }
                    </ScrollView>
                </View>
            )}
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
        gap: 55,
        paddingBottom: 15,
    },
    typeContainer: {
        paddingBottom: 0,
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
        gap: 40,
    },
    incrementReduceButtonContainer: {
        height: 40,
        width: 40,
        backgroundColor: 'hsla(0,0%,0%, 0.10)',
        borderRadius: 20,
        justifyContent: 'center',
        alignItems: 'center',
    },
    typeTextContainer: {
        justifyContent: 'center',
        alignItems: 'center',
        paddingBottom: 10,
    },
    typeTimeTextContainer: {
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
        paddingBottom: 10,
    },
    inputContainer: {
        height: 60,
        width: 120,
        textAlign: 'center',
        fontSize: 30,
    },
    inputTimeContainer: {
        height: 60,
        width: 120,
        textAlign: 'center',
        borderBottomWidth: 1,
        borderRadius: 5,
        fontSize: 30,
    },
    saveEditButtonContainer: {
        justifyContent: 'center',
        alignItems: 'center',
        paddingTop: 15,
    },
    saveEditButton: {
        borderRadius: 15,
        backgroundColor: '#006EE6',
        width: 120,
        height: 45,
        justifyContent: 'center',
        alignItems: 'center',
    },
    deleteButton: {
        borderRadius: 15,
        backgroundColor: 'red',
        width: 120,
        height: 45,
        justifyContent: 'center',
        alignItems: 'center',
    },
    seriesTextContainer: {
        paddingTop: 15,
        borderBottomWidth: 2,
        borderBottomColor: '#006EE6',
    },
    seriesContainer: index => ({
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        padding: 8,
        borderRadius: 15,
        backgroundColor: index % 2 === 0 ? 'white' : 'hsla(0, 0%, 90%, 1)',
    }),
    selectedSeriesContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        padding: 12,
        borderWidth: 2,
        borderRadius: 15,
        borderColor: '#006EE6',
    },
    seriesText: {
        color: 'hsla(0,0%,0%, 0.85)',
        fontSize: 18,
    },
    allTimeContainer: {
        width: 360,
        borderWidth: 2,
        borderRadius: 8,
        borderColor: 'white',
        marginBottom: 10,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.25,
        shadowRadius: 3.84,
        elevation: 5,
    },
    allTimeSeriesContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        padding: 8,
        backgroundColor: 'white'
    },
})