import React from 'react';

export const Link = ({ href, children }: any) => <a href={href} className='text-blue-500 hover:underline'>{children}</a>;