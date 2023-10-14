import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, View } from 'react-native';
import Navigation from './Components/Navigation.js';
import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import WorkoutLog from './Components/WorkoutLog.js';
import Exercise from './Components/Exercise.js';
import Settings from './Components/Settings/Settings.js';
import WorkoutLogSVG from './Images/WorkoutLogSVG.svg';
import ExerciseSVG from './Images/ExerciseSVG.svg';
import SettingsSVG from './Images/SettingsSVG.svg';
import {
  Inter_400Regular,
  Inter_500Medium,
  Inter_700Bold
} from '@expo-google-fonts/inter';
import { useFonts } from 'expo-font';

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
  const [loaded, error] = useFonts({
    Inter_400Regular,
    Inter_500Medium,
    Inter_700Bold,
  });

  if (!loaded && !error) {
    return null;
  }

  return (
    <NavigationContainer>
      <Tab.Navigator tabBar={Navigation}>
        <Tab.Screen name="WorkoutLog" component={WorkoutLog} options={{ tabBarIcon: WorkoutIcon, headerShown: false }} />
        <Tab.Screen name="Exercise" component={Exercise} options={{ tabBarIcon: ExerciseIcon, headerShown: false }} />
        <Tab.Screen name="Settings" component={Settings} options={headerOptions} />
      </Tab.Navigator>
    </NavigationContainer>
  );
}

const headerOptions = {
  tabBarIcon: SettingsIcon,
  headerTitleAlign: 'center',
  headerStyle: {
    height: 90,
    elevation: 0,
    borderBottomWidth: 1,
    borderBottomColor: 'hsla(0, 0%, 0%, 0.35)'
  },
}