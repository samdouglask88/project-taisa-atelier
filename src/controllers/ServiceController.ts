export {}
const Service = require('../models/Service')

const listServices = async (req: any, res: any) => {
    try {
        const services = await Service.find()
        res.json({ message: 'Services listed successfully', data: services })
    } catch (error) {
        res.status(500).json({ error: 'Failed to list services' })
    }
}

const createService = async (req: any, res: any) => {
    try {
        const newService = await Service.create(req.body)
        res.status(201).json({ message: 'Service created successfully', data: newService })
    } catch (error) {
        res.status(500).json({ error: 'Failed to create service' })
    }
}

const updateService = async (req: any, res: any) => {
    const { id } = req.params
    try {
        const updatedService = await Service.findByIdAndUpdate(id, req.body, { new: true })
        if (!updatedService) {
            return res.status(404).json({ error: 'Service not found' })
        }
        res.json({ message: 'Service updated successfully', data: updatedService })
    } catch (error) {
        res.status(500).json({ error: 'Failed to update service' })
    }
}

const deleteService = async (req: any, res: any) => {
    try {
        const deletedService = await Service.findByIdAndDelete(req.params.id)
        if (!deletedService) {
            return res.status(404).json({ error: 'Service not found' })
        }
        res.json({ message: 'Service deleted successfully', data: deletedService })
    } catch (error) {
        res.status(500).json({ error: 'Failed to delete service' })
    }
}

module.exports = { listServices, createService, updateService, deleteService }
