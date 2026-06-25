import React, { createContext, useContext, useState, ReactNode } from 'react';

type PaginationContextType = { state: any; setState: React.Dispatch<any> };
const PaginationContext = createContext<PaginationContextType | undefined>(undefined);

export const PaginationProvider = ({ children }: { children: ReactNode }) => {
  const [state, setState] = useState(null);
  return (
    <PaginationContext.Provider value={{ state, setState }}>
      {children}
    </PaginationContext.Provider>
  );
};

export const usePagination = () => {
  const context = useContext(PaginationContext);
  if (!context) throw new Error('usePagination must be used within a PaginationProvider');
  return context;
};
