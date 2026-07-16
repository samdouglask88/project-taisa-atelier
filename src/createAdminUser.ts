import 'dotenv/config'
import bcrypt from 'bcryptjs'
import connectDatabase from './config/database'
import User from './models/User'
import { registerSchema } from './schemas/authSchemas'

async function main() {
    const [name, email, password] = process.argv.slice(2)
    const parsed = registerSchema.safeParse({ name, email, password })
    if (!parsed.success) {
        console.error('Usage: npm run create-admin -- "Name" email@example.com password')
        console.error(parsed.error.flatten().fieldErrors)
        process.exit(1)
    }

    await connectDatabase()
    const existing = await User.findOne({ email: parsed.data.email })
    if (existing) {
        console.error(`User with email ${parsed.data.email} already exists`)
        process.exit(1)
    }

    const hashedPassword = await bcrypt.hash(parsed.data.password, 10)
    const user = await User.create({ name: parsed.data.name, email: parsed.data.email, password: hashedPassword })
    console.log(`✓ Admin user created: ${user.email}`)
    process.exit(0)
}

main().catch(err => {
    console.error('Failed to create admin user:', err)
    process.exit(1)
})
