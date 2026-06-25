import React, { createContext, useContext, useState, ReactNode } from 'react';

type SessionContextType = { state: any; setState: React.Dispatch<any> };
const SessionContext = createContext<SessionContextType | undefined>(undefined);

export const SessionProvider = ({ children }: { children: ReactNode }) => {
  const [state, setState] = useState(null);
  return (
    <SessionContext.Provider value={{ state, setState }}>
      {children}
    </SessionContext.Provider>
  );
};

export const useSession = () => {
  const context = useContext(SessionContext);
  if (!context) throw new Error('useSession must be used within a SessionProvider');
  return context;
};
