import React from 'react';

export const Text = ({ children, size='md' }: any) => <p className={`text-${size}`}>{children}</p>;