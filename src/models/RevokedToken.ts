import mongoose, { Schema } from 'mongoose'

// Blacklist de JWTs deslogados, indexada pelo hash SHA-256 do token bruto.
// O índice TTL remove cada entrada automaticamente quando o token expiraria
// de qualquer forma, então a coleção nunca cresce sem limite.
const RevokedTokenSchema = new Schema({
    tokenHash: { type: String, required: true, unique: true },
    expiresAt: { type: Date, required: true },
}, { timestamps: true })

RevokedTokenSchema.index({ expiresAt: 1 }, { expireAfterSeconds: 0 })

export default mongoose.model('RevokedToken', RevokedTokenSchema)
