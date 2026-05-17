export {}
const Agendamento = require('../models/Agendamento')

// função para listar os agendamentos
const listarAgendamentos = async (req:any, res:any) => {
    try {
        const agendamentos = await Agendamento.find()
        res.json ({mensagem: 'Agendamentos listados com sucesso', dados: agendamentos})
    } catch (error){
        res.status(500).json({error: 'Error ao listar os agendamentos'})
    }
}
// função para criar um novo agendamento
const criarAgendamento = async (req:any, res:any) => {
    try {
        const novoAgendamento = await Agendamento.create(req.body)
        if (!novoAgendamento){
            return res.status(400).json({error: 'dados do aggendamento inválidos'})
        }
        res.status(201).json({mensagem: 'Agendamento criado com sucesso', dados: novoAgendamento})
    } catch (error){
        res.status(500).json({error: 'Erro ao criar o agendamento'})
    }
}
// função para atualizar um agendamento existente
const atualizarAgendamento = async (req:any, res:any) => {
    const {id} = req.params
    try {
        const agendamentoAtualizado = await Agendamento.findByIdAndUpdate(id, req.body, {new: true})
        if (!agendamentoAtualizado){
            return res.status(404).json({error: 'Agendamento não encontrado'})
        }
        res.json({mensagem: 'Agendamento atualizado com sucesso', dados: agendamentoAtualizado})
    } catch (error){
        res.status(500).json({error: 'Erro ao atualizar o agendamento'})
    }
}
// função para deletar um agendamento 
const deletarAgendamento = async (req:any, res:any) => {
    try {
        const agendamentoDeletado = await Agendamento.findByIdAndDelete(req.params.id)
        if (!agendamentoDeletado){
            return res.status(404).json({error: 'Agendamento não encontrado'})
        }
        res.json({mensagem: 'Agendamento deletado com sucesso', dados: agendamentoDeletado})
    } catch (error){
        res.status(500).json({error: 'Erro ao deletar o agendamento'})
    }
}

module.exports = {listarAgendamentos, criarAgendamento, atualizarAgendamento, deletarAgendamento}