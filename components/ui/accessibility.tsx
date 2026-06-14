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

// UI Polish 5
export const AnimatedCard = () => <div className='hover:scale-105 transition-transform' />;

// UI Polish 6
export const SemanticMain = ({children}:any) => <main role='main'>{children}</main>;

// UI Polish 7
export const ResponsiveModal = () => <div className='p-4 md:p-8' />;
