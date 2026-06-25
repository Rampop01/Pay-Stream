import React, { createContext, useContext, useState, ReactNode } from 'react';

type NotificationContextType = { state: any; setState: React.Dispatch<any> };
const NotificationContext = createContext<NotificationContextType | undefined>(undefined);

export const NotificationProvider = ({ children }: { children: ReactNode }) => {
  const [state, setState] = useState(null);
  return (
    <NotificationContext.Provider value={{ state, setState }}>
      {children}
    </NotificationContext.Provider>
  );
};

export const useNotification = () => {
  const context = useContext(NotificationContext);
  if (!context) throw new Error('useNotification must be used within a NotificationProvider');
  return context;
};
