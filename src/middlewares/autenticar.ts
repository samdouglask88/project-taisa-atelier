export {}
const jwt = require('jsonwebtoken')

const autenticar = (req: any, res: any, next: any) => {
    const authHeader = req.headers['authorization']
    const token = authHeader && authHeader.split(' ')[1]

    if (!token) {
        return res.status(401).json({ error: 'Token não fornecido' })
    }

    jwt.verify(token, 'segredo123', (err: any, decoded: any) => {
        if (err) return res.status(401).json({ error: 'Token inválido' })
        next()
    })
}

module.exports = autenticar