import React, { createContext, useContext, useState, ReactNode } from 'react';

type AuthContextType = { state: any; setState: React.Dispatch<any> };
const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [state, setState] = useState(null);
  return (
    <AuthContext.Provider value={{ state, setState }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) throw new Error('useAuth must be used within a AuthProvider');
  return context;
};
