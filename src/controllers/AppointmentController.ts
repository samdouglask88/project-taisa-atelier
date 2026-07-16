import { Request, Response } from 'express'
import Appointment from '../models/Appointment'
import Client from '../models/Client'
import { stripUndefined } from '../utils/stripUndefined'
import { notifyAppointment, NotificationEvent } from '../services/notifications'

const NOTIFIABLE_STATUSES: NotificationEvent[] = ['confirmado', 'cancelado', 'concluido']

export const listAppointments = async (_req: Request, res: Response) => {
    try {
        const appointments = await Appointment.find().populate('client').sort({ createdAt: -1 })
        res.json(appointments)
    } catch (error) {
        res.status(500).json({ error: 'Failed to list appointments' })
    }
}

export const bookAppointment = async (req: Request, res: Response) => {
    try {
        const { nome, email, telefone, servicoNome, preco, data, hora, observacoes } = req.body
        const client = await Client.findOneAndUpdate(
            { email },
            { name: nome, email, phone: telefone },
            { upsert: true, new: true, setDefaultsOnInsert: true }
        )
        const appointment = await Appointment.create({
            client: client._id,
            date: data,
            time: hora,
            service: servicoNome,
            price: preco ?? 0,
            status: 'pendente',
            notes: observacoes ?? '',
        })
        const populated = await appointment.populate('client')

        void notifyAppointment({
            appointmentId: String(appointment._id),
            phone: telefone,
            clientName: nome,
            service: servicoNome,
            date: data,
            time: hora,
            event: 'booked',
        })

        res.status(201).json(populated)
    } catch (error) {
        res.status(500).json({ error: 'Failed to book appointment' })
    }
}

export const createAppointment = async (req: Request, res: Response) => {
    try {
        const { client, date, time, service, price, status, notes } = req.body
        const newAppointment = await Appointment.create(stripUndefined({ client, date, time, service, price, status, notes }))
        res.status(201).json(newAppointment)
    } catch (error) {
        res.status(500).json({ error: 'Failed to create appointment' })
    }
}

export const updateAppointment = async (req: Request, res: Response) => {
    try {
        const { date, time, service, price, status, notes } = req.body
        const updateFields = stripUndefined({ date, time, service, price, status, notes })
        const updated = await Appointment.findByIdAndUpdate(req.params.id, updateFields, { new: true }).populate('client')
        if (!updated) return res.status(404).json({ error: 'Appointment not found' })

        if (status && (NOTIFIABLE_STATUSES as string[]).includes(status)) {
            const client = updated.client as any
            if (client?.phone) {
                void notifyAppointment({
                    appointmentId: String(updated._id),
                    phone: client.phone,
                    clientName: client.name,
                    service: updated.service,
                    date: updated.date,
                    time: updated.time,
                    event: status as NotificationEvent,
                })
            }
        }

        res.json(updated)
    } catch (error) {
        res.status(500).json({ error: 'Failed to update appointment' })
    }
}

export const deleteAppointment = async (req: Request, res: Response) => {
    try {
        const deleted = await Appointment.findByIdAndDelete(req.params.id)
        if (!deleted) return res.status(404).json({ error: 'Appointment not found' })
        res.json({ message: 'Appointment deleted' })
    } catch (error) {
        res.status(500).json({ error: 'Failed to delete appointment' })
    }
}
