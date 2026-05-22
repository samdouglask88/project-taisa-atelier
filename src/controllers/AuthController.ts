export {}
const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')
const User = require('../models/User')

const register = async (req: any, res: any) => {
    try {
        const { name, email, password } = req.body
        const hashedPassword = await bcrypt.hash(password, 10)
        const user = await User.create({ name, email, password: hashedPassword })
        res.status(201).json({ message: 'User registered successfully', data: user })
    } catch (error) {
        res.status(500).json({ error: 'Failed to register user' })
    }
}

const login = async (req: any, res: any) => {
    try {
        const { email, password } = req.body
        const user = await User.findOne({ email })
        if (!user) {
            return res.status(401).json({ error: 'Invalid email or password' })
        }
        const passwordMatch = await bcrypt.compare(password, user.password)
        if (!passwordMatch) {
            return res.status(401).json({ error: 'Invalid email or password' })
        }
        const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: '1d' })
        res.json({ message: 'Login successful', token })
    } catch (error) {
        res.status(500).json({ error: 'Failed to login' })
    }
}

module.exports = { register, login }
