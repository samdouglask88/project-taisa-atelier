export{}
const { Router } = require('express')
const { login, registrar } = require('../controllers/AuthController')

const router = Router()

router.post('/login', login)
router.post('/registrar', registrar)

module.exports = router 