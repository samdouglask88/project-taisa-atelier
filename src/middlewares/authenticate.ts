import jwt from 'jsonwebtoken'

const authenticate = (req: any, res: any, next: any) => {
    const authHeader = req.headers['authorization']
    const token = authHeader && authHeader.split(' ')[1]

    if (!token) {
        return res.status(401).json({ error: 'Token not provided' })
    }

    jwt.verify(token, process.env.JWT_SECRET!, (err: any, decoded: any) => {
        if (err) return res.status(401).json({ error: 'Invalid token' })
        req.user = decoded
        next()
    })
}

export default authenticate
