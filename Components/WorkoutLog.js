import { View, Text, TouchableOpacity, StyleSheet, StatusBar, Platform, SafeAreaView } from 'react-native';
import LogoSVG from '../Images/GYMAPP.svg';
import CalendarSVG from '../Images/CalendarSVG.svg';
import NewWorkoutSVG from '../Images/NewWorkoutSVG.svg';
import StartRoutineSVG from '../Images/StartRoutineSVG.svg';
import LeftArrowSVG from '../Images/LeftArrowSVG.svg';
import RightArrowSVG from '../Images/RightArrowSVG.svg';

const paddingTop = Platform.OS === 'android' ? StatusBar.currentHeight : 0;

export default function WorkoutLog() {

    return (
        <SafeAreaView style={styles.container}>
            <View style={styles.logoContainer}>
                <LogoSVG height={63} width={231} />
            </View>
            <View style={styles.dateContainer}>
                <TouchableOpacity style={styles.arrowContainer}>
                    <LeftArrowSVG height={13} width={8} />
                </TouchableOpacity>
                <Text style={{
                    paddingHorizontal: 30,
                    fontSize: 40,
                    color: '#006EE6',
                    fontWeight: 'bold',
                }}>
                    TODAY
                </Text>
                <TouchableOpacity style={styles.arrowContainer}>
                    <RightArrowSVG height={13} width={8} />
                </TouchableOpacity>
            </View>
            <View style={styles.calendarContainer}>
                <Text style={{ fontSize: 16 }}>
                    Calendar
                </Text>
                <TouchableOpacity style={styles.calendarButtonContainer} >
                    <Text style={{ flexGrow: 1, color:'hsla(0,0%,0%, 0.60)' }}>Open calendar view</Text>
                    <CalendarSVG height={21} width={19} color='#006EE6' />
                </TouchableOpacity>
            </View>
            <View style={styles.workoutContainer}>
                <Text style={{ fontSize: 16 }}>
                    Workout
                </Text>
                <View style={{ flexDirection: 'row', gap: 15 }}>
                    <TouchableOpacity style={styles.workoutButtonContainer}>
                        <NewWorkoutSVG />
                        <Text style={{color:'hsla(0,0%,0%, 0.60)'}}>Start New Workout</Text>
                    </TouchableOpacity>
                    <TouchableOpacity style={styles.workoutButtonContainer}>
                        <StartRoutineSVG />
                        <Text style={{color:'hsla(0,0%,0%, 0.60)'}}>From Routine</Text>
                    </TouchableOpacity>
                </View>
            </View>
        </SafeAreaView>
    )
}

const styles = StyleSheet.create({
    container: {
        paddingTop,
        flexGrow: 1,
    },
    logoContainer: {
        marginTop: 35,
        alignItems: 'center',
    },
    dateContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
    },
    arrowContainer: {
        borderWidth: 1,
        borderColor: 'white',
        backgroundColor: 'hsla(0,0%,0%, 0.10)',
        borderRadius: 100,
        padding: 10,
    },
    calendarContainer: {
        marginTop: 50,
        justifyContent: 'center',
        paddingHorizontal: 32,
        gap: 5,
    },
    calendarButtonContainer: {
        borderWidth: 1,
        padding: 16,
        borderColor: 'hsla(0,0%,0%, 0.35)',
        borderRadius: 5,
        flexDirection: 'row',
        alignItems: 'center',
    },
    workoutContainer: {
        marginTop: 32,
        justifyContent: 'center',
        paddingHorizontal: 32,
        gap: 5,
    },
    workoutButtonContainer: {
        borderWidth: 1,
        paddingHorizontal: 8,
        paddingVertical: 32,
        borderColor: 'hsla(0,0%,0%, 0.35)',
        borderRadius: 5,
        flexGrow: 1,
        flexBasis: 0,
        alignItems: 'center',
    },
});