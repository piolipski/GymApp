import { createContext, useContext, useCallback, useRef, useState, useEffect } from "react";
import * as Notifications from 'expo-notifications';
import { getItem } from '../database/DataStorage';

export const AlarmContext = createContext(null);

export const AlarmContextProvider = ({ children }) => {
  const ONE_SECOND_IN_MS = 1000;

  const timer = useRef(null);
  const [seconds, setSeconds] = useState(5);
  const [status, setStatus] = useState('stopped');
  const [vibration, setVibration] = useState(null);
  const [sound, setSound] = useState(null);
  const [autoStart, setAutoStart] = useState(null);
  const notificationId = useRef(null);

  Notifications.setNotificationHandler({
    handleNotification: async () => ({
      shouldPlaySound: false,
    }),
  });

  const onSecondsChange = (text) => {
    const stringSeconds = text.replace(/[,.\-\s]/, '');
    setSeconds(Number(stringSeconds));
  };

  const start = useCallback(async (initialSeconds) => {
    setStatus('running');
    const targetTime = Date.now() + initialSeconds * ONE_SECOND_IN_MS;

    if (Platform.OS === 'android') {
      await Notifications.setNotificationChannelAsync('default', {
        name: 'default',
        importance: Notifications.AndroidImportance.MAX,
        vibrationPattern: [0, 250, 250, 250],
        lightColor: '#FF231F7C',
      });
    }

    const newNotificationId = await Notifications.scheduleNotificationAsync({
      content: {
        title: 'Timer Finished',
        body: 'Your timer has finished!',
        sound: false,
        vibrate: false,
      },
      trigger: { date: new Date(targetTime) },
    });
    notificationId.current = newNotificationId;

    clearInterval(timer.current);
    timer.current = setInterval(() => {
      const remainingSeconds = Math.max(0, Math.ceil((targetTime - Date.now()) / ONE_SECOND_IN_MS));
      setSeconds(remainingSeconds);
    }, ONE_SECOND_IN_MS);
  }, []);

  const stop = useCallback(async () => {
    clearInterval(timer.current);
    timer.current = null;
    setStatus('stopped');
    await Notifications.cancelAllScheduledNotificationsAsync(notificationId);
  }, [notificationId]);

  useEffect(() => {
    if (seconds === 0 && status === 'running') {
      clearInterval(timer.current);
      timer.current = null;
      setStatus('stopped');
    }
  }, [seconds]);

  useEffect(() => {
    async function fetchLocalData(){
         const vibrationBoolean = await getItem(['key', 'vibration']);
         const soundBoolean = await getItem(['key', 'sound']);
         const autoStartBoolean = await getItem(['key', 'autoStart']);

         setVibration(vibrationBoolean);
         setSound(soundBoolean);
         setAutoStart(autoStartBoolean);
     };
     fetchLocalData();
     
 }, []);

  return (
    <AlarmContext.Provider
      value={{
        start, stop,
        seconds, setSeconds, onSecondsChange,
        status,
        sound, setSound,
        vibration, setVibration,
        autoStart, setAutoStart,
      }}
    >
      {children}
    </AlarmContext.Provider>
  );
};

export const useAlarm = () => useContext(AlarmContext);
