import React from 'react';

export const Dropdown = ({ trigger, menu }: any) => <div className='relative'>{trigger}<div className='absolute mt-2'>{menu}</div></div>;