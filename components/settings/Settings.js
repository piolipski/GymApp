import {
    View,
    ScrollView,
    TouchableOpacity,
    StyleSheet,
    StatusBar,
    Platform,
    SafeAreaView,
    Modal,
    Pressable,
} from 'react-native';
import React, { useEffect, useState } from 'react';
import { Text } from '../Text.js';
import RightArrowSVG from '../../images/RightArrowSVG.svg';
import AlarmSVG from '../../images/AlarmSVG.svg';
import Alarm from '../alarm/Alarm.js';
import { useNavigation, useIsFocused } from '@react-navigation/native';
import { getAllExercises, getAllRoutinesWithNames, getItem, setItem, getAllWorkoutsWithDates, synchronizeTrainingLog, synchronizeRoutine, synchronizeExercise, synchronizeHistoryOfExercise, getAllWorkouts } from '../database/DataStorage.js';

const paddingTop = Platform.OS === 'android' ? StatusBar.currentHeight : 0;

export default function Settings() {

    const isFocused = useIsFocused();

    const navigation = useNavigation();
    const [unitSystem, setUnitSystem] = useState('');
    const [distanceSystem, setDistanceSystem] = useState('');
    const [modalVisible, setModalVisible] = useState(false);

    const setKg = async () => {
        if (unitSystem === 'lbs') {
            const fetchedTrainingLogData = await getAllWorkoutsWithDates();
            console.log(JSON.stringify(fetchedTrainingLogData))
            const trainingLogWeightAfterUnitChange = fetchedTrainingLogData.map((dateEntry) => {
                const updatedDateEntry = {};
                for (const [date, exerciseDetails] of Object.entries(dateEntry)) {
                    updatedDateEntry[date] = {};
                    for (const [exerciseName, exerciseData] of Object.entries(exerciseDetails)) {
                        updatedDateEntry[date][exerciseName] = {
                            series: exerciseData.series.map((seriesItem) => {
                                console.log(exerciseData.series);
                                if ('weight' in seriesItem) {
                                    return {
                                        ...seriesItem,
                                        weight: seriesItem.weight !== null ? ((parseFloat(seriesItem.weight) * 0.45359237).toFixed(2)).toString() : null,
                                    };
                                }
                                return seriesItem;
                            }),
                        };
                    }
                }
                return updatedDateEntry;
            });
            await Promise.all(
                trainingLogWeightAfterUnitChange.map(async (entry) => {
                    for (const dateKey in entry) {
                        await setItem(['workout', dateKey], entry?.[dateKey]);
                    }
                })
            );
        }
        setUnitSystem('kg');
        await setItem(['key', 'weight'], 'kg');
    }
    const setLbs = async () => {
        if (unitSystem === 'kg') {
            const fetchedTrainingLogData = await getAllWorkoutsWithDates();
            const trainingLogWeightAfterUnitChange = fetchedTrainingLogData.map((dateEntry) => {
                const updatedDateEntry = {};
                for (const [date, exerciseDetails] of Object.entries(dateEntry)) {
                    updatedDateEntry[date] = {};
                    for (const [exerciseName, exerciseData] of Object.entries(exerciseDetails)) {
                        updatedDateEntry[date][exerciseName] = {
                            series: exerciseData.series.map((seriesItem) => {
                                if ('weight' in seriesItem) {
                                    return {
                                        ...seriesItem,
                                        weight: seriesItem.weight !== null ? ((parseFloat(seriesItem.weight) * 2.20462262).toFixed(2)).toString() : null,
                                    };
                                }
                                return seriesItem;
                            }),
                        };
                    }
                }
                return updatedDateEntry;
            });
            await Promise.all(
                trainingLogWeightAfterUnitChange.map(async (entry) => {
                    for (const dateKey in entry) {
                        await setItem(['workout', dateKey], entry?.[dateKey]);
                    }
                })
            );

        }
        setUnitSystem('lbs');
        await setItem(['key', 'weight'], 'lbs');
    }
    const setKm = async () => {
        if (distanceSystem === 'miles') {
            const fetchedTrainingLogData = await getAllWorkoutsWithDates();
            console.log(JSON.stringify(fetchedTrainingLogData));

            const trainingLogDistanceAfterUnitChange = fetchedTrainingLogData.map((dateEntry) => {
                const updatedDateEntry = {};
                for (const [date, exerciseDetails] of Object.entries(dateEntry)) {
                    updatedDateEntry[date] = {};
                    for (const [exerciseName, exerciseData] of Object.entries(exerciseDetails)) {
                        updatedDateEntry[date][exerciseName] = {
                            series: exerciseData.series.map((seriesItem) => {
                                if ('distance' in seriesItem) {
                                    return {
                                        ...seriesItem,
                                        distance: seriesItem.distance !== null ? ((parseFloat(seriesItem.distance) * 1.609344).toFixed(2)).toString() : null,
                                    };
                                }
                                return seriesItem;
                            }),
                        };
                    }
                }
                return updatedDateEntry;
            });
            await Promise.all(
                trainingLogDistanceAfterUnitChange.map(async (entry) => {
                    for (const dateKey in entry) {
                        await setItem(['workout', dateKey], entry?.[dateKey]);
                    }
                })
            );

        }
        setDistanceSystem('km');
        await setItem(['key', 'distance'], 'km');
    }
    const setMiles = async () => {
        if (distanceSystem === 'km') {
            const fetchedTrainingLogData = await getAllWorkoutsWithDates();
            console.log(JSON.stringify(fetchedTrainingLogData));
            const trainingLogDistanceAfterUnitChange = fetchedTrainingLogData.map((dateEntry) => {
                const updatedDateEntry = {};
                for (const [date, exerciseDetails] of Object.entries(dateEntry)) {
                    updatedDateEntry[date] = {};
                    for (const [exerciseName, exerciseData] of Object.entries(exerciseDetails)) {
                        updatedDateEntry[date][exerciseName] = {
                            series: exerciseData.series.map((seriesItem) => {
                                if ('distance' in seriesItem) {
                                    return {
                                        ...seriesItem,
                                        distance: seriesItem.distance !== null ? ((parseFloat(seriesItem.distance) * 0.621371192).toFixed(2)).toString() : null,
                                    };
                                }
                                return seriesItem;
                            }),
                        };
                    }
                }
                return updatedDateEntry;
            });
            await Promise.all(
                trainingLogDistanceAfterUnitChange.map(async (entry) => {
                    for (const dateKey in entry) {
                        await setItem(['workout', dateKey], entry?.[dateKey]);
                    }
                })
            );

        }
        setDistanceSystem('miles');
        await setItem(['key', 'distance'], 'miles');
    }

    //app dark mode
    const [darkMode, setDarkMode] = useState(false);

    const setDarkModeOn = () => { setDarkMode(true); }
    const setDarkModeOff = () => { setDarkMode(false); }

    const handleLoginButton = () => {
        navigation.navigate('Login');
    }
    const handleRegisterButton = () => {
        navigation.navigate('Register');
    }

    const parseTrainingLogData = (input, typeOfWeight, typeOfDistance) => {
        const formatDate = (date) => {
            const d = new Date(date);
            const day = String(d.getDate()).padStart(2, '0');
            const month = String(d.getMonth() + 1).padStart(2, '0');
            const year = String(d.getFullYear());
            return `${day}-${month}-${year}`;
        };

        const transformedData = {};

        input.forEach(({ date, exerciseDetails }) => {
            const formattedDate = formatDate(date);
            transformedData[formattedDate] = {};

            exerciseDetails.forEach(({ name, sets }) => {
                transformedData[formattedDate][name] = { series: [] };

                sets.forEach(({ _id, weight, reps, time, distance, ...rest }) => {
                    const id = new Date().getTime() + Math.floor(Math.random() * 1000);
                    const cleanedWeight = weight !== null ? (typeOfWeight === 'lbs' ? (parseFloat(weight) * 2.20).toString() : weight.toString()) : null;
                    const cleanedDistance = distance !== null ? (typeOfDistance === 'miles' ? (distance * 0.621).toString() : distance.toString()) : null;
                    const repsToString = reps !== null ? reps.toString() : null;
                    const timeToString = time !== null ? time.toString() : null;
                    const cleanData = Object.fromEntries(
                        Object.entries({ ...rest, weight: cleanedWeight, reps: repsToString, distance: cleanedDistance, time: timeToString }).filter(([_, value]) => value !== null)
                    );
                    transformedData[formattedDate][name].series.push({ id, ...cleanData });
                });
            });
        });

        return Object.entries(transformedData).map(([date, details]) => ({
            [date]: details,
        }));
    };

    const parseRoutineData = (data) => {
        const parsedData = data.map((item) => {
            const obj = {};
            obj[item.name] = item.exercise.map((exercise) => {
                const { _id, ...rest } = exercise;
                return { ...rest };
            });
            return obj;
        });
        return parsedData;
    };

    const parseExerciseData = (data) => {
        return data.map((item) => {
            const { _id, ...rest } = item;
            return { ...rest };
        });
    };

    const handleSaveDataToServer = async () => {
        const trainingLog = await getAllWorkoutsWithDates();
        const exercises = await getAllExercises();
        const routines = await getAllRoutinesWithNames();

        try {
            const token = await getItem(['token', 'key']);
            const response = await fetch('http://10.0.2.2:3000/update', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`,
                },
                body: JSON.stringify({ trainingLog: trainingLog, exercise: exercises, routine: routines }),
            });
            const data = await response.json();
            console.log(data);
            console.log(response.ok)

            if (response.ok) {
                console.log('jest git')
            } else {
                console.log('oj cos jest nie tak')
            }
        } catch (error) {
            console.error('Error:', error);
        }
    }
    const handleExportDataFromServer = async () => {
        const typeOfWeight = await getItem(['key', 'weight']);
        try {
            const token = await getItem(['token', 'key']);
            const response = await fetch('http://10.0.2.2:3000/get', {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`,
                },
            });
            const data = await response.json();
            console.log(response.ok)

            if (response.ok) {
                console.log('jest git')
                const transformedTrainingLogData = parseTrainingLogData(data.trainingLog, typeOfWeight);
                const transformedRoutineData = parseRoutineData(data.routine);
                const transformedExerciseData = parseExerciseData(data.exercise);
                await synchronizeTrainingLog(transformedTrainingLogData);
                await synchronizeHistoryOfExercise(transformedTrainingLogData);
                await synchronizeRoutine(transformedRoutineData);
                await synchronizeExercise(transformedExerciseData);
            } else {
                console.log('oj cos jest nie tak')
            }
        } catch (error) {
            console.error('Error:', error);
        }
    }

    useEffect(() => {

        const fetchData = async () => {
            const fetchedWeight = await getItem(['key', 'weight']);
            const fetchedDistance = await getItem(['key', 'distance']);
            setUnitSystem(fetchedWeight);
            setDistanceSystem(fetchedDistance);
        }

        if (isFocused) {
            fetchData();
        }

    }, [isFocused])


    return (
        <SafeAreaView style={styles.safeAreaView}>
            <ScrollView style={styles.scrollView}>
                <Text style={styles.settingsCategory}>Units</Text>
                <View style={styles.container}>
                    <View style={styles.button}>
                        <TouchableOpacity onPress={setKg} style={styles.touch}>
                            <Text style={[styles.buttonText, unitSystem === 'kg' ? styles.activeText : null]}>kg</Text>
                        </TouchableOpacity>
                        <TouchableOpacity onPress={setLbs} style={styles.touch}>
                            <Text style={[styles.buttonText, unitSystem === 'lbs' ? styles.activeText : null]}>lbs</Text>
                        </TouchableOpacity>
                    </View>
                    <View style={styles.button}>
                        <TouchableOpacity onPress={setKm} style={styles.touch}>
                            <Text style={[styles.buttonText, distanceSystem === 'km' ? styles.activeText : null]}>km</Text>
                        </TouchableOpacity>
                        <TouchableOpacity onPress={setMiles} style={styles.touch}>
                            <Text style={[styles.buttonText, distanceSystem === 'miles' ? styles.activeText : null]}>miles</Text>
                        </TouchableOpacity>
                    </View>
                </View>
                <Text style={styles.settingsCategory}>Account</Text>
                <View style={[styles.container, { gap: 0, paddingTop: 0 }]}>
                    <View style={styles.profileButton}>
                        <TouchableOpacity style={styles.profileTouch} onPress={handleLoginButton}>
                            <Text style={styles.profileText}>Login</Text>
                            <RightArrowSVG height={13} width={13} />
                        </TouchableOpacity>
                    </View>
                    <View style={[styles.profileButton, { borderBottomWidth: 0, paddingBottom: 0 }]}>
                        <TouchableOpacity style={styles.profileTouch} onPress={handleRegisterButton}>
                            <Text style={styles.profileText}>Register</Text>
                            <RightArrowSVG height={13} width={13} />
                        </TouchableOpacity>
                    </View>
                </View>
                <Text style={styles.settingsCategory}>Application settings</Text>
                <View style={styles.container}>
                    <Modal
                        animationType="fade"
                        transparent={true}
                        visible={modalVisible}
                        onRequestClose={() => {
                            setModalVisible(!modalVisible);
                        }}>
                        <Pressable
                            style={styles.modalContainer}
                            onPress={(event) => event.currentTarget === event.target && setModalVisible(false)}>
                            <Alarm />
                        </Pressable>
                    </Modal>
                    <TouchableOpacity
                        style={styles.profileTouch}
                        onPress={() => setModalVisible(true)}>
                        <Text style={{ fontSize: 16 }}> Alarm settings</Text>
                    </TouchableOpacity>
                </View>
                <View style={{ justifyContent: 'center', alignItems: 'center' }}>
                    <Text style={{ fontSize: 20 }}>Synchronize data</Text>
                </View>
                <View
                    style={{ justifyContent: 'center', alignItems: 'center', flexDirection: 'row', }}
                >
                    <TouchableOpacity
                        style={styles.profileTouch}
                        onPress={handleSaveDataToServer}
                    >
                        <Text style={{ fontSize: 16 }}>Save data to database</Text>
                    </TouchableOpacity>
                    <TouchableOpacity
                        style={styles.profileTouch}
                        onPress={handleExportDataFromServer}
                    >
                        <Text style={{ fontSize: 16 }}>Export data from database</Text>
                    </TouchableOpacity>
                </View>
            </ScrollView>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    safeAreaView: {
        flex: 1,
    },
    container: {
        padding: 20,
        gap: 25,
        borderBottomWidth: 1,
        borderColor: 'hsla(0,0%,0%, 0.35)'
    },
    button: {
        backgroundColor: 'white',
        flexDirection: 'row',
        borderWidth: 1,
        borderColor: 'hsla(0,0%,0%, 0.35)'
    },
    buttonText: {
        textAlign: 'center',
        fontWeight: 'bold',
        padding: 10,
        fontSize: 18
    },
    activeText: {
        color: 'white',
        backgroundColor: '#006EE6',
    },
    touch: {
        flexGrow: 1,
        flexBasis: 0,
    },
    settingsCategory: {
        color: 'hsla(0,0%,0%, 0.75)',
        paddingHorizontal: 20,
        paddingTop: 15,
        fontSize: 14
    },
    profileTouch: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        padding: 10
    },
    profileButton: {
        borderBottomWidth: 1,
        paddingVertical: 15,
        borderColor: 'hsla(0,0%,0%, 0.5)'
    },
    profileText: {
        fontSize: 16,
    },
    modalContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: 'rgba(0,0,0,0.5)'
    }
});