export {}
const mongoose = require('mongoose')
const { Schema } = mongoose

const AppointmentSchema = new Schema({
    client:   { type: Schema.Types.ObjectId, ref: 'Client', required: true },
    date:     { type: Date, required: true },
    time:     { type: String, required: true },
    service:  { type: String, required: true },
    price:    { type: Number, required: true },
    status:   { type: String, default: 'scheduled' }
})

module.exports = mongoose.model('Appointment', AppointmentSchema)
