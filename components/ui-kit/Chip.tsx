import React from 'react';

export const Chip = ({ text, onRemove }: any) => <div className='inline-flex items-center bg-gray-200 rounded-full px-3 py-1'>{text} <button onClick={onRemove} className='ml-2 text-gray-500'>x</button></div>;