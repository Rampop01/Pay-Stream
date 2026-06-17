import { useState } from 'react';
export const useDrag = () => { const [dragging, setDragging] = useState(false); return dragging; };