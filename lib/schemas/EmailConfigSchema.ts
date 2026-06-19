import { z } from 'zod';

export const EmailConfigSchema = z.object({
  id: z.string().uuid(),
  createdAt: z.date(),
  updatedAt: z.date(),
  isActive: z.boolean().default(true),
  metadata: z.record(z.unknown()).optional()
});

export type EmailConfig = z.infer<typeof EmailConfigSchema>;
