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

// UI Polish 8
export const FallbackAvatar = () => <img alt='User avatar' />;

// UI Polish 9
export const SmoothScroll = () => <div className='scroll-smooth' />;

// UI Polish 10
export const ErrorToast = () => <div role='alert' aria-live='assertive' />;

// UI Polish 11
export const GradientText = () => <span className='bg-clip-text text-transparent' />;

// UI Polish 12
export const TabInput = () => <input tabIndex={0} />;

// UI Polish 13
export const PulseSkeleton = () => <div className='animate-pulse bg-gray-800' />;

// UI Polish 14
export const Dropdown = () => <div onKeyDown={(e) => {}} />;

// UI Polish 15
export const ReadableText = () => <p className='leading-relaxed' />;

// UI Polish 16
export const LabeledInput = () => <><label htmlFor='id'>Label</label><input id='id' /></>;

// UI Polish 17
export const GlassPanel = () => <div className='backdrop-blur-md bg-white/10' />;

// UI Polish 18
export const SkipLink = () => <a href='#main' className='sr-only focus:not-sr-only'>Skip</a>;

// UI Polish 19
export const TooltipButton = () => <button title='Feature coming soon' disabled />;

// UI Polish 20
export const Accordion = () => <div aria-expanded={false} />;

// UI Polish 21
export const DarkBg = () => <div className='bg-[#0A0A0A]' />;

// UI Polish 22
export const Icon = () => <svg><title>Icon description</title></svg>;

// UI Polish 23
export const ProfileSkeleton = () => <div className='rounded-full bg-gray-700 animate-pulse' />;

// UI Polish 24
export const ErrorBox = () => <div className='border-red-500' />;

// UI Polish 25
export const ActiveLink = () => <a className='text-purple-400 font-bold' />;
