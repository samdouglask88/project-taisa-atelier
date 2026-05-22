export {}
const Client = require('../models/Client')

const listClients = async (req: any, res: any) => {
    try {
        const clients = await Client.find()
        res.json({ message: 'Clients listed successfully', data: clients })
    } catch (error) {
        res.status(500).json({ error: 'Failed to list clients' })
    }
}

const createClient = async (req: any, res: any) => {
    try {
        const newClient = await Client.create(req.body)
        res.status(201).json({ message: 'Client created successfully', data: newClient })
    } catch (error) {
        res.status(500).json({ error: 'Failed to create client' })
    }
}

const updateClient = async (req: any, res: any) => {
    const { id } = req.params
    try {
        const updatedClient = await Client.findByIdAndUpdate(id, req.body, { new: true })
        if (!updatedClient) {
            return res.status(404).json({ error: 'Client not found' })
        }
        res.json({ message: 'Client updated successfully', data: updatedClient })
    } catch (error) {
        res.status(500).json({ error: 'Failed to update client' })
    }
}

const deleteClient = async (req: any, res: any) => {
    try {
        const deletedClient = await Client.findByIdAndDelete(req.params.id)
        if (!deletedClient) {
            return res.status(404).json({ error: 'Client not found' })
        }
        res.json({ message: 'Client deleted successfully', data: deletedClient })
    } catch (error) {
        res.status(500).json({ error: 'Failed to delete client' })
    }
}

module.exports = { listClients, createClient, updateClient, deleteClient }
