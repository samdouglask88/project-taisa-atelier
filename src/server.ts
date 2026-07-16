import 'dotenv/config'
import express from 'express'
import cors from 'cors'
import helmet from 'helmet'
import connectDatabase from './config/database'
import servicesRouter from './routes/services'
import clientsRouter from './routes/clients'
import appointmentsRouter from './routes/appointments'
import authRouter from './routes/auth'
import { apiRateLimiter } from './middlewares/rateLimiters'
import { resumePendingNotifications } from './services/notifications'

const app = express()
const PORT = process.env.PORT || 3333

const DEV_ORIGINS = ['http://localhost:5173', 'http://127.0.0.1:5173']
const allowedOrigins = process.env.CORS_ORIGIN
    ? process.env.CORS_ORIGIN.split(',').map(origin => origin.trim())
    : DEV_ORIGINS

if (process.env.NODE_ENV === 'production' && !process.env.CORS_ORIGIN) {
    console.warn('CORS_ORIGIN not set in production — falling back to localhost dev origins only')
}

app.use(helmet())
app.use(cors({
    origin: allowedOrigins,
    credentials: true,
}))
app.use(express.json())
app.use(apiRateLimiter)

app.get('/', (_req, res) => res.json({ status: 'ok', service: 'taisa-atelier-api' }))

app.use('/auth', authRouter)
app.use('/services', servicesRouter)
app.use('/clients', clientsRouter)
app.use('/appointments', appointmentsRouter)

const startServer = async () => {
    try {
        await connectDatabase()
        await resumePendingNotifications()
        app.listen(PORT, () => console.log(`Server running on port ${PORT}`))
    } catch (error) {
        console.error('Failed to start server:', error)
        process.exit(1)
    }
}

startServer()
