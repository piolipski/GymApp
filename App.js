import Navigation from './components/Navigation.js';
import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createStackNavigator } from '@react-navigation/stack';
import WorkoutLog from './components/WorkoutLog.js';
import Exercises from './components/exercises/Exercises.js';
import Settings from './components/settings/Settings.js';
import Login from './components/settings/profile/Login.js';
import Register from './components/settings/profile/Register.js'
import WorkoutLogSVG from './images/WorkoutLogSVG.svg';
import ExerciseSVG from './images/ExerciseSVG.svg';
import SettingsSVG from './images/SettingsSVG.svg';
import {
  Inter_400Regular,
  Inter_500Medium,
  Inter_700Bold
} from '@expo-google-fonts/inter';
import { useFonts } from 'expo-font';
import Alarm from './components/Alarm/Alarm.js';
import { AlarmContextProvider, AlarmContext } from './components/Alarm/AlarmContext.js';

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
const Stack = createStackNavigator();

function SettingsWrapper() {
  return (
    <Stack.Navigator>
      <Stack.Screen name="Settings" component={Settings} options={headerOptions} />
      <Stack.Screen name="Login" component={Login} options={headerOptions} />
      <Stack.Screen name="Register" component={Register} options={headerOptions} />
    </Stack.Navigator>
  )
}

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
    <AlarmContextProvider>
      <NavigationContainer>
        <Tab.Navigator tabBar={Navigation}>
          <Tab.Screen name="WorkoutLog" component={WorkoutLog} options={{ tabBarIcon: WorkoutIcon, headerShown: false }} />
          <Tab.Screen name="Exercises" component={Exercises} options={{ tabBarIcon: ExerciseIcon, ...headerOptions }} />
          <Tab.Screen name="SettingsTab" component={SettingsWrapper} options={{ tabBarIcon: SettingsIcon, headerShown: false, title: "Settings" }} />
        </Tab.Navigator>
      </NavigationContainer>
    </AlarmContextProvider>
  );
}


const headerOptions = {
  headerTitleAlign: 'center',
  headerStyle: {
    height: 90,
    elevation: 0,
    borderBottomWidth: 1,
    borderBottomColor: 'hsla(0, 0%, 0%, 0.35)'
  },
}