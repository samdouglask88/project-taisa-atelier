export {}
const Servico = require('../models/Servico')

const listarServicos = async (req: any, res: any) => {
    try {
        const servicos = await Servico.find()
        res.json({ mensagem: 'Serviços listados com sucesso', dados: servicos })
    } catch (error) {
        res.status(500).json({ error: 'Erro ao listar os serviços' })
    }
}

const criarServico = async (req: any, res: any) => {
    try {
        const novoServico = await Servico.create(req.body)
        res.status(201).json({ mensagem: 'Serviço criado com sucesso', dados: novoServico })
    } catch (error) {
        res.status(500).json({ error: 'Erro ao criar o serviço' })
    }
}

const atualizarServico = async (req: any, res: any) => {
    const { id } = req.params
    try {
        const servicoAtualizado = await Servico.findByIdAndUpdate(id, req.body, { new: true })
        if (!servicoAtualizado) {
            return res.status(404).json({ error: 'Serviço não encontrado' })
        }
        res.json({ mensagem: 'Serviço atualizado com sucesso', dados: servicoAtualizado })
    } catch (error) {
        res.status(500).json({ error: 'Erro ao atualizar o serviço' })
    }
}

const deletarServico = async (req: any, res: any) => {
    try {
        const servicoDeletado = await Servico.findByIdAndDelete(req.params.id)
        if (!servicoDeletado) {
            return res.status(404).json({ error: 'Serviço não encontrado' })
        }
        res.json({ mensagem: 'Serviço deletado com sucesso', dados: servicoDeletado })
    } catch (error) {
        res.status(500).json({ error: 'Erro ao deletar o serviço' })
    }
}

module.exports = { listarServicos, criarServico, atualizarServico, deletarServico }