import 'dotenv/config'
import connectDatabase from './config/database'
import Service from './models/Service'

const services = [
    { name: 'Corte Feminino', description: 'Corte personalizado com lavagem e finalização', price: 80, durationMinutes: 60, category: 'Cabelo' },
    { name: 'Coloração Completa', description: 'Coloração profissional com produtos de alta qualidade', price: 200, durationMinutes: 180, category: 'Cabelo' },
    { name: 'Mechas e Luzes', description: 'Técnicas de mechas e luzes para realçar sua beleza', price: 250, durationMinutes: 240, category: 'Cabelo' },
    { name: 'Tratamento Capilar', description: 'Hidratação e reconstrução profunda dos fios', price: 120, durationMinutes: 90, category: 'Cabelo' },
    { name: 'Manicure e Pedicure', description: 'Cuidado completo para mãos e pés', price: 80, durationMinutes: 90, category: 'Unhas' },
    { name: 'Unhas em Gel', description: 'Alongamento e esmaltação em gel de longa duração', price: 150, durationMinutes: 120, category: 'Unhas' },
    { name: 'Design de Sobrancelhas', description: 'Modelagem e design para valorizar seu olhar', price: 60, durationMinutes: 45, category: 'Estética' },
    { name: 'Limpeza de Pele', description: 'Limpeza profunda com extração e máscara facial', price: 150, durationMinutes: 90, category: 'Estética' },
    { name: 'Pacote Noiva', description: 'Pacote completo: cabelo, maquiagem e unhas para o grande dia', price: 800, durationMinutes: 360, category: 'Pacote' },
]

async function seed() {
    await connectDatabase()
    const count = await Service.countDocuments()
    if (count > 0) {
        console.log(`Banco já tem ${count} serviços. Seed ignorado.`)
        process.exit(0)
    }
    await Service.insertMany(services)
    console.log(`✓ ${services.length} serviços inseridos com sucesso!`)
    process.exit(0)
}

seed().catch(err => {
    console.error('Erro no seed:', err)
    process.exit(1)
})
