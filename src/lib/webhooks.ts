import { db, Webhook } from './db'
import { sendToTeams } from '@/config/teams'

export type WebhookEvent = 
  | 'user.created' | 'user.updated'
  | 'time.started' | 'time.stopped'
  | 'leave.created' | 'leave.approved' | 'leave.rejected'

export async function triggerWebhook(event: WebhookEvent, data: any) {
  try {
    const webhooks = await db.getAll<Webhook>('webhooks')
    const active = webhooks.filter(w => w.active && w.events.includes(event))
    
    for (const webhook of active) {
      sendWebhook(webhook, event, data).catch(err => console.error(err))
    }
  } catch (error) {
    console.error('Webhook trigger error:', error)
  }
}

async function sendWebhook(webhook: Webhook, event: WebhookEvent, data: any) {
  const message = formatMessage(event, data)
  
  switch (webhook.type) {
    case 'slack':
      return fetch(webhook.url, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        mode: 'no-cors',
        body: JSON.stringify({
          text: `🔔 ZenithMC: ${event}`,
          blocks: [
            { type: 'header', text: { type: 'plain_text', text: `ZenithMC - ${event}` }},
            { type: 'section', text: { type: 'mrkdwn', text: message }}
          ]
        })
      })
    case 'discord':
      return fetch(webhook.url, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        mode: 'no-cors',
        body: JSON.stringify({
          username: 'ZenithMC',
          embeds: [{ title: `Event: ${event}`, description: message, color: 6366961, timestamp: new Date().toISOString() }]
        })
      })
    case 'teams':
      return sendToTeams(webhook.url, `Event: ${event}`, message)
    default:
      return fetch(webhook.url, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        mode: 'no-cors',
        body: JSON.stringify({ event, timestamp: new Date().toISOString(), message, data })
      })
  }
}

function formatMessage(event: WebhookEvent, data: any): string {
  switch (event) {
    case 'user.created': return `🆕 Nowy użytkownik: **${data.user.name}**`
    case 'user.updated': return `✏️ Zaktualizowano: **${data.user.name}**`
    case 'time.started': return `▶️ **${data.userName}** rozpoczął pracę`
    case 'time.stopped': return `⏹️ **${data.userName}** zakończył: **${data.hours}h**`
    case 'leave.created': return `📝 **${data.userName}**: wniosek ${data.type} (${data.days} dni)`
    case 'leave.approved': return `✅ Wniosek **${data.userName}** zatwierdzony`
    case 'leave.rejected': return `❌ Wniosek **${data.userName}** odrzucony`
    default: return JSON.stringify(data)
  }
}
