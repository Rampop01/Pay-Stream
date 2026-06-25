import React, { createContext, useContext, useState, ReactNode } from 'react';

type VideoContextType = { state: any; setState: React.Dispatch<any> };
const VideoContext = createContext<VideoContextType | undefined>(undefined);

export const VideoProvider = ({ children }: { children: ReactNode }) => {
  const [state, setState] = useState(null);
  return (
    <VideoContext.Provider value={{ state, setState }}>
      {children}
    </VideoContext.Provider>
  );
};

export const useVideo = () => {
  const context = useContext(VideoContext);
  if (!context) throw new Error('useVideo must be used within a VideoProvider');
  return context;
};
