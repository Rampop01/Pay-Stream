export const generateRole = (overrides?: any) => ({
  id: Math.random().toString(36).substr(2, 9),
  createdAt: new Date().toISOString(),
  updatedAt: new Date().toISOString(),
  isActive: true,
  ...overrides
});
