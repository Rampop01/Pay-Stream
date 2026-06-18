import React from 'react';

export const Tab = ({ active, children }: any) => <button className={`p-4 ${active?'border-b-2 border-blue-500':''}`}>{children}</button>;