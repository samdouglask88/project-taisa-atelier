import { z } from 'zod'

export const createServiceSchema = z.object({
    name: z.string().trim().min(1).max(120),
    description: z.string().trim().min(1).max(1000),
    price: z.number().nonnegative(),
    durationMinutes: z.number().int().positive().optional(),
    category: z.string().trim().min(1).max(60),
    active: z.boolean().optional(),
})

export const updateServiceSchema = createServiceSchema.partial()
