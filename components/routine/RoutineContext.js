import { createContext, useContext, useState } from "react";

const RoutineContext = createContext(null);

export const RoutineContextProvider = ({ children }) => {
    const [checkedExercises, setCheckedExercises] = useState([]);

    return (
        <RoutineContext.Provider value={{ checkedExercises, setCheckedExercises }}>
            {children}
        </RoutineContext.Provider>
    );
};

export const useRoutine = () => useContext(RoutineContext);