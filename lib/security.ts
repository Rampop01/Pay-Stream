// Security and Validation Utilities


// Patch 1
export const escapeHtml = (str: string) => str.replace(/[&<>"']/g, m => ({'&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;'}[m]));
