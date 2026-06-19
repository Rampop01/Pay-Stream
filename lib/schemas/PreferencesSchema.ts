import { z } from 'zod';

export const PreferencesSchema = z.object({
  id: z.string().uuid(),
  createdAt: z.date(),
  updatedAt: z.date(),
  isActive: z.boolean().default(true),
  metadata: z.record(z.unknown()).optional()
});

export type Preferences = z.infer<typeof PreferencesSchema>;
