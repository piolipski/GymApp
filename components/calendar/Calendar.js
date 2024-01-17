import React, { useEffect, useState } from 'react';
import { View, TouchableOpacity, StyleSheet, StatusBar, SafeAreaView, ScrollView } from 'react-native';
import { Text } from '../Text.js';
import { useIsFocused, useNavigation } from '@react-navigation/native';
import { format, startOfYear, addMonths, eachMonthOfInterval, startOfMonth, getWeeksInMonth, startOfWeek, isSameMonth, addDays, addYears, subYears } from 'date-fns';
import LeftArrowSVG from '../../images/LeftArrowSVG.svg';
import RightArrowSVG from '../../images/RightArrowSVG.svg';
import { useDate } from '../date/DateContext.js';

import { getAllExercises, getAllWorkoutsWithDates } from '../database/DataStorage.js';


const paddingTop = Platform.OS === 'android' ? StatusBar.currentHeight : 0;

export default function Calendar() {

    const isFocused = useIsFocused();
    const date = useDate();
    const navigation = useNavigation();
    const [doneCategories, setDoneCategories] = useState({});

    const [selectedYear, setSelectedYear] = useState(new Date());
    const firstDayOfYear = startOfYear(new Date(format(selectedYear, 'yyyy'), 0, 1));
    const monthsOfYear = eachMonthOfInterval({ start: firstDayOfYear, end: addMonths(firstDayOfYear, 11) });

    const nextYearButton = () => {
        setSelectedYear(addYears(selectedYear, 1));
    }

    const previousYearButton = () => {
        setSelectedYear(subYears(selectedYear, 1));
    }

    const handleDaySelect = (selectedDate) => {
        const [day, month, year] = selectedDate.split('-');
        const parsedDate = new Date(year, month - 1, day);
       
        date.setCurrentDate(parsedDate);
        navigation.navigate('WorkoutLog');
    }


    const renderCalendar = (month) => {
        const firstDayOfMonth = startOfMonth(month);
        const weeksInMonth = getWeeksInMonth(month);

        return (
            <View style={styles.monthContainer}>
                {[...Array(weeksInMonth)].map((_, weekIndex) => {
                    const startOfWeekDate = startOfWeek(addDays(firstDayOfMonth, weekIndex * 7), { weekStartsOn: 1 }); // Start on Monday

                    return (
                        <View key={weekIndex} style={styles.weekContainer}>
                            {[...Array(7)].map((_, dayIndex) => {
                                const currentDate = addDays(startOfWeekDate, dayIndex);
                                const formattedDate = format(currentDate, 'dd-MM-yyyy');
                                const dayCategories = doneCategories[formattedDate] || [];

                                return (
                                    <TouchableOpacity
                                        key={dayIndex}
                                        style={[
                                            styles.dayContainer,
                                            isSameMonth(currentDate, firstDayOfMonth) ? null : styles.nonCurrentMonthDay,
                                        ]}
                                        onPress={() => handleDaySelect(formattedDate)}
                                    >
                                        <Text>{format(currentDate, 'd')}</Text>
                                        <View style={{ flexDirection: 'row', marginTop: 5 }}>
                                            {dayCategories.slice(0, 4).map((category, index) => {
                                                let circleColor = 'transparent';
                                                if (category === 'Chest') {
                                                    circleColor = 'blue';
                                                } else if (category === 'Biceps') {
                                                    circleColor = 'green';
                                                } else if (category === 'Legs') {
                                                    circleColor = 'purple';
                                                } else if (category === 'Shoulders') {
                                                    circleColor = 'green';
                                                } else if (category === 'Triceps') {
                                                    circleColor = 'orange';
                                                } else {
                                                    circleColor = '#FF0000';
                                                }

                                                return (
                                                    <View
                                                        key={index}
                                                        style={{
                                                            backgroundColor: circleColor,
                                                            width: 8,
                                                            height: 8,
                                                            borderRadius: 4,
                                                            marginRight: 2,
                                                        }}
                                                    />
                                                );
                                            })}
                                            {dayCategories.length > 4 && (
                                                <View
                                                    style={{
                                                        backgroundColor: 'gray',
                                                        width: 8,
                                                        height: 8,
                                                        borderRadius: 4,
                                                        marginRight: 2,
                                                    }}
                                                />
                                            )}
                                        </View>
                                    </TouchableOpacity>
                                );
                            })}
                        </View>
                    );
                })}
            </View>
        );
    };

    useEffect(() => {

        const fetchExercise = async () => {
            const fetchedExercises = await getAllExercises();
            const workouts = await getAllWorkoutsWithDates();

            let categoryObject = {}
            workouts.map((item) => Object.keys(item).map((date) => {

                let categoryArray = [];
                let exerciseCategory = '';
                Object.keys(item?.[date]).map((exerciseName) => {
                    const exercise = fetchedExercises.find(item => item.name === exerciseName);
                    exerciseCategory = exercise.category;
                    categoryArray.push(exerciseCategory)

                })
                categoryArray = [...new Set(categoryArray)];
                categoryObject = {
                    ...categoryObject,
                    [date]: categoryArray

                }

            }))
            setDoneCategories(categoryObject);
        }

        if (isFocused) {
            fetchExercise();
        }
    }, [isFocused])

    return (
        <SafeAreaView style={styles.container}>
            <View style={styles.dateContainer}>
                <TouchableOpacity style={[styles.arrowContainer, styles.leftArrowContainer]} onPress={previousYearButton}>
                    <LeftArrowSVG height={13} width={13} />
                </TouchableOpacity>
                <Text style={styles.dateText}>
                    {format(selectedYear, 'yyyy')}
                </Text>
                <TouchableOpacity style={[styles.arrowContainer, styles.rightArrowContainer]} onPress={nextYearButton}>
                    <RightArrowSVG height={13} width={13} />
                </TouchableOpacity>
            </View>
            <View style={{ flex: 1, paddingTop: StatusBar.currentHeight }}>
                <ScrollView>
                    <View style={styles.calendarContainer}>
                        {monthsOfYear.map((month, index) => (
                            <View key={index}>
                                <Text style={styles.monthHeader}>{format(month, 'MMMM')}</Text>
                                {renderCalendar(month)}
                            </View>
                        ))}
                    </View>
                </ScrollView>
            </View>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: {
        paddingTop,
        flexGrow: 1,
    },
    calendarContainer: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        justifyContent: 'space-around',
    },
    monthHeader: {
        textAlign: 'center',
        fontSize: 18,
        marginVertical: 10,
    },
    monthContainer: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        justifyContent: 'center',
    },
    weekContainer: {
        flexDirection: 'row',
        justifyContent: 'space-around',
        width: '100%',
        marginBottom: 5,
    },
    dayContainer: {
        aspectRatio: 1,
        justifyContent: 'center',
        alignItems: 'center',
        width: 45,
        height: 45,
    },
    nonCurrentMonthDay: {
        opacity: 0.3,
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
});
