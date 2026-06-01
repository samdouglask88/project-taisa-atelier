import mongoose, { Schema } from 'mongoose'

const ClientSchema = new Schema({
    name:      { type: String, required: true },
    email:     { type: String, required: true, unique: true },
    phone:     { type: String, required: true },
    address:   { type: String },
    instagram: { type: String },
}, { timestamps: true })

export default mongoose.model('Client', ClientSchema)
