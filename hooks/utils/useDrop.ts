import { useState } from 'react';
export const useDrop = () => { const [dropped, setDropped] = useState(false); return dropped; };