export {}
const { Router } = require('express')
const { listServices, createService, updateService, deleteService } = require('../controllers/ServiceController')

const router = Router()

router.get('/', listServices)
router.post('/', createService)
router.put('/:id', updateService)
router.delete('/:id', deleteService)

module.exports = router
