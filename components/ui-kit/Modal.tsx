import React from 'react';

export const Modal = ({ isOpen, children }: any) => isOpen ? <div className='fixed inset-0 bg-black/50 flex items-center justify-center'><div className='bg-white p-6 rounded'>{children}</div></div> : null;