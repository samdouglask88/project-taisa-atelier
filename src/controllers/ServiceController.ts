import Service from '../models/Service'

export const listServices = async (_req: any, res: any) => {
    try {
        const services = await Service.find({ active: true })
        res.json(services)
    } catch (error) {
        res.status(500).json({ error: 'Failed to list services' })
    }
}

export const createService = async (req: any, res: any) => {
    try {
        const newService = await Service.create(req.body)
        res.status(201).json(newService)
    } catch (error) {
        res.status(500).json({ error: 'Failed to create service' })
    }
}

export const updateService = async (req: any, res: any) => {
    try {
        const updated = await Service.findByIdAndUpdate(req.params.id, req.body, { new: true })
        if (!updated) return res.status(404).json({ error: 'Service not found' })
        res.json(updated)
    } catch (error) {
        res.status(500).json({ error: 'Failed to update service' })
    }
}

export const deleteService = async (req: any, res: any) => {
    try {
        const deleted = await Service.findByIdAndDelete(req.params.id)
        if (!deleted) return res.status(404).json({ error: 'Service not found' })
        res.json({ message: 'Service deleted' })
    } catch (error) {
        res.status(500).json({ error: 'Failed to delete service' })
    }
}
