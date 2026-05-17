export {}
const mongoose = require('mongoose')
const { Schema } = mongoose

//Coluna de agendamento
const AgendamentoSchema = new Schema({
    cliente:     { type: Schema.Types.ObjectId, ref: 'Cliente', required: true },
    data:        { type: Date, required: true },
    hora:        { type: String, required: true },
    servico:     { type: String, required: true },
    valor:       { type: Number, required: true },
    status: { type: String, default: 'agendado' }
})

//exporta o modelo para ser usado em outros arquivos
module.exports = mongoose.model('Agendamento', AgendamentoSchema)