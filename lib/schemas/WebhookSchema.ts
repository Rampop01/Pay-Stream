import { z } from 'zod';

export const WebhookSchema = z.object({
  id: z.string().uuid(),
  createdAt: z.date(),
  updatedAt: z.date(),
  isActive: z.boolean().default(true),
  metadata: z.record(z.unknown()).optional()
});

export type Webhook = z.infer<typeof WebhookSchema>;
