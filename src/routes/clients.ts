import { Router } from 'express'
import { listClients, createClient, updateClient, deleteClient } from '../controllers/ClientController'
import authenticate from '../middlewares/authenticate'
import validateRequest from '../middlewares/validateRequest'
import { createClientSchema, updateClientSchema } from '../schemas/clientSchemas'

const router = Router()

router.get('/', authenticate, listClients)
router.post('/', authenticate, validateRequest(createClientSchema), createClient)
router.put('/:id', authenticate, validateRequest(updateClientSchema), updateClient)
router.delete('/:id', authenticate, deleteClient)

export default router
