export {}
const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')
const Usuario = require('../models/Usuario')

// Registra um novo usuário com senha criptografada
const registrar = async (req: any, res: any) => {
    try {
        const { nome, email, senha } = req.body
        const senhaCriptografada = await bcrypt.hash(senha, 10)
        const usuario = await Usuario.create({ nome, email, senha: senhaCriptografada })
        res.status(201).json({ mensagem: 'Usuário registrado com sucesso', dados: usuario })
    } catch (error) {
        res.status(500).json({ error: 'Erro ao registrar o usuário' })
    }
}

// Autentica o usuário e retorna o token JWT
const login = async (req: any, res: any) => {
    try {
        const { email, senha } = req.body
        const usuario = await Usuario.findOne({ email })
        if (!usuario) {
            return res.status(401).json({ error: 'Email ou senha inválidos' })
        }
        const senhaCorreta = await bcrypt.compare(senha, usuario.senha)
        if (!senhaCorreta) {
            return res.status(401).json({ error: 'Email ou senha inválidos' })
        }
        const token = jwt.sign({ id: usuario._id }, process.env.JWT_SECRET, { expiresIn: '1d' })
        res.json({ mensagem: 'Login realizado com sucesso', token })
    } catch (error) {
        res.status(500).json({ error: 'Erro ao realizar login' })
    }
}

module.exports = { registrar, login }