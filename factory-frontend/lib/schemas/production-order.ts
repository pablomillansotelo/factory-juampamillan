import { z } from 'zod';

export const productionOrderSchema = z.object({
  status: z.enum(['pending', 'approved', 'in_production', 'completed', 'cancelled']).optional(),
  notes: z.string().optional(),
  estimatedCompletionDate: z.string().optional().nullable(),
});

export type ProductionOrderFormData = z.infer<typeof productionOrderSchema>;

