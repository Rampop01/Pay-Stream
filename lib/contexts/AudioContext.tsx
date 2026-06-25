import React, { createContext, useContext, useState, ReactNode } from 'react';

type AudioContextType = { state: any; setState: React.Dispatch<any> };
const AudioContext = createContext<AudioContextType | undefined>(undefined);

export const AudioProvider = ({ children }: { children: ReactNode }) => {
  const [state, setState] = useState(null);
  return (
    <AudioContext.Provider value={{ state, setState }}>
      {children}
    </AudioContext.Provider>
  );
};

export const useAudio = () => {
  const context = useContext(AudioContext);
  if (!context) throw new Error('useAudio must be used within a AudioProvider');
  return context;
};
