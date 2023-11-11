
import {
    Platform,
    Text,
    View,
    SafeAreaView,
    StyleSheet,
    TouchableOpacity,
    TextInput,
    Alert
} from 'react-native';
import CheckBox from '../CheckBox';
import { createContext, useCallback, useContext, useEffect, useState } from 'react';
import { useAlarm } from './AlarmContext';
import { editItem, getItem } from '../database/DataStorage';

export default function Alarm() {

    const alarm = useAlarm();
    // const [vibration, setVibration] = useState(null);
    // const [sound, setSound] = useState(null);
    // const [autoStart, setAutoStart] = useState(null);
    const timeAmount = alarm.seconds.toString();

    const vibrationChange = async () => {
        const boolean = !alarm.vibration;
        alarm.setVibration(boolean);
        await editItem(['key', 'vibration'], boolean);
    }
    const soundChange = async () => {
        const boolean = !alarm.sound;
        alarm.setSound(boolean);
        await editItem(['key', 'sound'], boolean);
    }
    const autoStartChange = async () => {
        const boolean = !alarm.autoStart;
        alarm.setAutoStart(boolean);
        await editItem(['key', 'autoStart'], boolean);
    }

    const increaseAmount = () => {
        alarm.stop();
        const increasedSeconds = alarm.seconds + 10;
        if (increasedSeconds > 999) {
            alarm.setSeconds(999);
        } else {
            alarm.setSeconds(increasedSeconds);
        }
    };

    const decreaseAmount = () => {
        alarm.stop();
        const decreasedSeconds = alarm.seconds - 10;
        if (decreasedSeconds < 0) {
            alarm.setSeconds(0);
        } else {
            alarm.setSeconds(decreasedSeconds);
        }
    };

    // useEffect(() => {
    //    async function fetchLocalData(){
    //         const vibrationBoolean = await getItem(['key', 'vibration']);
    //         const soundBoolean = await getItem(['key', 'sound']);
    //         const autoStartBoolean = await getItem(['key', 'autoStart']);
    //         setVibration(vibrationBoolean);
    //         setSound(soundBoolean);
    //         setAutoStart(autoStartBoolean);
    //     };
    //     fetchLocalData();
        
    // }, []);

    const startTimer = () => {
        if (timeAmount === '0') {
            Alert.alert('', 'Please enter duration for the timer', [
                { text: 'OK' },
            ]);
        } else {
            alarm.start(Number(timeAmount));
        }
    };

    const stopTimer = () => {
        remainingTime = null;
        alarm.stop();
    }

    return (
        <SafeAreaView style={styles.centeredView}>
            <View style={styles.container} >
                <Text style={styles.headerContainer}>
                    Rest Timer
                </Text>
                <View style={styles.amountContainer}>
                    <TouchableOpacity
                        style={styles.decreaseContainer}
                        onPress={() => decreaseAmount()}
                    >
                        <Text style={{ color: 'white', fontSize: 20 }}>
                            -
                        </Text>
                    </TouchableOpacity>
                    <TextInput
                        style={styles.inputContainer}
                        onChangeText={(text) => alarm.onSecondsChange(text)}
                        value={timeAmount}
                        keyboardType='numeric'
                        maxLength={3}
                    />
                    <TouchableOpacity
                        style={styles.increaseContainer}
                        onPress={() => increaseAmount()}
                    >
                        <Text style={{ color: 'white', fontSize: 20 }}>
                            +
                        </Text>
                    </TouchableOpacity>
                </View>
                <View style={styles.checkBoxContainer}>
                    <CheckBox
                        onPress={vibrationChange}
                        title="Vibration"
                        isChecked={alarm.vibration}
                    />
                    <CheckBox
                        onPress={soundChange}
                        title="Sound"
                        isChecked={alarm.sound}
                    />
                    <CheckBox
                        onPress={autoStartChange}
                        title="Auto start"
                        isChecked={alarm.autoStart}
                    />
                </View>
                <View style={{ alignItems: 'center', justifyContent: 'center', padding: 10 }}>
                    {alarm.status === 'stopped' ? (
                        <TouchableOpacity style={styles.startButtonContainer} onPress={startTimer}>
                            <Text style={styles.startTextContainer}>
                                Start
                            </Text>
                        </TouchableOpacity>
                    ) : (
                        <TouchableOpacity style={styles.startButtonContainer} onPress={stopTimer}>
                            <Text style={styles.startTextContainer}>
                                Stop
                            </Text>
                        </TouchableOpacity>
                    )}
                </View>
            </View>
        </SafeAreaView>
    )
}

const styles = StyleSheet.create({
    centeredView: {
        flex: 1,
        marginTop: '75%',
        width: '85%',
    },
    container: {
        borderWidth: 1,
        borderRadius: 6,
        backgroundColor: 'white',
        shadowColor: '#000',
        shadowOffset: {
            width: 0,
            height: 2,
        },
        shadowOpacity: 0.25,
        shadowRadius: 4,
        elevation: 5,
    },
    headerContainer: {
        borderBottomWidth: 1,
        borderColor: 'blue',
        fontSize: 18,
        padding: 10,
    },
    amountContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
    },
    increaseContainer: {
        left: 32,
        borderWidth: 0.5,
        height: 35,
        width: 35,
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: '#006EE6',
    },
    decreaseContainer: {
        right: 32,
        borderWidth: 0.5,
        height: 35,
        width: 35,
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: '#006EE6',
    },
    inputContainer: {
        height: 60,
        width: 120,
        borderBottomWidth: 1,
        textAlign: 'center',
        fontSize: 25,
    },
    checkBoxContainer: {
        paddingLeft: '33.9988%',
        alignItems: 'flex-start',
        justifyContent: 'center',
    },
    startButtonContainer: {
        alignItems: 'center',
        justifyContent: 'center',
        padding: 10,
        backgroundColor: '#006EE6',
        borderWidth: 1,
        borderColor: '#006EE6',
        borderRadius: 6,
        width: '45%',
    },
    startTextContainer: {
        fontSize: 18,
        color: 'white',
    }


})