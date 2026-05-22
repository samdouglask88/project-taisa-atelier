require('dotenv').config()
import express from 'express'
const connectDatabase = require('./config/database')
const servicesRouter = require('./routes/services')
const clientsRouter = require('./routes/clients')
const appointmentsRouter = require('./routes/appointments')
const authRouter = require('./routes/auth')
const authenticate = require('./middlewares/authenticate')

const app = express()
const PORT = process.env.PORT || 3333

app.use(express.json())
app.use('/services', authenticate, servicesRouter)
app.use('/clients', authenticate, clientsRouter)
app.use('/appointments', authenticate, appointmentsRouter)
app.use('/auth', authRouter)

const startServer = async () => {
    try {
        await connectDatabase()
        app.listen(PORT, () => console.log(`Server running on port ${PORT}`))
    } catch (error) {
        console.error('Failed to start server:', error)
    }
}

startServer()
