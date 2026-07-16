import mongoose, { Schema } from 'mongoose'

const NotificationSchema = new Schema({
    appointment: { type: Schema.Types.ObjectId, ref: 'Appointment' },
    phone:       { type: String, required: true },
    event:       { type: String, required: true },
    message:     { type: String, required: true },
    status:      { type: String, enum: ['pending', 'sent', 'failed'], default: 'pending' },
    attempts:    { type: Number, default: 0 },
    lastError:   { type: String },
    sentAt:      { type: Date },
}, { timestamps: true })

export default mongoose.model('Notification', NotificationSchema)
