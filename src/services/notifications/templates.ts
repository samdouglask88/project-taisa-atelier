export type NotificationEvent = 'booked' | 'confirmado' | 'cancelado' | 'concluido' | 'lembrete'

export interface AppointmentNotificationData {
    clientName: string
    service: string
    date: string
    time: string
}

export function buildAppointmentMessage(event: NotificationEvent, data: AppointmentNotificationData): string {
    const { clientName, service, date, time } = data

    switch (event) {
        case 'booked':
            return `Olá ${clientName}! Recebemos sua solicitação de agendamento de *${service}* para *${date}* às *${time}*. Em breve confirmaremos. 💅`
        case 'confirmado':
            return `Olá ${clientName}! 💅 Seu agendamento de *${service}* está confirmado para *${date}* às *${time}*. Te esperamos no Taisa Ateliê!`
        case 'cancelado':
            return `Olá ${clientName}, seu agendamento de *${service}* em ${date} foi cancelado. Entre em contato para reagendar. 💕`
        case 'concluido':
            return `Olá ${clientName}! Obrigada por escolher o Taisa Ateliê para o seu *${service}*. Esperamos te ver novamente em breve! 💕`
        case 'lembrete':
        default:
            return `Olá ${clientName}! Lembrete do seu agendamento de *${service}* em *${date}* às *${time}*. Te esperamos! 💅`
    }
}
