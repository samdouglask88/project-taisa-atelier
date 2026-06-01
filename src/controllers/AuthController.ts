import bcrypt from 'bcryptjs'
import jwt from 'jsonwebtoken'
import User from '../models/User'

export const register = async (req: any, res: any) => {
    try {
        const { name, email, password } = req.body
        if (!name || !email || !password) {
            return res.status(400).json({ error: 'name, email and password are required' })
        }
        const existing = await User.findOne({ email })
        if (existing) {
            return res.status(409).json({ error: 'Email already registered' })
        }
        const hashedPassword = await bcrypt.hash(password, 10)
        const user = await User.create({ name, email, password: hashedPassword })
        res.status(201).json({ message: 'User registered successfully', data: { id: user._id, name: user.name, email: user.email } })
    } catch (error) {
        res.status(500).json({ error: 'Failed to register user' })
    }
}

export const login = async (req: any, res: any) => {
    try {
        const { email, password } = req.body
        if (!email || !password) {
            return res.status(400).json({ error: 'email and password are required' })
        }
        const user = await User.findOne({ email })
        if (!user) {
            return res.status(401).json({ error: 'Invalid email or password' })
        }
        const passwordMatch = await bcrypt.compare(password, user.password)
        if (!passwordMatch) {
            return res.status(401).json({ error: 'Invalid email or password' })
        }
        const secret = process.env.JWT_SECRET!
        const token = jwt.sign({ id: user._id, email: user.email, name: user.name }, secret, { expiresIn: '1d' })
        res.json({ token, user: { id: user._id, name: user.name, email: user.email } })
    } catch (error) {
        res.status(500).json({ error: 'Failed to login' })
    }
}
