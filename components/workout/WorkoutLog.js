import { View, TouchableOpacity, StyleSheet, StatusBar, Platform, SafeAreaView } from 'react-native';
import { Text } from '../Text.js';

import LogoSVG from '../../images/GYMAPP.svg';
import CalendarSVG from '../../images/CalendarSVG.svg';
import NewWorkoutSVG from '../../images/NewWorkoutSVG.svg';
import StartRoutineSVG from '../../images/StartRoutineSVG.svg';
import LeftArrowSVG from '../../images/LeftArrowSVG.svg';
import RightArrowSVG from '../../images/RightArrowSVG.svg';
import { useDate } from '../date/DateContext.js';

import { useState } from 'react';
import { format, addDays, subDays } from 'date-fns';

const paddingTop = Platform.OS === 'android' ? StatusBar.currentHeight : 0;

export default function WorkoutLog({ navigation }) {

    const date = useDate();

    const handleStartNewWorkoutButton = () => {
        navigation.navigate('ExercisesTab');
    }

    return (
        <SafeAreaView style={styles.container}>
            {/* <View style={styles.logoContainer}>
                <LogoSVG height={63} width={231} />
            </View> */}
            <View style={styles.dateContainer}>
                <TouchableOpacity style={[styles.arrowContainer, styles.leftArrowContainer]} onPress={date.handleGoToYesterday}>
                    <LeftArrowSVG height={13} width={13} />
                </TouchableOpacity>
                <Text style={styles.dateText}>
                    {date.whatDay()}
                </Text>
                <TouchableOpacity style={[styles.arrowContainer, styles.rightArrowContainer]} onPress={date.handleGoToTomorrow}>
                    <RightArrowSVG height={13} width={13} />
                </TouchableOpacity>
            </View>
            {/* <View style={styles.calendarContainer}>
                <Text style={{ fontSize: 16 }}>
                    Calendar
                </Text>
                <TouchableOpacity style={styles.calendarButtonContainer} >
                    <Text style={{ flexGrow: 1, color: 'hsla(0,0%,0%, 0.60)' }}>Open calendar view</Text>
                    <CalendarSVG height={21} width={19} color='#006EE6' />
                </TouchableOpacity>
            </View> */}
            <View style={styles.workoutContainer}>
                <Text style={{ fontSize: 16 }}>
                    Workout
                </Text>
                <View style={{ flexDirection: 'row', gap: 15 }}>
                    <TouchableOpacity style={styles.workoutButtonContainer} onPress={handleStartNewWorkoutButton}>
                        <NewWorkoutSVG />
                        <Text style={{ color: 'hsla(0,0%,0%, 0.60)', paddingTop: 5 }}>Start New Workout</Text>
                    </TouchableOpacity>
                    <TouchableOpacity style={styles.workoutButtonContainer}>
                        <StartRoutineSVG />
                        <Text style={{ color: 'hsla(0,0%,0%, 0.60)', paddingTop: 5 }}>From Routine</Text>
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
      position: 'absolute', 
      padding: 10,
      backgroundColor: 'hsla(0,0%,0%, 0.10)',
      borderRadius: 100,
    },
    leftArrowContainer: {
      left: 32, 
    },
    rightArrowContainer: {
      right: 32, 
    },
    dateText: {
      fontSize: 40,
      color: '#006EE6',
      fontFamily: 'Inter_700Bold',
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
  