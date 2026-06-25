import React, { createContext, useContext, useState, ReactNode } from 'react';

type OnboardingContextType = { state: any; setState: React.Dispatch<any> };
const OnboardingContext = createContext<OnboardingContextType | undefined>(undefined);

export const OnboardingProvider = ({ children }: { children: ReactNode }) => {
  const [state, setState] = useState(null);
  return (
    <OnboardingContext.Provider value={{ state, setState }}>
      {children}
    </OnboardingContext.Provider>
  );
};

export const useOnboarding = () => {
  const context = useContext(OnboardingContext);
  if (!context) throw new Error('useOnboarding must be used within a OnboardingProvider');
  return context;
};
