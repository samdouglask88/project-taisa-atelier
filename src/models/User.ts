export {}
const mongoose = require('mongoose')
const { Schema } = mongoose

//Coluna de Usuario
const UsuarioSchema = new Schema({
    nome:        { type: String, required: true},
    email:       { type: String, required: true, unique: true },
    senha:      { type: String, required: true },
})

//exporta o modelo para ser usado em outros arquivos
module.exports = mongoose.model('Usuario', UsuarioSchema)