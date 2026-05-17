import e from 'express'
import mongoose, { Schema, Document } from 'mongoose'



//Coluna de Agendamento
interface Servico extends Document {
    nome: string
    descricao: string
    preco: number
    duracaoHoras?: number
    categoria: string
    ativo: boolean
}
//registra o modelo de serviço no mongoose
 const ServicoSchema = new Schema({
    nome:        { type: String, required: true },
    descricao:   { type: String, required: true },
    preco:       { type: Number, required: true },
    duracaoHoras:{ type: Number },
    categoria:   { type: String, required: true },
    ativo:       { type: Boolean, default: true },
    
})
//exporta o modelo para ser usado em outros arquivos
export default mongoose.model<Servico>('Servico', ServicoSchema)
module.exports = mongoose.model('Servico', ServicoSchema)

