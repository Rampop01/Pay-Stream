// Security and Validation Utilities


// Patch 1
export const escapeHtml = (str: string) => str.replace(/[&<>"']/g, m => ({'&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;'}[m]));

// Patch 2
export const sanitizeQuery = (q: string) => q.replace(/[^a-zA-Z0-9 -]/g, '');

// Patch 3
export const isValidStacksAddress = (addr: string) => addr.startsWith('SP') && addr.length > 38;

// Patch 4
export const safeMerge = (target: any, source: any) => { for (const key in source) { if (key !== '__proto__' && key !== 'constructor') target[key] = source[key]; } return target; };
