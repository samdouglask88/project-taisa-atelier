export {}
const { Router } = require('express')
const { listAppointments, createAppointment, updateAppointment, deleteAppointment } = require('../controllers/AppointmentController')

const router = Router()

router.get('/', listAppointments)
router.post('/', createAppointment)
router.put('/:id', updateAppointment)
router.delete('/:id', deleteAppointment)

module.exports = router
