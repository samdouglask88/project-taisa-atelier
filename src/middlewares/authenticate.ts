import { Request, Response, NextFunction } from 'express'
import jwt from 'jsonwebtoken'
import crypto from 'crypto'
import RevokedToken from '../models/RevokedToken'

export function hashToken(token: string): string {
    return crypto.createHash('sha256').update(token).digest('hex')
}

const authenticate = async (req: Request, res: Response, next: NextFunction) => {
    const authHeader = req.headers['authorization']
    const token = authHeader && authHeader.split(' ')[1]

    if (!token) {
        return res.status(401).json({ error: 'Token not provided' })
    }

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET!)

        const revoked = await RevokedToken.exists({ tokenHash: hashToken(token) })
        if (revoked) {
            return res.status(401).json({ error: 'Token revoked' })
        }

        ;(req as any).user = decoded
        ;(req as any).token = token
        next()
    } catch {
        return res.status(401).json({ error: 'Invalid token' })
    }
}

export default authenticate
