import { Request, Response } from 'express'
import bcrypt from 'bcryptjs'
import jwt from 'jsonwebtoken'
import User from '../models/User'
import { logLoginAttempt } from '../utils/securityLogger'

export const login = async (req: Request, res: Response) => {
    try {
        const { email, password } = req.body
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
        const token = jwt.sign({ id: user._id, email: user.email, name: user.name }, secret, { expiresIn: '1d' })
        res.json({ token, user: { id: user._id, name: user.name, email: user.email } })
    } catch (error) {
        res.status(500).json({ error: 'Failed to login' })
    }
}
