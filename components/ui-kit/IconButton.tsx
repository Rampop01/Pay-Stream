import React from 'react';

export const IconButton = ({ icon, ...props }: any) => <button className='p-2 bg-gray-100 rounded-full' {...props}>{icon}</button>;