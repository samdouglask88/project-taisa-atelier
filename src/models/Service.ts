export {}
const mongoose = require('mongoose')
const { Schema } = mongoose

const ServiceSchema = new Schema({
    name:          { type: String, required: true },
    description:   { type: String, required: true },
    price:         { type: Number, required: true },
    durationHours: { type: Number },
    category:      { type: String, required: true },
    active:        { type: Boolean, default: true },
})

module.exports = mongoose.model('Service', ServiceSchema)
