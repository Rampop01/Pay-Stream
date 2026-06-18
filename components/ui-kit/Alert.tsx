import React from 'react';

export const Alert = ({ type, message }: any) => <div className={`p-4 rounded ${type==='error'?'bg-red-100':'bg-blue-100'}`}>{message}</div>;