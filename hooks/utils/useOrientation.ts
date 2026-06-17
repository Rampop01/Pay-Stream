import { useState, useEffect } from 'react';
export const useOrientation = () => { const [state, setState] = useState({ angle: 0, type: 'landscape-primary' }); return state; };