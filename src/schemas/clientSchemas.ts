import { z } from 'zod'

export const createClientSchema = z.object({
    name: z.string().trim().min(1).max(120),
    email: z.string().trim().toLowerCase().email().max(200),
    phone: z.string().trim().min(8).max(20),
    address: z.string().trim().max(300).optional(),
    instagram: z.string().trim().max(60).optional(),
})

export const updateClientSchema = createClientSchema.partial()
