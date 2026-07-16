import { Request, Response } from 'express'
import Service from '../models/Service'
import { stripUndefined } from '../utils/stripUndefined'

export const listServices = async (_req: Request, res: Response) => {
    try {
        const services = await Service.find({ active: true })
        res.json(services)
    } catch (error) {
        res.status(500).json({ error: 'Failed to list services' })
    }
}

export const createService = async (req: Request, res: Response) => {
    try {
        const { name, description, price, durationMinutes, category, active } = req.body
        const newService = await Service.create(stripUndefined({ name, description, price, durationMinutes, category, active }))
        res.status(201).json(newService)
    } catch (error) {
        res.status(500).json({ error: 'Failed to create service' })
    }
}

export const updateService = async (req: Request, res: Response) => {
    try {
        const { name, description, price, durationMinutes, category, active } = req.body
        const updateFields = stripUndefined({ name, description, price, durationMinutes, category, active })
        const updated = await Service.findByIdAndUpdate(req.params.id, updateFields, { new: true })
        if (!updated) return res.status(404).json({ error: 'Service not found' })
        res.json(updated)
    } catch (error) {
        res.status(500).json({ error: 'Failed to update service' })
    }
}

export const deleteService = async (req: Request, res: Response) => {
    try {
        const deleted = await Service.findByIdAndDelete(req.params.id)
        if (!deleted) return res.status(404).json({ error: 'Service not found' })
        res.json({ message: 'Service deleted' })
    } catch (error) {
        res.status(500).json({ error: 'Failed to delete service' })
    }
}
