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
import { getItem, setItem, getAllWorkoutsWithDates, synchronizeTrainingLog, synchronizeRoutine, synchronizeExercise, synchronizeHistoryOfExercise, getAllWorkouts } from '../database/DataStorage.js';

export default function Settings() {

    const isFocused = useIsFocused();

    const navigation = useNavigation();
    const [unitSystem, setUnitSystem] = useState('');
    const [distanceSystem, setDistanceSystem] = useState('');
    const [modalVisible, setModalVisible] = useState(false);

    const setKg = async () => {
        setUnitSystem('kg');
        await setItem(['key', 'weight'], 'kg');
    }

    const setLbs = async () => {
        setUnitSystem('lbs');
        await setItem(['key', 'weight'], 'lbs');
    }
    const setKm = async () => {
        setDistanceSystem('km');
        await setItem(['key', 'distance'], 'km');
    }
    const setMiles = async () => {
        setDistanceSystem('miles');
        await setItem(['key', 'distance'], 'miles');
    }

    //app dark mode
    const [darkMode, setDarkMode] = useState(false);

    const setDarkModeOn = () => { setDarkMode(true); }
    const setDarkModeOff = () => { setDarkMode(false); }

    const handleProfileButton = () => {
        navigation.navigate('ProfileTab');
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
                    <TouchableOpacity style={styles.profileTouch} onPress={handleProfileButton}>
                        <Text style={styles.profileText}>Profile</Text>
                        <RightArrowSVG height={13} width={13} />
                    </TouchableOpacity>
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