import React, { createContext, useContext, useState, ReactNode } from 'react';

type AnalyticsContextType = { state: any; setState: React.Dispatch<any> };
const AnalyticsContext = createContext<AnalyticsContextType | undefined>(undefined);

export const AnalyticsProvider = ({ children }: { children: ReactNode }) => {
  const [state, setState] = useState(null);
  return (
    <AnalyticsContext.Provider value={{ state, setState }}>
      {children}
    </AnalyticsContext.Provider>
  );
};

export const useAnalytics = () => {
  const context = useContext(AnalyticsContext);
  if (!context) throw new Error('useAnalytics must be used within a AnalyticsProvider');
  return context;
};
