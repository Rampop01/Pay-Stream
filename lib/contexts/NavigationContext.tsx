import React, { createContext, useContext, useState, ReactNode } from 'react';

type NavigationContextType = { state: any; setState: React.Dispatch<any> };
const NavigationContext = createContext<NavigationContextType | undefined>(undefined);

export const NavigationProvider = ({ children }: { children: ReactNode }) => {
  const [state, setState] = useState(null);
  return (
    <NavigationContext.Provider value={{ state, setState }}>
      {children}
    </NavigationContext.Provider>
  );
};

export const useNavigation = () => {
  const context = useContext(NavigationContext);
  if (!context) throw new Error('useNavigation must be used within a NavigationProvider');
  return context;
};
