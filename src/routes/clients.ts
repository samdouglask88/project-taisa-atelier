export {}
const { Router } = require('express')
const { listClients, createClient, updateClient, deleteClient } = require('../controllers/ClientController')

const router = Router()

router.get('/', listClients)
router.post('/', createClient)
router.put('/:id', updateClient)
router.delete('/:id', deleteClient)

module.exports = router
