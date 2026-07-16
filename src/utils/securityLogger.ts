import { Request } from 'express'
import SecurityLog from '../models/SecurityLog'

const FAILED_LOGIN_ALERT_THRESHOLD = 5
const FAILED_LOGIN_WINDOW_MS = 15 * 60 * 1000

function getClientIp(req: Request): string {
    const forwarded = req.headers['x-forwarded-for']
    if (typeof forwarded === 'string' && forwarded.length > 0) return forwarded.split(',')[0].trim()
    return req.socket.remoteAddress || 'unknown'
}

// Persists the attempt and raises a tagged console alert past the threshold.
// Wire this alert into email/Slack/PagerDuty once an alerting channel exists.
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
