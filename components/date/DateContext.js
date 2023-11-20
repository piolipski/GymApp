import { createContext, useContext, useState } from "react";
import { format, addDays, subDays } from 'date-fns';

export const DateContext = createContext(null);

export const DateContextProvider = ({ children }) => {

    const [currentDate, setCurrentDate] = useState(new Date());

    const handleGoToYesterday = () => {
        setCurrentDate((prevDate) => subDays(prevDate, 1));
    };

    const handleGoToTomorrow = () => {
        setCurrentDate((prevDate) => addDays(prevDate, 1));
    };

    const whatDay = () => {

        const today = new Date();
        const yesterday = subDays(today, 1);
        const tomorrow = addDays(today, 1);

        if (format(currentDate, 'dd/MM/yyyy') === format(today, 'dd/MM/yyyy')) {
            return 'Today';
        } else if (format(currentDate, 'dd/MM/yyyy') === format(yesterday, 'dd/MM/yyyy')) {
            return 'Yesterday';
        } else if (format(currentDate, 'dd/MM/yyyy') === format(tomorrow, 'dd/MM/yyyy')) {
            return 'Tomorrow';
        } else {
            return format(currentDate, 'dd/MM/yyyy');
        }
    }

    return (
        <DateContext.Provider
            value={{
                currentDate,
                handleGoToTomorrow,
                handleGoToYesterday,
                whatDay
            }}
        >
            {children}
        </DateContext.Provider>
    )
}


export const useDate = () => useContext(DateContext);