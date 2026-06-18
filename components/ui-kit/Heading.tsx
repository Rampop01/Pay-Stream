import React from 'react';

export const Heading = ({ level=1, children }: any) => { const Tag:any = `h${level}`; return <Tag className='font-bold'>{children}</Tag>; };