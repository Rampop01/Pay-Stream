import React, { createContext, useContext, useState, ReactNode } from 'react';

type Web3ContextType = { state: any; setState: React.Dispatch<any> };
const Web3Context = createContext<Web3ContextType | undefined>(undefined);

export const Web3Provider = ({ children }: { children: ReactNode }) => {
  const [state, setState] = useState(null);
  return (
    <Web3Context.Provider value={{ state, setState }}>
      {children}
    </Web3Context.Provider>
  );
};

export const useWeb3 = () => {
  const context = useContext(Web3Context);
  if (!context) throw new Error('useWeb3 must be used within a Web3Provider');
  return context;
};
