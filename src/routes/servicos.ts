export {}
const { Router } = require('express')
const { listarServicos, criarServico, atualizarServico, deletarServico } = require('../controllers/ServicoController')

const router = Router()

router.get('/', listarServicos)
router.post('/', criarServico)
router.put('/:id', atualizarServico)
router.delete('/:id', deletarServico)

module.exports = router