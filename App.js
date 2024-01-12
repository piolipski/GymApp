import Navigation from './components/Navigation.js';
import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createStackNavigator } from '@react-navigation/stack';
import { useNavigation } from '@react-navigation/native';
import { TouchableOpacity } from 'react-native-gesture-handler';
import { Text } from './components/Text.js';
import { useFonts } from 'expo-font';
import { useState } from 'react';
import { AlarmContextProvider } from './components/alarm/AlarmContext.js';
import { DateContextProvider } from './components/date/DateContext.js';
import { CategoryContextProvider } from './components/exercises/category/CategoryContext.js';

import WorkoutLog from './components/workout/WorkoutLog.js';
import Exercises from './components/exercises/Exercises.js';
import Calendar from './components/calendar/Calendar.js';
import Settings from './components/settings/Settings.js';

import Login from './components/settings/profile/Login.js';
import Register from './components/settings/profile/Register.js'
import Profile from './components/settings/profile/Profile.js';
import ChangeEmail from './components/settings/profile/ChangeEmail.js';
import ChangePassword from './components/settings/profile/ChangePassword.js';

import CreateExercise from './components/exercises/CreateExercise.js';
import ExerciseForm from './components/exercises/ExerciseForm.js';
import CategoryList from './components/exercises/category/CategoryList.js';
import TypeList from './components/exercises/type/TypeList.js';
import EditExercise from './components/exercises/EditExercise.js';
import DeleteAccount from './components/settings/profile/DeleteAccount.js';

import Routines from './components/routine/Routines.js';
import CreateRoutine from './components/routine/CreateRoutine.js';

import WorkoutLogSVG from './images/WorkoutLogSVG.svg';
import ExerciseSVG from './images/ExerciseSVG.svg';
import StartRoutineSVG from './images/StartRoutineSVG.svg';
import SettingsSVG from './images/SettingsSVG.svg';
import CalendarTabSVG from './images/CalendarTabSVG.svg';
import {
  Inter_400Regular,
  Inter_500Medium,
  Inter_700Bold
} from '@expo-google-fonts/inter';
import { TypeContextProvider } from './components/exercises/type/TypeContext.js';
import { RoutineContextProvider } from './components/routine/RoutineContext.js';


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

const CalendarIcon = ({ focused, color, size }) => {

  return (
    <CalendarTabSVG height={size} fill={color} />
  )
}

const Tab = createBottomTabNavigator();
const Stack = createStackNavigator();

function ProfileWrapper() {
  return (
    <Stack.Navigator>
      <Stack.Screen name="Profile" component={Profile} options={headerOptions} />
      <Stack.Screen name="Login" component={Login} options={headerOptions} />
      <Stack.Screen name="Register" component={Register} options={headerOptions} />
      <Stack.Screen name="Change Password" component={ChangePassword} options={headerOptions} />
      <Stack.Screen name="Change Email" component={ChangeEmail} options={headerOptions} />
      <Stack.Screen name="Delete Account" component={DeleteAccount} options={headerOptions} />
    </Stack.Navigator>
  )
}

function SettingsWrapper() {
  return (
    <Stack.Navigator>
      <Stack.Screen name="Settings" component={Settings} options={headerOptions} />
      <Stack.Screen name="ProfileTab" component={ProfileWrapper} options={{ ...headerOptions, headerShown: false, title: "Profile" }} />
    </Stack.Navigator>
  )
}

function ExercisesWrapper() {
  const navigation = useNavigation();
  return (
    <Stack.Navigator>
      <Stack.Screen name="Exercises" component={Exercises} options={{
        ...headerOptions, headerRight: () => (
          <TouchableOpacity onPress={() => navigation.navigate('CreateExerciseTab')}>
            <Text style={{ fontSize: 16, marginRight: 15, color: '#006EE6' }}>Create</Text>
          </TouchableOpacity>
        ),
      }} />
      <Stack.Screen name="CreateExerciseTab" component={CreateExerciseWrapper} options={{ ...headerOptions, headerShown: false, title: "Create Exercise" }} />
      <Stack.Screen name="ExerciseForm" component={ExerciseForm} options={({ route }) => ({ ...headerOptions, title: route.params.key1 })} />
      <Stack.Screen name="EditExerciseTab" component={EditExerciseWrapper} options={{ ...headerOptions, headerShown: false, title: "Edit Exercise" }} />
    </Stack.Navigator>
  )
}

function CreateExerciseWrapper() {
  const [modalOpen, setModalOpen] = useState(false);

  return (
    <Stack.Navigator>
      <Stack.Screen name="CreateExercise" component={CreateExercise} options={{ ...headerOptions, title: "Create Exercise" }} />
      <Stack.Screen name="CategoryList" options={{
        ...headerOptions, title: "Categories", headerRight: () => (
          <TouchableOpacity onPress={() => { setModalOpen(true) }}>
            <Text style={{ fontSize: 16, marginRight: 15, color: '#006EE6' }}>Create</Text>
          </TouchableOpacity>
        ),
      }}>
        {(props) => <CategoryList {...props} modalOpen={modalOpen} setModalOpen={setModalOpen} />}
      </Stack.Screen>
      <Stack.Screen name="TypeList" component={TypeList} options={{ ...headerOptions, title: "Types" }} />
    </Stack.Navigator>
  )
}

function EditExerciseWrapper({ route }) {
  const [modalOpen, setModalOpen] = useState(false);

  return (
    <Stack.Navigator>
      <Stack.Screen name="EditExercise"
        component={EditExercise}
        options={{ ...headerOptions, title: "Edit Exercise" }}
        initialParams={{ exercise: route.params?.exercise }}
      />
      <Stack.Screen name="CategoryList" options={{
        ...headerOptions, title: "Categories", headerRight: () => (
          <TouchableOpacity onPress={() => { setModalOpen(true) }}>
            <Text style={{ fontSize: 16, marginRight: 15, color: '#006EE6' }}>Create</Text>
          </TouchableOpacity>
        ),
      }}>
        {(props) => <CategoryList {...props} modalOpen={modalOpen} setModalOpen={setModalOpen} />}
      </Stack.Screen>
      <Stack.Screen name="TypeList" component={TypeList} options={{ ...headerOptions, title: "Types" }} />
    </Stack.Navigator>
  )
}

function RoutinesWrapper() {
  const navigation = useNavigation();

  return (
    <Stack.Navigator>
      <Stack.Screen name="Routines" component={Routines} options={{
        ...headerOptions, headerRight: () => (
          <TouchableOpacity onPress={() => { navigation.navigate('CreateRoutine') }}>
            <Text style={{ fontSize: 16, marginRight: 15, color: '#006EE6' }}>Create</Text>
          </TouchableOpacity>
        ),
      }} />
      <Stack.Screen name="CreateRoutine" component={CreateRoutine} options={({ route }) => ({ ...headerOptions, title: route.params?.key ? route.params.key : 'Create Routine' })} />
      <Stack.Screen name="Exercises" component={Exercises} options={{ ...headerOptions, title: "Exercises" }} />
    </Stack.Navigator>
  )
}

function WorkoutsWrapper() {
  const navigation = useNavigation();

  return (
    <Stack.Navigator>
      <Stack.Screen name="WorkoutLog" component={WorkoutLog} options={({ route }) => ({
        ...headerOptions, headerRight: () => (
          route.params?.data && Object.keys(route.params?.data).length > 0 && (
            <TouchableOpacity style={{ marginRight: 15 }} onPress={() => navigation.navigate('CreateRoutine', { data: route?.params.data })}>
              <StartRoutineSVG height={22} width={22} />
            </TouchableOpacity>
          )
        )
      })} />
      <Stack.Screen name="ExerciseForm" component={ExerciseForm} options={({ route }) => ({ ...headerOptions, title: route.params.key1 })} />
      <Stack.Screen name="CalendarView" component={Calendar} options={{ tabBarIcon: CalendarIcon, title: "Calendar" }} />
      <Stack.Screen name="RoutinesTab" component={RoutinesWrapper} options={{ ...headerOptions, headerShown: false }} />
      <Stack.Screen name="CreateRoutine" component={CreateRoutine} options={{ ...headerOptions, title: 'Create Routine' }} />
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
      <DateContextProvider>
        <RoutineContextProvider>
          <CategoryContextProvider>
            <TypeContextProvider>
              <NavigationContainer>
                <Tab.Navigator tabBar={Navigation}>
                  <Tab.Screen name="WorkoutLogTab" component={WorkoutsWrapper} options={{ tabBarIcon: WorkoutIcon, headerShown: false, title: "WorkoutLog" }} />
                  <Tab.Screen name="CalendarTab" component={Calendar} options={{ tabBarIcon: CalendarIcon, headerShown: false, title: "Calendar" }} />
                  <Tab.Screen name="ExercisesTab" component={ExercisesWrapper} options={{ tabBarIcon: ExerciseIcon, headerShown: false, title: "Exercises" }} />
                  <Tab.Screen name="SettingsTab" component={SettingsWrapper} options={{ tabBarIcon: SettingsIcon, headerShown: false, title: "Settings" }} />
                </Tab.Navigator>
              </NavigationContainer>
            </TypeContextProvider>
          </CategoryContextProvider>
        </RoutineContextProvider>
      </DateContextProvider>
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