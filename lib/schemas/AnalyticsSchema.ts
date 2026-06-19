import { z } from 'zod';

export const AnalyticsSchema = z.object({
  id: z.string().uuid(),
  createdAt: z.date(),
  updatedAt: z.date(),
  isActive: z.boolean().default(true),
  metadata: z.record(z.unknown()).optional()
});

export type Analytics = z.infer<typeof AnalyticsSchema>;
