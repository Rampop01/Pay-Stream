import React, { createContext, useContext, useState, ReactNode } from 'react';

type TourContextType = { state: any; setState: React.Dispatch<any> };
const TourContext = createContext<TourContextType | undefined>(undefined);

export const TourProvider = ({ children }: { children: ReactNode }) => {
  const [state, setState] = useState(null);
  return (
    <TourContext.Provider value={{ state, setState }}>
      {children}
    </TourContext.Provider>
  );
};

export const useTour = () => {
  const context = useContext(TourContext);
  if (!context) throw new Error('useTour must be used within a TourProvider');
  return context;
};
