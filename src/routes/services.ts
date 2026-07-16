import { Router } from 'express'
import { listServices, createService, updateService, deleteService } from '../controllers/ServiceController'
import authenticate from '../middlewares/authenticate'
import validateRequest from '../middlewares/validateRequest'
import { createServiceSchema, updateServiceSchema } from '../schemas/serviceSchemas'

const router = Router()

router.get('/', listServices)
router.post('/', authenticate, validateRequest(createServiceSchema), createService)
router.put('/:id', authenticate, validateRequest(updateServiceSchema), updateService)
router.delete('/:id', authenticate, deleteService)

export default router
