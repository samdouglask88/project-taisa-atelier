import { Request } from 'express'
import SecurityLog from '../models/SecurityLog'

const FAILED_LOGIN_ALERT_THRESHOLD = 5
const FAILED_LOGIN_WINDOW_MS = 15 * 60 * 1000
const LOCKOUT_THRESHOLD = 5

function getClientIp(req: Request): string {
    const forwarded = req.headers['x-forwarded-for']
    if (typeof forwarded === 'string' && forwarded.length > 0) return forwarded.split(',')[0].trim()
    return req.socket.remoteAddress || 'unknown'
}

// Um e-mail fica bloqueado enquanto tiver LOCKOUT_THRESHOLD ou mais falhas
// dentro da janela deslizante, contando apenas falhas posteriores ao login
// bem-sucedido mais recente (um login legítimo zera a contagem). O bloqueio
// se desfaz sozinho conforme as falhas envelhecem para fora da janela.
export async function isLockedOut(email: string): Promise<boolean> {
    const since = new Date(Date.now() - FAILED_LOGIN_WINDOW_MS)

    const lastSuccess = await SecurityLog.findOne(
        { event: 'login', success: true, email, createdAt: { $gte: since } },
        { createdAt: 1 },
        { sort: { createdAt: -1 } },
    )

    const failuresSince = lastSuccess ? lastSuccess.get('createdAt') : since
    const recentFailures = await SecurityLog.countDocuments({
        event: 'login',
        success: false,
        email,
        createdAt: { $gte: failuresSince },
    })

    return recentFailures >= LOCKOUT_THRESHOLD
}

// Persiste a tentativa e emite um alerta marcado no console ao passar do
// limite. Plugar esse alerta em e-mail/Slack/PagerDuty quando houver canal.
export async function logLoginAttempt(req: Request, email: string, success: boolean): Promise<void> {
    const ip = getClientIp(req)
    const userAgent = req.headers['user-agent'] || 'unknown'

    console.log(`[security] login_${success ? 'success' : 'failed'} email=${email} ip=${ip}`)

    try {
        await SecurityLog.create({ event: 'login', email, ip, userAgent, success })

        if (!success) {
            const since = new Date(Date.now() - FAILED_LOGIN_WINDOW_MS)
            const recentFailures = await SecurityLog.countDocuments({
                event: 'login',
                success: false,
                email,
                createdAt: { $gte: since },
            })
            if (recentFailures >= FAILED_LOGIN_ALERT_THRESHOLD) {
                console.error(`[security-alert] ${recentFailures} failed login attempts for email=${email} ip=${ip} in the last 15 minutes`)
            }
        }
    } catch (error) {
        console.error('[security] failed to persist security log', error)
    }
}
