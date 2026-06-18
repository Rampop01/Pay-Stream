import React from 'react';

export const PricingCard = ({ plan, price }: any) => <div className='border p-6 rounded text-center'><h3>{plan}</h3><p className='text-3xl font-bold'>${price}</p></div>;