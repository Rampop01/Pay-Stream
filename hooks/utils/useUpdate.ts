import { useReducer } from 'react';
export const useUpdate = () => useReducer((n) => n + 1, 0)[1];