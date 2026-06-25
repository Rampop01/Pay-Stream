import React, { createContext, useContext, useState, ReactNode } from 'react';

type KeyboardContextType = { state: any; setState: React.Dispatch<any> };
const KeyboardContext = createContext<KeyboardContextType | undefined>(undefined);

export const KeyboardProvider = ({ children }: { children: ReactNode }) => {
  const [state, setState] = useState(null);
  return (
    <KeyboardContext.Provider value={{ state, setState }}>
      {children}
    </KeyboardContext.Provider>
  );
};

export const useKeyboard = () => {
  const context = useContext(KeyboardContext);
  if (!context) throw new Error('useKeyboard must be used within a KeyboardProvider');
  return context;
};
