import React, { createContext, useContext, useState, ReactNode } from 'react';

type DrawerContextType = { state: any; setState: React.Dispatch<any> };
const DrawerContext = createContext<DrawerContextType | undefined>(undefined);

export const DrawerProvider = ({ children }: { children: ReactNode }) => {
  const [state, setState] = useState(null);
  return (
    <DrawerContext.Provider value={{ state, setState }}>
      {children}
    </DrawerContext.Provider>
  );
};

export const useDrawer = () => {
  const context = useContext(DrawerContext);
  if (!context) throw new Error('useDrawer must be used within a DrawerProvider');
  return context;
};
