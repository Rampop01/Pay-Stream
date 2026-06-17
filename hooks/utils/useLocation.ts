import { useState } from 'react';
export const useLocation = () => { const [loc] = useState(window.location); return loc; };