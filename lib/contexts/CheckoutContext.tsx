import React, { createContext, useContext, useState, ReactNode } from 'react';

type CheckoutContextType = { state: any; setState: React.Dispatch<any> };
const CheckoutContext = createContext<CheckoutContextType | undefined>(undefined);

export const CheckoutProvider = ({ children }: { children: ReactNode }) => {
  const [state, setState] = useState(null);
  return (
    <CheckoutContext.Provider value={{ state, setState }}>
      {children}
    </CheckoutContext.Provider>
  );
};

export const useCheckout = () => {
  const context = useContext(CheckoutContext);
  if (!context) throw new Error('useCheckout must be used within a CheckoutProvider');
  return context;
};
