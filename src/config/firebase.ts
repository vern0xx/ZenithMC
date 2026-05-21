import { initializeApp } from 'firebase/app'
import { getMessaging, getToken, onMessage, Messaging } from 'firebase/messaging'

export const FIREBASE_CONFIG = {
  apiKey: "TWOJ_API_KEY",
  authDomain: "TWOJ.firebaseapp.com",
  projectId: "TWOJ",
  storageBucket: "TWOJ.appspot.com",
  messagingSenderId: "123",
  appId: "1:123:web:abc"
}

export const VAPID_KEY = 'TWOJ_VAPID_KEY'

let messaging: Messaging | null = null

export function initFirebase() {
  try {
    const app = initializeApp(FIREBASE_CONFIG)
    if ('serviceWorker' in navigator && 'Notification' in window) {
      messaging = getMessaging(app)
    }
    return app
  } catch (error) {
    console.error('Firebase init error:', error)
    return null
  }
}

export async function requestNotificationPermission(): Promise<string | null> {
  if (!messaging) return null
  try {
    const permission = await Notification.requestPermission()
    if (permission !== 'granted') return null
    const registration = await navigator.serviceWorker.register('/ZenithMC/firebase-messaging-sw.js')
    return await getToken(messaging, { vapidKey: VAPID_KEY, serviceWorkerRegistration: registration })
  } catch {
    return null
  }
}

export function onForegroundMessage(callback: (payload: any) => void) {
  if (!messaging) return
  return onMessage(messaging, callback)
}
