import React from 'react';

export const AccordionItem = ({ title, children }: any) => <div><div className='p-4 font-bold border-b'>{title}</div><div className='p-4'>{children}</div></div>;