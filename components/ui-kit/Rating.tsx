import React from 'react';

export const Rating = ({ value }: any) => <div>{'★'.repeat(value)}{'☆'.repeat(5-value)}</div>;