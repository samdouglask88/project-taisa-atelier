import { z } from 'zod'

const objectId = z.string().trim().regex(/^[0-9a-fA-F]{24}$/, 'Invalid id')

export const APPOINTMENT_STATUSES = ['pendente', 'confirmado', 'concluido', 'cancelado', 'scheduled'] as const

export const bookAppointmentSchema = z.object({
    nome: z.string().trim().min(1).max(120),
    email: z.string().trim().toLowerCase().email().max(200),
    telefone: z.string().trim().min(8).max(20),
    servicoNome: z.string().trim().min(1).max(120),
    preco: z.number().nonnegative().optional(),
    data: z.string().trim().min(1).max(20),
    hora: z.string().trim().min(1).max(10),
    observacoes: z.string().trim().max(1000).optional(),
})

export const createAppointmentSchema = z.object({
    client: objectId,
    date: z.string().trim().min(1).max(20),
    time: z.string().trim().min(1).max(10),
    service: z.string().trim().min(1).max(120),
    price: z.number().nonnegative(),
    status: z.enum(APPOINTMENT_STATUSES).optional(),
    notes: z.string().trim().max(1000).optional(),
})

export const updateAppointmentSchema = z.object({
    date: z.string().trim().min(1).max(20).optional(),
    time: z.string().trim().min(1).max(10).optional(),
    service: z.string().trim().min(1).max(120).optional(),
    price: z.number().nonnegative().optional(),
    status: z.enum(APPOINTMENT_STATUSES).optional(),
    notes: z.string().trim().max(1000).optional(),
})
