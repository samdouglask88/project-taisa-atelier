import mongoose from 'mongoose'

const conectarBanco = async (): Promise<void> => {
    try {
        await mongoose.connect('mongodb://localhost:27017/taisa-atelier')
        console.log('MongoDB conectado com sucesso!')
    } catch (error) {
        console.error('Erro ao conectar no MongoDB:', error)
        process.exit(1)
    }
}

module.exports = conectarBanco