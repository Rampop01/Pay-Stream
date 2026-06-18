import React from 'react';

export const Stepper = ({ steps, current }: any) => <div className='flex justify-between'>{steps.map((s:any, i:number) => <div key={i} className={i<=current?'text-blue-500':'text-gray-400'}>{s}</div>)}</div>;