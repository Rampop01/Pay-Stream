import { useState } from 'react';
export const useToggle = (initial = false) => { const [state, setState] = useState(initial); return [state, () => setState(s => !s)] as const; };