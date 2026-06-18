import React from 'react';

export const Label = ({ children, htmlFor }: any) => <label htmlFor={htmlFor} className='block text-sm font-medium mb-1'>{children}</label>;