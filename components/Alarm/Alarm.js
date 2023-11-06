
import {
    Platform,
    Text,
    Vibration,
    View,
    SafeAreaView,
    StyleSheet,
    TouchableOpacity,
    TextInput,
} from 'react-native';
import CheckBox from '../CheckBox';
import { createContext, useContext, useEffect, useState } from 'react';
import { useAlarm } from './AlarmContext';

export default function Alarm() {

    const [status, setStatus] = useState('stopped');
    const [vibration, setVibration] = useState(true);
    const [autoStart, setAutoStart] = useState(true);
    const [timeAmount, setTimeAmount] = useState('5');
    const alarm = useAlarm();

    const ONE_SECOND_IN_MS = 1000;

    const onTimeAmountChange = (text) => {
        setTimeAmount(text.replace(/[,.\-\s]/, ''))
    }

    const increaseAmount = () => {
        const timeInt = Number(timeAmount) + 10;
        const timeString = timeInt.toString()
        setTimeAmount(timeString)
    };

    const decreaseAmount = () => {
        const timeInt = Number(timeAmount) - 10;
        if (timeInt < 0) {
            const zero = 0;
            setTimeAmount(zero.toString());
        } else {
            const timeString = timeInt.toString();
            setTimeAmount(timeString);
        }
    };

    const startTimer = () => {
        alarm.start(Number(timeAmount));
        
        // const timeInSeconds = Number(timeAmount);
        // remainingTime = timeInSeconds;
        // setStatus('running');
    }

    const stopTimer = () => {
        remainingTime = null;
        setStatus('stopped');
    }

    // useEffect(() => {

    //     const numToString = (number) =>{
    //         return number.toString()
    //     }

    //     if (status === 'running' && remainingTime > 0) {
    //         const timer = setInterval(() => {
    //             remainingTime = remainingTime - 1;
    //             setTimeAmount((prevTime) => numToString(prevTime - 1));
    //         }, ONE_SECOND_IN_MS);

    //         return () => {
    //             clearInterval(timer);
    //             if (vibration) {
    //                 Vibration.vibrate(PATTERN, true);
    //             }
    //         };
    //     } else if (status === 'running' && remainingTime === 0) {
    //         remainingTime = null;
    //         setStatus('stopped');
    //         if (vibration) {
    //             Vibration.vibrate(PATTERN, true);
    //         }
    //     }
    // }, [status, remainingTime, vibration])

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
                        onChangeText={(text) => onTimeAmountChange(text)}
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
                        onPress={() => setVibration(!vibration)}
                        title="Vibration"
                        isChecked={vibration}
                    />
                    <CheckBox
                        onPress={() => setAutoStart(!autoStart)}
                        title="Auto start"
                        isChecked={autoStart}
                    />
                </View>
                <View style={{ alignItems: 'center', justifyContent: 'center', padding: 10 }}>
                    {status === 'stopped' ? (
                        <TouchableOpacity style={styles.startButtonContainer} onPress={startTimer}>
                            <Text style={styles.startTextContainer}>
                                Start
                            </Text>
                        </TouchableOpacity>
                    ): (
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