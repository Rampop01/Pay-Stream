import React from 'react';

export const Sparkline = ({ data }: any) => <svg className='w-full h-8'><polyline points={data.map((d:any, i:number) => `${i*10},${32-d}`).join(' ')} fill='none' stroke='blue' /></svg>;