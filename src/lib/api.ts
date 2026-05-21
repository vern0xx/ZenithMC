import { db } from './db'

export class ZenithAPI {
  static version = '1.0.0'
  
  static async getUsers() { return await db.getAll('users') }
  static async getUser(id: string) { return await db.get('users', id) }
  static async getTimeEntries(userId?: string) {
    if (userId) return await db.query('timeEntries', (e: any) => e.userId === userId)
    return await db.getAll('timeEntries')
  }
  static async getLeaveRequests(status?: string) {
    if (status) return await db.query('leaveRequests', (l: any) => l.status === status)
    return await db.getAll('leaveRequests')
  }
  static async getStats(userId?: string) {
    const entries: any[] = userId 
      ? await db.query('timeEntries', (e: any) => e.userId === userId)
      : await db.getAll('timeEntries')
    const leaves: any[] = userId
      ? await db.query('leaveRequests', (l: any) => l.userId === userId)
      : await db.getAll('leaveRequests')
    return {
      totalHours: entries.reduce((s, e) => s + (e.totalHours || 0), 0),
      overtime: entries.reduce((s, e) => s + (e.overtime || 0), 0),
      entriesCount: entries.length,
      pendingLeaves: leaves.filter(l => l.status === 'Oczekujący').length
    }
  }
  static async exportAll() {
    return {
      users: await db.getAll('users'),
      timeEntries: await db.getAll('timeEntries'),
      leaveRequests: await db.getAll('leaveRequests'),
      exportedAt: new Date().toISOString()
    }
  }
  static help() {
    console.log(`🚀 ZenithMC API v${this.version}\nMetody:\n  ZenithAPI.getUsers()\n  ZenithAPI.getTimeEntries()\n  ZenithAPI.getStats()\n  ZenithAPI.exportAll()`)
  }
}

if (typeof window !== 'undefined') (window as any).ZenithAPI = ZenithAPI
