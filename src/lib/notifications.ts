import { db, generateId, type Notification } from './db'

export async function createNotification(userId: string, title: string, message: string, type = 'info', link?: string) {
  const notification: Notification = {
    id: generateId(), userId, title, message, type, link,
    read: false, createdAt: new Date().toISOString()
  }
  await db.put('notifications', notification)
  if ('Notification' in window && Notification.permission === 'granted') {
    new Notification(title, { body: message, icon: '/zenithmc/icon-192.png' })
  }
  return notification
}

export async function markAsRead(id: string) {
  const notif = await db.get<Notification>('notifications', id)
  if (notif) { notif.read = true; await db.put('notifications', notif) }
}
