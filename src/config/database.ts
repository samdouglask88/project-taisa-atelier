import mongoose from 'mongoose'

const connectDatabase = async (): Promise<void> => {
    try {
        await mongoose.connect('mongodb://localhost:27017/taisa-atelier')
        console.log('MongoDB connected successfully!')
    } catch (error) {
        console.error('Failed to connect to MongoDB:', error)
        process.exit(1)
    }
}

module.exports = connectDatabase
