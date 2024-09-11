import React, { createContext, useState, useContext } from 'react';

const CamasContext = createContext();

export const CamasProvider = ({ children }) => {
    const [camas, setCamas] = useState([]);
    const [casinhas, setCasinhas] = useState([]);
    const [error, setError] = useState('');

    return (
        <CamasContext.Provider value={{ camas, setCamas, casinhas, setCasinhas, error, setError }}>
            {children}
        </CamasContext.Provider>
    );
};

export const useCamas = () => useContext(CamasContext);
