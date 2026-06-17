import { useState } from 'react';
export const useCounter = (initial = 0) => { const [c, setC] = useState(initial); return { count: c, inc: () => setC(c+1), dec: () => setC(c-1) }; };