import React, { createContext, useState } from 'react';

export const BrinquedosContext = createContext();

export const BrinquedosProvider = ({ children }) => {
    const [brinquedos, setBrinquedos] = useState([]);
    const [error, setError] = useState('');

    return (
        <BrinquedosContext.Provider value={{ brinquedos, setBrinquedos, error, setError }}>
            {children}
        </BrinquedosContext.Provider>
    );
};
export default BrinquedosContext;