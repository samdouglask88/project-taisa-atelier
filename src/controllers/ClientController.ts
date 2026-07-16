import { Request, Response } from 'express'
import Client from '../models/Client'
import { stripUndefined } from '../utils/stripUndefined'

export const listClients = async (_req: Request, res: Response) => {
    try {
        const clients = await Client.find()
        res.json(clients)
    } catch (error) {
        res.status(500).json({ error: 'Failed to list clients' })
    }
}

export const createClient = async (req: Request, res: Response) => {
    try {
        const { name, email, phone, address, instagram } = req.body
        const newClient = await Client.create(stripUndefined({ name, email, phone, address, instagram }))
        res.status(201).json(newClient)
    } catch (error) {
        res.status(500).json({ error: 'Failed to create client' })
    }
}

export const updateClient = async (req: Request, res: Response) => {
    try {
        const { name, email, phone, address, instagram } = req.body
        const updateFields = stripUndefined({ name, email, phone, address, instagram })
        const updated = await Client.findByIdAndUpdate(req.params.id, updateFields, { new: true })
        if (!updated) return res.status(404).json({ error: 'Client not found' })
        res.json(updated)
    } catch (error) {
        res.status(500).json({ error: 'Failed to update client' })
    }
}

export const deleteClient = async (req: Request, res: Response) => {
    try {
        const deleted = await Client.findByIdAndDelete(req.params.id)
        if (!deleted) return res.status(404).json({ error: 'Client not found' })
        res.json({ message: 'Client deleted' })
    } catch (error) {
        res.status(500).json({ error: 'Failed to delete client' })
    }
}
