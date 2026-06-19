import { z } from 'zod';

export const ImageSchema = z.object({
  id: z.string().uuid(),
  createdAt: z.date(),
  updatedAt: z.date(),
  isActive: z.boolean().default(true),
  metadata: z.record(z.unknown()).optional()
});

export type Image = z.infer<typeof ImageSchema>;
