import Notification from '../../models/Notification'
import { sendWhatsAppMessage } from './evolutionClient'
import { NotificationEvent } from './templates'

const MAX_ATTEMPTS = 5
const RETRY_BASE_DELAY_MS = 5000

interface EnqueueParams {
    appointmentId?: string
    phone: string
    event: NotificationEvent
    message: string
}

const pendingIds: string[] = []
let processing = false

export async function enqueueNotification(params: EnqueueParams): Promise<void> {
    const notification = await Notification.create({
        appointment: params.appointmentId,
        phone: params.phone,
        event: params.event,
        message: params.message,
        status: 'pending',
    })
    pendingIds.push(String(notification._id))
    void processQueue()
}

export async function resumePendingNotifications(): Promise<void> {
    const pending = await Notification.find({ status: 'pending' }).select('_id')
    pending.forEach(doc => pendingIds.push(String(doc._id)))
    void processQueue()
}

async function processQueue(): Promise<void> {
    if (processing) return
    processing = true
    try {
        while (pendingIds.length > 0) {
            const id = pendingIds.shift()!
            await processNotification(id)
        }
    } finally {
        processing = false
    }
}

async function processNotification(id: string): Promise<void> {
    const notification = await Notification.findById(id)
    if (!notification || notification.status === 'sent') return

    try {
        await sendWhatsAppMessage(notification.phone, notification.message)
        notification.status = 'sent'
        notification.sentAt = new Date()
        notification.attempts += 1
        await notification.save()
    } catch (error: any) {
        notification.attempts += 1
        notification.lastError = error?.message ?? 'Unknown error'

        if (notification.attempts >= MAX_ATTEMPTS) {
            notification.status = 'failed'
            await notification.save()
            console.error(`[notifications] giving up on ${id} after ${notification.attempts} attempts: ${notification.lastError}`)
            return
        }

        await notification.save()
        const delay = RETRY_BASE_DELAY_MS * Math.pow(2, notification.attempts - 1)
        setTimeout(() => { pendingIds.push(id); void processQueue() }, delay)
    }
}
