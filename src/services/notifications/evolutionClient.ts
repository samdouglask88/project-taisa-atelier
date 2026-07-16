export function normalizePhone(phone: string): string {
    const digits = phone.replace(/\D/g, '')
    return digits.startsWith('55') ? digits : `55${digits}`
}

export async function sendWhatsAppMessage(phone: string, text: string): Promise<void> {
    const baseUrl = process.env.EVOLUTION_API_URL
    const apiKey = process.env.EVOLUTION_API_KEY
    const instance = process.env.EVOLUTION_INSTANCE

    if (!baseUrl || !apiKey || !instance) {
        throw new Error('Evolution API not configured (EVOLUTION_API_URL, EVOLUTION_API_KEY, EVOLUTION_INSTANCE)')
    }

    const number = normalizePhone(phone)
    const res = await fetch(`${baseUrl.replace(/\/$/, '')}/message/sendText/${instance}`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            apikey: apiKey,
        },
        body: JSON.stringify({ number, text }),
    })

    if (!res.ok) {
        const body = await res.text().catch(() => '')
        throw new Error(`Evolution API request failed (${res.status}): ${body}`)
    }
}
