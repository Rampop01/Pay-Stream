import React from 'react';

export const Select = ({ children, ...props }: any) => <select className='border p-2 rounded w-full' {...props}>{children}</select>;