import mongoose, { Schema } from 'mongoose'

const ServiceSchema = new Schema({
    name:          { type: String, required: true },
    description:   { type: String, required: true },
    price:         { type: Number, required: true },
    durationMinutes: { type: Number },
    category:      { type: String, required: true },
    active:        { type: Boolean, default: true },
}, { timestamps: true })

export default mongoose.model('Service', ServiceSchema)
