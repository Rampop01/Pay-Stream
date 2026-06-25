import React, { createContext, useContext, useState, ReactNode } from 'react';

type FilterContextType = { state: any; setState: React.Dispatch<any> };
const FilterContext = createContext<FilterContextType | undefined>(undefined);

export const FilterProvider = ({ children }: { children: ReactNode }) => {
  const [state, setState] = useState(null);
  return (
    <FilterContext.Provider value={{ state, setState }}>
      {children}
    </FilterContext.Provider>
  );
};

export const useFilter = () => {
  const context = useContext(FilterContext);
  if (!context) throw new Error('useFilter must be used within a FilterProvider');
  return context;
};
