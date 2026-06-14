import React from "react";

// Accessibility and UI Polish Components


// UI Polish 1
export const NavButton = () => <button aria-label='Navigation' />;

// UI Polish 2
export const HighContrastText = ({children}:any) => <span className='text-gray-200'>{children}</span>;

// UI Polish 3
export const FocusableLink = () => <a href='#' className='focus-visible:ring-2' />;

// UI Polish 4
export const SrOnly = ({children}:any) => <span className='sr-only'>{children}</span>;
