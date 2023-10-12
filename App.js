import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, View } from 'react-native';
import Navigation from './Components/Navigation.js';
import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import WorkoutLog from './Components/WorkoutLog.js';
import Exercise from './Components/Exercise.js';
import Settings from './Components/Settings.js';
import WorkoutLogSVG from './Images/WorkoutLogSVG.svg';
import ExerciseSVG from './Images/ExerciseSVG.svg';
import SettingsSVG from './Images/SettingsSVG.svg';

const WorkoutIcon = ({ focused, color, size }) => {

  return (
    <WorkoutLogSVG height={size} fill={color} />
  )
}
const ExerciseIcon = ({ focused, color, size }) => {

  return (
    <ExerciseSVG height={size} fill={color} />
  )
}
const SettingsIcon = ({ focused, color, size }) => {

  return (
    <SettingsSVG height={size} fill={color} />
  )
}

const Tab = createBottomTabNavigator();

export default function App() {
  return (
    <NavigationContainer>
      <Tab.Navigator tabBar={Navigation}>
        <Tab.Screen name="WorkoutLog" component={WorkoutLog} options={{ tabBarIcon: WorkoutIcon, headerShown: false }} />
        <Tab.Screen name="Exercise" component={Exercise} options={{ tabBarIcon: ExerciseIcon, headerShown: false }} />
        <Tab.Screen name="Settings" component={Settings} options={{ tabBarIcon: SettingsIcon, headerShown: false }} />
      </Tab.Navigator>
    </NavigationContainer>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
  navigation: {
    position: 'absolute',
    bottom: 0,
    alignItems: 'center',
  }
});
