import React from 'react';

export const Tooltip = ({ text, children }: any) => <div className='group relative'>{children}<span className='absolute hidden group-hover:block bg-black text-white p-1 rounded'>{text}</span></div>;