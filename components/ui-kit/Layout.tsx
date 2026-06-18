import React from 'react';

export const Layout = ({ sidebar, content }: any) => <div className='flex'>{sidebar}<main className='flex-1'>{content}</main></div>;