import React from "react";

// Accessibility and UI Polish Components


// UI Polish 1
export const NavButton = () => <button aria-label='Navigation' />;

// UI Polish 2
export const HighContrastText = ({children}:any) => <span className='text-gray-200'>{children}</span>;
