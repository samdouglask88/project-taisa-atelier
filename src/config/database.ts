import mongoose from 'mongoose'

const connectDatabase = async (): Promise<void> => {
    const uri = process.env.MONGODB_URI || 'mongodb://localhost:27017/taisa-atelier'
    try {
        await mongoose.connect(uri)
        console.log('MongoDB connected successfully!')
    } catch (error) {
        console.error('Failed to connect to MongoDB:', error)
        process.exit(1)
    }
}

export default connectDatabase
