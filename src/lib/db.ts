const DB_NAME = '${PROJECT_NAME}-db'
const DB_VERSION = 2

export interface User {
  id: string
  email: string
  name: string
  avatar?: string
  role: 'ADMIN' | 'EMPLOYEE'
  discordId?: string
  microsoftId?: string
  fcmToken?: string
  position?: string
  department?: string
  status?: string
  vacationDays?: number
  usedVacation?: number
  phone?: string
}

export interface TimeEntry {
  id: string
  userId: string
  date: string
  startTime: string
  endTime?: string
  totalHours?: number
  overtime?: number
  category?: string
  description?: string
}

export interface LeaveRequest {
  id: string
  userId: string
  userName?: string
  type: string
  subType?: string
  startDate: string
  endDate: string
  daysCount: number
  status: 'Oczekujący' | 'Zatwierdzony' | 'Odrzucony'
  reason?: string
  createdAt: string
}

export interface Webhook {
  id: string
  name: string
  url: string
  type: 'slack' | 'discord' | 'teams' | 'zapier' | 'make' | 'custom'
  events: string[]
  active: boolean
}

export interface Notification {
  id: string
  userId: string
  title: string
  message: string
  type: string
  read: boolean
  link?: string
  createdAt: string
}

class Database {
  private db: IDBDatabase | null = null
  
  async init(): Promise<void> {
    return new Promise((resolve, reject) => {
      const req = indexedDB.open(DB_NAME, DB_VERSION)
      req.onerror = () => reject(req.error)
      req.onsuccess = () => { this.db = req.result; resolve() }
      req.onupgradeneeded = (e) => {
        const db = (e.target as IDBOpenDBRequest).result
        const stores = ['users', 'timeEntries', 'leaveRequests', 'notifications', 'webhooks', 'settings']
        stores.forEach(store => {
          if (!db.objectStoreNames.contains(store)) {
            db.createObjectStore(store, { keyPath: 'id' })
          }
        })
      }
    })
  }
  
  async getAll<T = any>(store: string): Promise<T[]> {
    return new Promise((resolve, reject) => {
      const tx = this.db!.transaction(store, 'readonly')
      const req = tx.objectStore(store).getAll()
      req.onsuccess = () => resolve(req.result)
      req.onerror = () => reject(req.error)
    })
  }
  
  async get<T = any>(store: string, id: string): Promise<T | undefined> {
    return new Promise((resolve, reject) => {
      const tx = this.db!.transaction(store, 'readonly')
      const req = tx.objectStore(store).get(id)
      req.onsuccess = () => resolve(req.result)
      req.onerror = () => reject(req.error)
    })
  }
  
  async put<T = any>(store: string, data: T): Promise<void> {
    return new Promise((resolve, reject) => {
      const tx = this.db!.transaction(store, 'readwrite')
      const req = tx.objectStore(store).put(data)
      req.onsuccess = () => resolve()
      req.onerror = () => reject(req.error)
    })
  }
  
  async delete(store: string, id: string): Promise<void> {
    return new Promise((resolve, reject) => {
      const tx = this.db!.transaction(store, 'readwrite')
      const req = tx.objectStore(store).delete(id)
      req.onsuccess = () => resolve()
      req.onerror = () => reject(req.error)
    })
  }
  
  async query<T = any>(store: string, filter: (item: T) => boolean): Promise<T[]> {
    const all = await this.getAll<T>(store)
    return all.filter(filter)
  }
}

export const db = new Database()
export const generateId = () => Date.now().toString(36) + Math.random().toString(36).substring(2)
