import { z } from 'zod';

export const internalItemSchema = z.object({
  sku: z.string().min(1, 'El SKU es requerido'),
  name: z.string().min(1, 'El nombre es requerido'),
  description: z.string().optional().nullable(),
  status: z.enum(['active', 'inactive', 'archived']).default('active'),
});

export type InternalItemFormData = z.infer<typeof internalItemSchema>;

