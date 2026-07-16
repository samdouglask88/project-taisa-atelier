import mongoose, { Schema } from 'mongoose'

const SecurityLogSchema = new Schema({
    event:     { type: String, required: true },
    email:     { type: String },
    ip:        { type: String },
    userAgent: { type: String },
    success:   { type: Boolean },
}, { timestamps: true })

export default mongoose.model('SecurityLog', SecurityLogSchema)
