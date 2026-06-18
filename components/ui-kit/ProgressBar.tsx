import React from 'react';

export const ProgressBar = ({ progress }: any) => <div className='w-full bg-gray-200 rounded'><div className='bg-blue-500 h-2 rounded' style={{width: `${progress}%`}} /></div>;