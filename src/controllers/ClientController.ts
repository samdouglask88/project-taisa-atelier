import Client from '../models/Client'

export const listClients = async (_req: any, res: any) => {
    try {
        const clients = await Client.find()
        res.json(clients)
    } catch (error) {
        res.status(500).json({ error: 'Failed to list clients' })
    }
}

export const createClient = async (req: any, res: any) => {
    try {
        const newClient = await Client.create(req.body)
        res.status(201).json(newClient)
    } catch (error) {
        res.status(500).json({ error: 'Failed to create client' })
    }
}

export const updateClient = async (req: any, res: any) => {
    try {
        const updated = await Client.findByIdAndUpdate(req.params.id, req.body, { new: true })
        if (!updated) return res.status(404).json({ error: 'Client not found' })
        res.json(updated)
    } catch (error) {
        res.status(500).json({ error: 'Failed to update client' })
    }
}

export const deleteClient = async (req: any, res: any) => {
    try {
        const deleted = await Client.findByIdAndDelete(req.params.id)
        if (!deleted) return res.status(404).json({ error: 'Client not found' })
        res.json({ message: 'Client deleted' })
    } catch (error) {
        res.status(500).json({ error: 'Failed to delete client' })
    }
}
