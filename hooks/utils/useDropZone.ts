import { useState } from 'react';
export const useDropZone = () => { const [isOver, setIsOver] = useState(false); return isOver; };