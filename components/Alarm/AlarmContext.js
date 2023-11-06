import { createContext, useContext, useCallback, useRef } from "react";
import {Vibration} from 'react-native';

export const AlarmContext = createContext(null);

export const AlarmContextProvider = ({children}) => {

    const ONE_SECOND_IN_MS = 1000;
    const PATTERN = [
        0.5 * ONE_SECOND_IN_MS,
        1.5 * ONE_SECOND_IN_MS,
        1 * ONE_SECOND_IN_MS,
        1.5 * ONE_SECOND_IN_MS,
    ];

    const timer = useRef(null);
    const start = useCallback ((seconds) => {
        clearTimeout(timer.current);
        timer.current = setTimeout(() => {
            Vibration.vibrate(PATTERN, false);
        },seconds*ONE_SECOND_IN_MS);
    },[]);

    const stop = useCallback(() => {
        clearTimeout(timer.current);
        timer.current = null;
    },[]);


    return (
        <AlarmContext.Provider value={{
            start,
            stop
        }} >
            {children}
        </AlarmContext.Provider>
    )
}

export const useAlarm = () => useContext(AlarmContext);
