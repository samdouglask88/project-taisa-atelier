import Appointment from '../models/Appointment'
import Client from '../models/Client'

export const listAppointments = async (_req: any, res: any) => {
    try {
        const appointments = await Appointment.find().populate('client').sort({ createdAt: -1 })
        res.json(appointments)
    } catch (error) {
        res.status(500).json({ error: 'Failed to list appointments' })
    }
}

export const bookAppointment = async (req: any, res: any) => {
    try {
        const { nome, email, telefone, servicoNome, preco, data, hora, observacoes } = req.body
        if (!nome || !email || !telefone || !servicoNome || !data || !hora) {
            return res.status(400).json({ error: 'nome, email, telefone, servicoNome, data e hora são obrigatórios' })
        }
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
            price: preco || 0,
            status: 'pendente',
            notes: observacoes || '',
        })
        const populated = await appointment.populate('client')
        res.status(201).json(populated)
    } catch (error) {
        res.status(500).json({ error: 'Failed to book appointment' })
    }
}

export const createAppointment = async (req: any, res: any) => {
    try {
        const newAppointment = await Appointment.create(req.body)
        res.status(201).json(newAppointment)
    } catch (error) {
        res.status(500).json({ error: 'Failed to create appointment' })
    }
}

export const updateAppointment = async (req: any, res: any) => {
    try {
        const updated = await Appointment.findByIdAndUpdate(req.params.id, req.body, { new: true })
        if (!updated) return res.status(404).json({ error: 'Appointment not found' })
        res.json(updated)
    } catch (error) {
        res.status(500).json({ error: 'Failed to update appointment' })
    }
}

export const deleteAppointment = async (req: any, res: any) => {
    try {
        const deleted = await Appointment.findByIdAndDelete(req.params.id)
        if (!deleted) return res.status(404).json({ error: 'Appointment not found' })
        res.json({ message: 'Appointment deleted' })
    } catch (error) {
        res.status(500).json({ error: 'Failed to delete appointment' })
    }
}
