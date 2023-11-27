import { createContext, useContext, useState } from 'react';

const TypeContext = createContext(null);

export const TypeContextProvider = ({ children }) => {
    const [selectedType, setSelectedType] = useState(null);

    return (
        <TypeContext.Provider value={{ selectedType, setSelectedType }}>
            {children}
        </TypeContext.Provider>
    );
};

export const useType = () => useContext(TypeContext);