import React, { createContext, useContext, useState, ReactNode } from 'react';

type FeatureToggleContextType = { state: any; setState: React.Dispatch<any> };
const FeatureToggleContext = createContext<FeatureToggleContextType | undefined>(undefined);

export const FeatureToggleProvider = ({ children }: { children: ReactNode }) => {
  const [state, setState] = useState(null);
  return (
    <FeatureToggleContext.Provider value={{ state, setState }}>
      {children}
    </FeatureToggleContext.Provider>
  );
};

export const useFeatureToggle = () => {
  const context = useContext(FeatureToggleContext);
  if (!context) throw new Error('useFeatureToggle must be used within a FeatureToggleProvider');
  return context;
};
