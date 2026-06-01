import mongoose, { Schema } from 'mongoose'

const AppointmentSchema = new Schema({
    client:   { type: Schema.Types.ObjectId, ref: 'Client', required: true },
    date:     { type: String, required: true },
    time:     { type: String, required: true },
    service:  { type: String, required: true },
    price:    { type: Number, required: true },
    status:   { type: String, default: 'scheduled' },
    notes:    { type: String },
}, { timestamps: true })

export default mongoose.model('Appointment', AppointmentSchema)
