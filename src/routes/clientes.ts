export {}
const { Router } = require('express')
const { listarClientes, criarCliente, atualizarCliente, deletarCliente } = require('../controllers/ClienteController')

const router = Router()

router.get('/', listarClientes)
router.post('/', criarCliente)
router.put('/:id', atualizarCliente)
router.delete('/:id', deletarCliente)


module.exports = router