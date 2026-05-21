import { clsx, type ClassValue } from 'clsx'
import { twMerge } from 'tailwind-merge'

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

// refactor(ui): optimize padding in Button component - verification check

// style(navbar): enhance mobile navigation layout - verification check
