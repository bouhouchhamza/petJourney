import React, { createContext, useContext, useState, useEffect } from 'react';

const AppContext = createContext();

export const AppProvider = ({ children }) => {
  const [cart, setCart] = useState([]);
  const [isAdmin, setIsAdmin] = useState(false);

  const addToCart = (product, customDetails = null) => {
    setCart(prev => [...prev, { ...product, customDetails, cartId: Date.now() }]);
  };

  return (
    <AppContext.Provider value={{ cart, addToCart, isAdmin, setIsAdmin }}>
      {children}
    </AppContext.Provider>
  );
};

export const useAppContext = () => useContext(AppContext);
