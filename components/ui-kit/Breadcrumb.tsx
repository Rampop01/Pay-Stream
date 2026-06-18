import React from 'react';

export const Breadcrumb = ({ items }: any) => <nav>{items.join(' / ')}</nav>;