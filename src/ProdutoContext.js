// ProductContext.js
import React, { createContext, useContext, useState } from 'react';

const ProductContext = createContext();

export const useProductContext = () => {
    return useContext(ProductContext);
};

export const ProductProvider = ({ children }) => {
    const [selectedProduct, setSelectedProduct] = useState(null);

    const saveProduct = (product) => {
        setSelectedProduct(product);
        localStorage.setItem('selectedProduct', JSON.stringify(product));
    };

    return (
        <ProductContext.Provider value={{ selectedProduct, saveProduct }}>
            {children}
        </ProductContext.Provider>
    );
};
