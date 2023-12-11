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
    Alert
} from 'react-native';
import React, { useEffect, useState } from 'react';
import { Text } from '../../Text.js';
import RightArrowSVG from '../../../images/RightArrowSVG.svg';
import AccountSVG from '../../../images/AccountSVG.svg';
import { useNavigation, useIsFocused } from '@react-navigation/native';
import { getAllExercises, getAllRoutinesWithNames, getItem, setItem, getAllWorkoutsWithDates, synchronizeTrainingLog, synchronizeRoutine, synchronizeExercise, synchronizeHistoryOfExercise, getAllWorkouts } from '../../database/DataStorage.js';

export default function Profile() {

    const navigation = useNavigation();
    const isFocused = useIsFocused();

    const [isLoggedIn, setIsLoggedIn] = useState(false);

    const handleLoginButton = () => {
        navigation.navigate('Login');
    }

    const handleLogoutButton = async () => {
        await setItem(['key', 'token'], 'logout');
        setIsLoggedIn(false);
    };

    const handleChangePasswordButton = () => {
        navigation.navigate('Change Password');
    }

    const handleChangeEmailButton = () => {
        navigation.navigate('Change Email');
    }

    const handleDeteleAccountButton = () => {
        navigation.navigate('Delete Account');
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

    const handleExportDataToServer = async () => {
        const trainingLog = await getAllWorkoutsWithDates();
        const exercises = await getAllExercises();
        const routines = await getAllRoutinesWithNames();

        try {
            const token = await getItem(['key', 'token']);
            const response = await fetch('http://10.0.2.2:3000/saveToDatabase', {
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
                Alert.alert('Data exported to server successfully!');
            } else {
                console.log('oj cos jest nie tak')
            }
        } catch (error) {
            console.error('Error:', error);
        }
    }
    const handleDownloadDataFromServer = async () => {
        const typeOfWeight = await getItem(['key', 'weight']);
        try {
            const token = await getItem(['key', 'token']);
            const response = await fetch('http://10.0.2.2:3000/getFromDatabase', {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`,
                },
            });
            const data = await response.json();
            console.log(response.ok)

            if (response.ok) {
                Alert.alert('Data downloaded from server successfully!');
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
            const token = await getItem(['key', 'token']);
            if (token === 'logout') {
                setIsLoggedIn(false);
            } else {
                setIsLoggedIn(true);
            }
        }

        if (isFocused) {
            fetchData();
        }

    }, [isFocused])

    return (
        <SafeAreaView style={styles.safeAreaView}>
            <View style={styles.accountIcon}>
                <AccountSVG height={125} width={125} fill={'#006EE6'} />
            </View>
            <View style={styles.container}>
                {isLoggedIn ? (
                    <View>
                        <TouchableOpacity style={styles.profileButton} onPress={handleLogoutButton}>
                            <Text style={styles.profileText}>Logout</Text>
                            <RightArrowSVG height={13} width={13} />
                        </TouchableOpacity>
                        <TouchableOpacity style={styles.profileButton} onPress={handleChangePasswordButton}>
                            <Text style={styles.profileText}>Change Password</Text>
                            <RightArrowSVG height={13} width={13} />
                        </TouchableOpacity>
                        <TouchableOpacity style={styles.profileButton} onPress={handleChangeEmailButton}>
                            <Text style={styles.profileText}>Change Email</Text>
                            <RightArrowSVG height={13} width={13} />
                        </TouchableOpacity>
                        <TouchableOpacity style={styles.profileButton} onPress={handleDeteleAccountButton}>
                            <Text style={styles.profileText}>Delete account</Text>
                            <RightArrowSVG height={13} width={13} />
                        </TouchableOpacity>
                    </View>
                ) : (
                    <TouchableOpacity style={styles.profileButton} onPress={handleLoginButton}>
                        <Text style={styles.profileText}>Login</Text>
                        <RightArrowSVG height={13} width={13} />
                    </TouchableOpacity>
                )}
                {isLoggedIn ? (
                    <View style={styles.dataSyncContainer}>
                        <Text style={styles.syncText}>Synchronize data</Text>
                        <View style={styles.syncButtons}>
                            <TouchableOpacity style={[styles.syncButton, { backgroundColor: '#006EE6', }]} onPress={handleExportDataToServer}>
                                <Text style={styles.syncButtonText}>Export</Text>
                                <Text style={styles.syncButtonText}>Data</Text>
                            </TouchableOpacity>
                            <TouchableOpacity style={[styles.syncButton, { backgroundColor: '#006EE6', }]} onPress={handleDownloadDataFromServer}>
                                <Text style={styles.syncButtonText}>Download</Text>
                                <Text style={styles.syncButtonText}>Data</Text>
                            </TouchableOpacity>
                        </View>
                    </View>
                ) : (
                    <View style={styles.dataSyncContainer}>
                        <Text style={styles.syncText}>Synchronize data</Text>
                        <View style={styles.syncButtons}>
                            <View style={[styles.syncButton, { backgroundColor: 'gray', }]} >
                                <Text style={styles.syncButtonText}>Export</Text>
                                <Text style={styles.syncButtonText}>Data</Text>
                            </View>
                            <View style={[styles.syncButton, { backgroundColor: 'gray', }]} >
                                <Text style={styles.syncButtonText}>Download</Text>
                                <Text style={styles.syncButtonText}>Data</Text>
                            </View>
                        </View>
                        <Text style={{ color: '#006EE6' }}>You have to be logged in</Text>
                    </View>
                )}
            </View>
        </SafeAreaView >
    )
}

const styles = StyleSheet.create({
    safeAreaView: {
        flex: 1,
        backgroundColor: '#fff', // Set your desired background color
    },
    accountIcon: {
        alignItems: 'center',
        marginTop: 20,
        marginBottom: 10,
    },
    container: {
        width: '100%',
        paddingHorizontal: 20,
        paddingBottom: 20,
        borderBottomWidth: 1,
        borderColor: 'hsla(0,0%,0%,0.35)',
    },
    profileButton: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingVertical: 15,
        borderBottomWidth: 1,
        borderColor: 'hsla(0,0%,0%,0.5)',
    },
    profileText: {
        fontSize: 18,
    },
    dataSyncContainer: {
        alignItems: 'center',
        marginVertical: 20,
        paddingHorizontal: 20,
    },
    syncText: {
        fontSize: 20,
        marginBottom: 10,
    },
    syncButton: {
        flex: 1,
        paddingVertical: 12,
        paddingHorizontal: 20,
        borderRadius: 8,
        marginBottom: 10,
        marginHorizontal: 5,
    },
    syncButtons: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        width: '100%',
    },
    syncButtonText: {
        fontSize: 16,
        color: '#fff',
        textAlign: 'center',
    },
});