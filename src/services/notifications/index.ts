import { enqueueNotification } from './queue'
import { buildAppointmentMessage, NotificationEvent } from './templates'

interface NotifyAppointmentParams {
    appointmentId: string
    phone: string
    clientName: string
    service: string
    date: string
    time: string
    event: NotificationEvent
}

export async function notifyAppointment(params: NotifyAppointmentParams): Promise<void> {
    if (!params.phone) return
    const message = buildAppointmentMessage(params.event, {
        clientName: params.clientName,
        service: params.service,
        date: params.date,
        time: params.time,
    })
    try {
        await enqueueNotification({
            appointmentId: params.appointmentId,
            phone: params.phone,
            event: params.event,
            message,
        })
    } catch (error) {
        console.error('[notifications] failed to enqueue notification', error)
    }
}

export { resumePendingNotifications } from './queue'
export type { NotificationEvent } from './templates'
