import React, { createContext, useContext, useState } from 'react';

const DoacaoContext = createContext();

export const useDoacao = () => useContext(DoacaoContext);

export const DoacaoProvider = ({ children }) => {
    const [doacaoSelecionada, setDoacaoSelecionada] = useState(null);

    return (
        <DoacaoContext.Provider value={{ doacaoSelecionada, setDoacaoSelecionada }}>
            {children}
        </DoacaoContext.Provider>
    );
};
