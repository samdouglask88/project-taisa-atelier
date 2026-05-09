import express from 'express'
const conectarBanco = require('./config/database')

const app = express()
const PORT = 3333

const servicosRouter = require('./routes/servicos').default || require('./routes/servicos')

app.use(express.json())
app.use('/servicos', servicosRouter)


const startServer = async () => {
    try {
        await conectarBanco()

        app.listen(PORT, () => {
            console.log(`Servidor rodando na porta ${PORT}`)
        })

    } catch (error) {
        console.error('Erro ao iniciar o servidor:', error)
    }
}

startServer()

