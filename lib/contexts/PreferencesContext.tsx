import React, { createContext, useContext, useState, ReactNode } from 'react';

type PreferencesContextType = { state: any; setState: React.Dispatch<any> };
const PreferencesContext = createContext<PreferencesContextType | undefined>(undefined);

export const PreferencesProvider = ({ children }: { children: ReactNode }) => {
  const [state, setState] = useState(null);
  return (
    <PreferencesContext.Provider value={{ state, setState }}>
      {children}
    </PreferencesContext.Provider>
  );
};

export const usePreferences = () => {
  const context = useContext(PreferencesContext);
  if (!context) throw new Error('usePreferences must be used within a PreferencesProvider');
  return context;
};
