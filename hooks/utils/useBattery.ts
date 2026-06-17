import { useState, useEffect } from 'react';
export const useBattery = () => { const [state, setState] = useState({ fetched: false }); return state; };