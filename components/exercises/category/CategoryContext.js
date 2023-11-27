import { createContext, useContext, useState } from 'react';

const CategoryContext = createContext(null);

export const CategoryContextProvider = ({ children }) => {
    const [selectedCategory, setSelectedCategory] = useState(null);

    return (
        <CategoryContext.Provider value={{ selectedCategory, setSelectedCategory }}>
            {children}
        </CategoryContext.Provider>
    );
};

export const useCategory = () => useContext(CategoryContext);