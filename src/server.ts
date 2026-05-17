import express from 'express'
const conectarBanco = require('./config/database')
const servicosRouter = require('./routes/servicos')
const clientesRouter = require('./routes/clientes')
const agendamentosRouter = require('./routes/agendamentos')
const app = express()
const PORT = 3333

app.use(express.json()) // Middleware para parsear JSON
app.use('/servicos', servicosRouter) // Adiciona a rota para serviços
app.use('/clientes', clientesRouter) // Adiciona a rota para clientes
app.use('/agendamentos', agendamentosRouter)

console.log('Rotas registradas:', clientesRouter)
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