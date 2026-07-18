import { Request, Response } from 'express'
import bcrypt from 'bcryptjs'
import jwt from 'jsonwebtoken'
import User from '../models/User'
import RevokedToken from '../models/RevokedToken'
import { hashToken } from '../middlewares/authenticate'
import { logLoginAttempt, isLockedOut } from '../utils/securityLogger'

const TOKEN_TTL = '1d'
const TOKEN_TTL_MS = 24 * 60 * 60 * 1000

export const login = async (req: Request, res: Response) => {
    try {
        const { email, password } = req.body

        // Bloqueio temporário após falhas repetidas — verificado antes de
        // tocar no banco de usuários para não vazar se o e-mail existe.
        if (await isLockedOut(email)) {
            await logLoginAttempt(req, email, false)
            return res.status(429).json({ error: 'Too many failed attempts. Try again in 15 minutes.' })
        }

        const user = await User.findOne({ email })
        if (!user) {
            await logLoginAttempt(req, email, false)
            return res.status(401).json({ error: 'Invalid email or password' })
        }
        const passwordMatch = await bcrypt.compare(password, user.password)
        if (!passwordMatch) {
            await logLoginAttempt(req, email, false)
            return res.status(401).json({ error: 'Invalid email or password' })
        }
        await logLoginAttempt(req, email, true)
        const secret = process.env.JWT_SECRET!
        const token = jwt.sign({ id: user._id, email: user.email, name: user.name }, secret, { expiresIn: TOKEN_TTL })
        res.json({ token, user: { id: user._id, name: user.name, email: user.email } })
    } catch (error) {
        res.status(500).json({ error: 'Failed to login' })
    }
}

export const logout = async (req: Request, res: Response) => {
    try {
        const token: string = (req as any).token

        // O token já passou pelo authenticate; registrar o hash na blacklist
        // até a data em que ele expiraria por conta própria.
        await RevokedToken.updateOne(
            { tokenHash: hashToken(token) },
            { $setOnInsert: { expiresAt: new Date(Date.now() + TOKEN_TTL_MS) } },
            { upsert: true },
        )

        res.json({ message: 'Logged out' })
    } catch (error) {
        res.status(500).json({ error: 'Failed to logout' })
    }
}
