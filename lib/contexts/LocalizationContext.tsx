import React, { createContext, useContext, useState, ReactNode } from 'react';

type LocalizationContextType = { state: any; setState: React.Dispatch<any> };
const LocalizationContext = createContext<LocalizationContextType | undefined>(undefined);

export const LocalizationProvider = ({ children }: { children: ReactNode }) => {
  const [state, setState] = useState(null);
  return (
    <LocalizationContext.Provider value={{ state, setState }}>
      {children}
    </LocalizationContext.Provider>
  );
};

export const useLocalization = () => {
  const context = useContext(LocalizationContext);
  if (!context) throw new Error('useLocalization must be used within a LocalizationProvider');
  return context;
};
