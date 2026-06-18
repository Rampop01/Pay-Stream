import React from 'react';

export const Switch = ({ checked, onChange }: any) => <div onClick={onChange} className={`w-10 h-5 rounded-full ${checked ? 'bg-blue-500' : 'bg-gray-300'}`} />;