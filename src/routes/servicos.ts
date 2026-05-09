// src/routes/servicos.ts
const { Router } = require('express')
const { listarServicos } = require('../controllers/ServicoController')
const { criarServico } = require('../controllers/ServicoController')


const router = Router()// Cria um roteador do Express para definir as rotas relacionadas aos serviços

router.get('/', listarServicos)// Define a rota GET para listar os serviços, associando-a à função listarServicos do controlador
router.post('/', criarServico)// Define a rota POST para criar um novo serviço, associando-a à função criarServico do controlador
module.exports = router