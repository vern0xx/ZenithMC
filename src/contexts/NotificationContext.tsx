import { createContext, useContext, useState, useEffect, ReactNode } from 'react'
import { initFirebase, requestNotificationPermission, onForegroundMessage } from '@/config/firebase'
import { useAuth } from './AuthContext'
import { db, type Notification } from '@/lib/db'
import { createNotification } from '@/lib/notifications'

interface NotificationContextType {
  notifications: Notification[]
  unreadCount: number
  permissionGranted: boolean
  requestPermission: () => Promise<void>
  refresh: () => Promise<void>
}

const NotificationContext = createContext<NotificationContextType | null>(null)

export function NotificationProvider({ children }: { children: ReactNode }) {
  const { user } = useAuth()
  const [notifications, setNotifications] = useState<Notification[]>([])
  const [permissionGranted, setPermissionGranted] = useState(false)
  
  useEffect(() => {
    initFirebase()
    if ('Notification' in window && Notification.permission === 'granted') setPermissionGranted(true)
    const unsubscribe = onForegroundMessage((payload) => {
      if (user) {
        createNotification(user.id, payload.notification?.title || 'Powiadomienie', payload.notification?.body || '', 'push')
        refresh()
      }
    })
    return () => { if (unsubscribe) unsubscribe() }
  }, [user])
  
  useEffect(() => { if (user) refresh() }, [user])
  
  const refresh = async () => {
    if (!user) return
    const all = await db.query<Notification>('notifications', n => n.userId === user.id)
    setNotifications(all.sort((a, b) => b.createdAt.localeCompare(a.createdAt)))
  }
  
  const requestPermission = async () => {
    const token = await requestNotificationPermission()
    if (token && user) {
      const updated = { ...user, fcmToken: token }
      await db.put('users', updated)
      localStorage.setItem('user', JSON.stringify(updated))
      setPermissionGranted(true)
    }
  }
  
  const unreadCount = notifications.filter(n => !n.read).length
  
  return (
    <NotificationContext.Provider value={{ notifications, unreadCount, permissionGranted, requestPermission, refresh }}>
      {children}
    </NotificationContext.Provider>
  )
}

export const useNotifications = () => {
  const ctx = useContext(NotificationContext)
  if (!ctx) throw new Error('useNotifications must be inside NotificationProvider')
  return ctx
}
