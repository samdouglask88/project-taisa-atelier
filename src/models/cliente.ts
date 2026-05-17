export {}
const mongoose = require('mongoose')
const { Schema } = mongoose

//Coluna de Cliente
const ClienteSchema = new Schema({
    nome:        { type: String, required: true},
    email:       { type: String, required: true},
    telefone:    { type: String, required: true },
    endereco:    { type: String, required: true},
    instagram:   { type: String, required: true },
    
})

//exporta o modelo para ser usado em outros arquivos
module.exports = mongoose.model('Cliente', ClienteSchema)