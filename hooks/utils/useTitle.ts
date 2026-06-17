import { useEffect } from 'react';
export const useTitle = (t: string) => { useEffect(() => { document.title = t; }, [t]); };