import React from 'react';

export const Gallery = ({ images }: any) => <div className='grid grid-cols-3 gap-4'>{images.map((img:string, i:number) => <img key={i} src={img} />)}</div>;