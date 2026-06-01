import { Router } from 'express'
import { listAppointments, bookAppointment, createAppointment, updateAppointment, deleteAppointment } from '../controllers/AppointmentController'
import authenticate from '../middlewares/authenticate'

const router = Router()

router.post('/book', bookAppointment)

router.get('/', authenticate, listAppointments)
router.post('/', authenticate, createAppointment)
router.put('/:id', authenticate, updateAppointment)
router.delete('/:id', authenticate, deleteAppointment)

export default router
