export {}
const Appointment = require('../models/Appointment')

const listAppointments = async (req: any, res: any) => {
    try {
        const appointments = await Appointment.find()
        res.json({ message: 'Appointments listed successfully', data: appointments })
    } catch (error) {
        res.status(500).json({ error: 'Failed to list appointments' })
    }
}

const createAppointment = async (req: any, res: any) => {
    try {
        const newAppointment = await Appointment.create(req.body)
        if (!newAppointment) {
            return res.status(400).json({ error: 'Invalid appointment data' })
        }
        res.status(201).json({ message: 'Appointment created successfully', data: newAppointment })
    } catch (error) {
        res.status(500).json({ error: 'Failed to create appointment' })
    }
}

const updateAppointment = async (req: any, res: any) => {
    const { id } = req.params
    try {
        const updatedAppointment = await Appointment.findByIdAndUpdate(id, req.body, { new: true })
        if (!updatedAppointment) {
            return res.status(404).json({ error: 'Appointment not found' })
        }
        res.json({ message: 'Appointment updated successfully', data: updatedAppointment })
    } catch (error) {
        res.status(500).json({ error: 'Failed to update appointment' })
    }
}

const deleteAppointment = async (req: any, res: any) => {
    try {
        const deletedAppointment = await Appointment.findByIdAndDelete(req.params.id)
        if (!deletedAppointment) {
            return res.status(404).json({ error: 'Appointment not found' })
        }
        res.json({ message: 'Appointment deleted successfully', data: deletedAppointment })
    } catch (error) {
        res.status(500).json({ error: 'Failed to delete appointment' })
    }
}

module.exports = { listAppointments, createAppointment, updateAppointment, deleteAppointment }
