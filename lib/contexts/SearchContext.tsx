import React, { createContext, useContext, useState, ReactNode } from 'react';

type SearchContextType = { state: any; setState: React.Dispatch<any> };
const SearchContext = createContext<SearchContextType | undefined>(undefined);

export const SearchProvider = ({ children }: { children: ReactNode }) => {
  const [state, setState] = useState(null);
  return (
    <SearchContext.Provider value={{ state, setState }}>
      {children}
    </SearchContext.Provider>
  );
};

export const useSearch = () => {
  const context = useContext(SearchContext);
  if (!context) throw new Error('useSearch must be used within a SearchProvider');
  return context;
};
