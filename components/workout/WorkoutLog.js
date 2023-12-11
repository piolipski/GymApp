import { View, TouchableOpacity, StyleSheet, StatusBar, Platform, SafeAreaView } from 'react-native';
import { Text } from '../Text.js';
import { useIsFocused } from '@react-navigation/native';
import { useState, useEffect } from 'react';
import { useDate } from '../date/DateContext.js';
import { getItem } from '../database/DataStorage.js'
import { format } from 'date-fns';
import NewWorkoutSVG from '../../images/NewWorkoutSVG.svg';
import StartRoutineSVG from '../../images/StartRoutineSVG.svg';
import LeftArrowSVG from '../../images/LeftArrowSVG.svg';
import RightArrowSVG from '../../images/RightArrowSVG.svg';
import { ScrollView } from 'react-native-gesture-handler';


const paddingTop = Platform.OS === 'android' ? StatusBar.currentHeight : 0;

export default function WorkoutLog({ navigation }) {
  const isFocused = useIsFocused();
  const date = useDate();

  const [selectedDayExerciseData, setSelectedDayExerciseData] = useState({});
  const [typeOfWeigt, setTypeOfWeigt] = useState('');
  const [typeOfDistance, setTypeOfDistance] = useState('');

  const handleStartNewWorkoutButton = () => {
    navigation.navigate('ExercisesTab');
  }

  const handleExerciseOnPress = (name) => {
    navigation.navigate('ExerciseForm', { key1: name });
  }

  const handleRoutineOnPress = () => {
    navigation.navigate('RoutinesTab');
  }

  function renderTime(totalSeconds) {
    const hours = Math.floor(totalSeconds / 3600);
    const minutes = Math.floor((totalSeconds % 3600) / 60);
    const seconds = totalSeconds % 60;

    const formattedHours = String(hours).padStart(2, '0');
    const formattedMinutes = String(minutes).padStart(2, '0');
    const formattedSeconds = String(seconds).padStart(2, '0');

    return `${formattedHours}:${formattedMinutes}:${formattedSeconds}`;
  }

  const renderSeries = (data) => {
    return Object.keys(data).map((key) => {
      const seriesList = data[key].series.map((seriesItem, index) => {
        const seriesData = Object.entries(seriesItem)
          .filter(([attribute]) => attribute !== 'id')
          .map(([attribute, value]) => {
            if (attribute === 'time') {
              return <Text key={attribute} style={{ textAlign: 'center' }}>{`${renderTime(value)}`}</Text>
            } else if (attribute === 'weight') {
              return <Text key={attribute} style={{ textAlign: 'center' }}>
                {typeOfWeigt === 'kg' ? (`${value} ${typeOfWeigt}`) : (`${(Number(value * 2.20462262)).toFixed(2)} ${typeOfWeigt}`)}
              </Text>
            } else if (attribute === 'distance') {
              return <Text key={attribute} style={{ textAlign: 'center' }}>
                {typeOfDistance === 'km' ? (`${value} ${typeOfDistance}`) : (`${(Number(value * 1.609344)).toFixed(2)} ${typeOfDistance}`)}
              </Text>
            } else {
              return <Text key={attribute} style={{ textAlign: 'center' }}>{`${value} ${attribute}`}</Text>
            }

          });

        return (
          <View key={index} style={{
            marginBottom: 10,
            paddingHorizontal: 15,
            flexDirection: 'row',
            alignContent: 'center',
            justifyContent: 'space-between',
          }}>
            <Text style={{ fontWeight: 'bold' }}>Series {index + 1}</Text>
            {seriesData}
          </View>
        );
      });

      return (
        <TouchableOpacity
          key={key}
          style={{
            flex: 1,
            borderRadius: 15,
            marginBottom: 15,
            shadowColor: '#000',
            shadowOffset: { width: 0, height: 2 },
            shadowOpacity: 0.25,
            shadowRadius: 3.84,
            elevation: 4,
          }}
          onPress={() => handleExerciseOnPress(key)}
        >
          <Text style={{
            fontSize: 20,
            marginBottom: 10,
            textAlign: 'center',
            borderBottomWidth: 1,
            borderRadius: 8,
            borderColor: '#006EE6',
          }}>
            {key}
          </Text>
          {seriesList}
        </TouchableOpacity>
      );
    });
  };

  useEffect(() => {

    const fetchExercise = async () => {
      const fetchedTodayWorkoutData = await getItem(['workout', format(date.currentDate, 'dd-MM-yyyy')]) ?? {};
      const fetchedTypeOfWeight = await getItem(['key', 'weight']);
      const fetchedTypeOfDistance = await getItem(['key', 'distance']);
      setSelectedDayExerciseData(fetchedTodayWorkoutData);
      setTypeOfWeigt(fetchedTypeOfWeight);
      setTypeOfDistance(fetchedTypeOfDistance);
    }

    if (isFocused) {
      fetchExercise();
    }
  }, [isFocused, date.currentDate])

  return (
    <SafeAreaView style={styles.container}>
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
      {Object.keys(selectedDayExerciseData).length !== 0 ?
        (
          <View style={{ flex: 1, paddingTop: 15 }}>
            <ScrollView>
              {renderSeries(selectedDayExerciseData)}
            </ScrollView>
          </View>
        ) :
        (
          <View style={styles.workoutContainer}>
            <Text style={{ fontSize: 16 }}>
              Workout
            </Text>
            <View style={{ flexDirection: 'row', gap: 15 }}>
              <TouchableOpacity style={styles.workoutButtonContainer} onPress={handleStartNewWorkoutButton}>
                <NewWorkoutSVG />
                <Text style={{ color: 'hsla(0,0%,0%, 0.60)', paddingTop: 5 }}>Start New Workout</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.workoutButtonContainer} onPress={handleRoutineOnPress} >
                <StartRoutineSVG />
                <Text style={{ color: 'hsla(0,0%,0%, 0.60)', paddingTop: 5 }}>From Routine</Text>
              </TouchableOpacity>
            </View>
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
