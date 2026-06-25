import React, { createContext, useContext, useState, ReactNode } from 'react';

type SocketContextType = { state: any; setState: React.Dispatch<any> };
const SocketContext = createContext<SocketContextType | undefined>(undefined);

export const SocketProvider = ({ children }: { children: ReactNode }) => {
  const [state, setState] = useState(null);
  return (
    <SocketContext.Provider value={{ state, setState }}>
      {children}
    </SocketContext.Provider>
  );
};

export const useSocket = () => {
  const context = useContext(SocketContext);
  if (!context) throw new Error('useSocket must be used within a SocketProvider');
  return context;
};
