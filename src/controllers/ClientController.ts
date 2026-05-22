export {}
const Cliente = require('../models/Cliente')



// Função para listar os clientes
const listarClientes = async (req: any, res: any) => {
    try {
        const clientes = await Cliente.find()
        res.json({mensagem: 'Clientes listados com sucesso', dados: clientes})
    } catch (error){
        res.status(500).json({error: 'Erro ao listar os clientes'})
    }
}    
// Função para criar um novo cliente
const criarCliente = async (req:any, res:any) => {
    try {
        const novoCliente = await Cliente.create(req.body)
        res.status(201).json({mensagem: 'Cliente criado com sucesso', dados: novoCliente})
    } catch (error) {
        res.status(500).json({error: 'Erro ao criar o cliente'})
    }
}
//atualizar um cliente existente
const atualizarCliente = async (req:any, res:any) =>{
    const {id} =req.params
    try {
        const clienteAtualizado = await Cliente.findByIdAndUpdate(id, req.body, {new: true})
            if (!clienteAtualizado){
                return res.status(404).json({error: 'Cliente não encontrado'})
            }
            res.json({mensagem: 'Cliente atualizado com sucesso', dados: clienteAtualizado})
        } catch (error){
            res.status(500).json({error: 'Erro ao atualizar o cliente'})    

        }
}
//deletar um cliente   
const deletarCliente = async (req:any, res:any) => {
    try {
        const clienteDeletado = await Cliente.findByIdAndDelete(req.params.id)
        if (!clienteDeletado){
            return res.status(404).json({error: 'Cliente não encontrado'})
        }
        res.json({mensagem: 'Cliente deletado com sucesso', dados: clienteDeletado})
    } catch (error){
        res.status(500).json({error: 'Erro ao deletar o cliente'})
    }
}

module.exports = {listarClientes, criarCliente, atualizarCliente, deletarCliente}