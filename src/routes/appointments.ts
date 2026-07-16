import { Router } from 'express'
import { listAppointments, bookAppointment, createAppointment, updateAppointment, deleteAppointment } from '../controllers/AppointmentController'
import authenticate from '../middlewares/authenticate'
import validateRequest from '../middlewares/validateRequest'
import { bookAppointmentSchema, createAppointmentSchema, updateAppointmentSchema } from '../schemas/appointmentSchemas'
import { bookingRateLimiter } from '../middlewares/rateLimiters'

const router = Router()

router.post('/book', bookingRateLimiter, validateRequest(bookAppointmentSchema), bookAppointment)

router.get('/', authenticate, listAppointments)
router.post('/', authenticate, validateRequest(createAppointmentSchema), createAppointment)
router.put('/:id', authenticate, validateRequest(updateAppointmentSchema), updateAppointment)
router.delete('/:id', authenticate, deleteAppointment)

export default router
