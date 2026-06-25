import React, { createContext, useContext, useState, ReactNode } from 'react';

type NetworkContextType = { state: any; setState: React.Dispatch<any> };
const NetworkContext = createContext<NetworkContextType | undefined>(undefined);

export const NetworkProvider = ({ children }: { children: ReactNode }) => {
  const [state, setState] = useState(null);
  return (
    <NetworkContext.Provider value={{ state, setState }}>
      {children}
    </NetworkContext.Provider>
  );
};

export const useNetwork = () => {
  const context = useContext(NetworkContext);
  if (!context) throw new Error('useNetwork must be used within a NetworkProvider');
  return context;
};
