import { Request, Response } from 'express'
const Servico = require('../models/Servico')

// Busca todos os serviços no banco
const listarServicos = async (req: Request, res: Response) => {
    try {
        const servicos = await Servico.find()
        res.json({ mensagem: 'Serviços listados com sucesso', dados: servicos })
    } catch (error) {
        res.status(500).json({ error: 'Erro ao listar os serviços' })
    }
}

// Cria um novo serviço com os dados do req.body
const criarServico = async (req: Request, res: Response) => {
    try {
        const novoServico = await Servico.create(req.body)
        res.status(201).json({ mensagem: 'Serviço criado com sucesso', dados: novoServico })
    } catch (error) {
        res.status(500).json({ error: 'Erro ao criar o serviço' })
    }
}

// Exporta as funções para as rotas
module.exports = { listarServicos, criarServico }