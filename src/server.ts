import 'dotenv/config'
import express from 'express'
import cors from 'cors'
import connectDatabase from './config/database'
import servicesRouter from './routes/services'
import clientsRouter from './routes/clients'
import appointmentsRouter from './routes/appointments'
import authRouter from './routes/auth'
import authenticate from './middlewares/authenticate'

const app = express()
const PORT = process.env.PORT || 3333

app.use(cors({
    origin: ['http://localhost:5173', 'http://127.0.0.1:5173'],
    credentials: true,
}))
app.use(express.json())

app.get('/', (_req, res) => res.json({ status: 'ok', service: 'taisa-atelier-api' }))

app.use('/auth', authRouter)
app.use('/services', authenticate, servicesRouter)
app.use('/clients', authenticate, clientsRouter)
app.use('/appointments', appointmentsRouter)

const startServer = async () => {
    try {
        await connectDatabase()
        app.listen(PORT, () => console.log(`Server running on port ${PORT}`))
    } catch (error) {
        console.error('Failed to start server:', error)
        process.exit(1)
    }
}

startServer()
