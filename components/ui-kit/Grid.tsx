import React from 'react';

export const Grid = ({ cols, children }: any) => <div className={`grid grid-cols-${cols} gap-4`}>{children}</div>;