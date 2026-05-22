export {}
const { Router } = require('express')
const { listarAgendamentos, criarAgendamento, atualizarAgendamento, deletarAgendamento } = require('../controllers/AgendamentoController')

const router = Router()

router.get('/', listarAgendamentos)
router.post('/', criarAgendamento)
router.put('/:id', atualizarAgendamento)
router.delete('/:id', deletarAgendamento)


module.exports = router