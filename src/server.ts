// src/server.ts
import express from 'express' 
const conectarBanco = require('./config/database')
const servicosRouter = require('./routes/servicos')
const clientesRouter = require('./routes/clientes')
const agendamentosRouter = require('./routes/agendamentos')
const authRouter = require('./routes/auth')
const autenticar = require('./middlewares/autenticar')
const app = express()
const PORT = 3333
// Middleware para lidar com CORS
app.use(express.json()) // Middleware para parsear JSON
app.use('/servicos', autenticar, servicosRouter)// Rota protegida para serviços, requer autenticação
app.use('/clientes', autenticar, clientesRouter)// Rota protegida para clientes, requer autenticação
app.use('/agendamentos', autenticar, agendamentosRouter)// Rota protegida para agendamentos, requer autenticação
app.use('/auth', authRouter)// Rota para autenticação, não requer autenticação



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