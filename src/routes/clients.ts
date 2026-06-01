import { Router } from 'express'
import { listClients, createClient, updateClient, deleteClient } from '../controllers/ClientController'

const router = Router()

router.get('/', listClients)
router.post('/', createClient)
router.put('/:id', updateClient)
router.delete('/:id', deleteClient)

export default router
