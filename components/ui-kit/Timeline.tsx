import React from 'react';

export const Timeline = ({ items }: any) => <div className='border-l-2 ml-4'>{items.map((i:any, idx:number) => <div key={idx} className='pl-4 mb-4 relative'><div className='absolute w-3 h-3 bg-blue-500 rounded-full -left-[7px] top-1'/>{i}</div>)}</div>;