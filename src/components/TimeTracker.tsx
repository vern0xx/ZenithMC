import { useState, useEffect } from 'react'
import { Play, Square } from 'lucide-react'
import { useAuth } from '@/contexts/AuthContext'
import { db, generateId, TimeEntry } from '@/lib/db'
import { triggerWebhook } from '@/lib/webhooks'

export function TimeTracker() {
  const { user } = useAuth()
  const [running, setRunning] = useState(false)
  const [seconds, setSeconds] = useState(0)
  const [activeEntryId, setActiveEntryId] = useState<string | null>(null)
  
  useEffect(() => {
    const saved = localStorage.getItem('active_timer')
    if (saved) {
      const { entryId, startTime } = JSON.parse(saved)
      setActiveEntryId(entryId)
      setSeconds(Math.floor((Date.now() - startTime) / 1000))
      setRunning(true)
    }
  }, [])
  
  useEffect(() => {
    let interval: any
    if (running) interval = setInterval(() => setSeconds(s => s + 1), 1000)
    return () => clearInterval(interval)
  }, [running])
  
  const format = (s: number) => {
    const h = Math.floor(s / 3600).toString().padStart(2, '0')
    const m = Math.floor((s % 3600) / 60).toString().padStart(2, '0')
    const sec = (s % 60).toString().padStart(2, '0')
    return `${h}:${m}:${sec}`
  }
  
  const start = async () => {
    if (!user) return
    const now = new Date()
    const entryId = generateId()
    await db.put('timeEntries', { id: entryId, userId: user.id, date: now.toISOString(), startTime: now.toISOString() })
    setActiveEntryId(entryId)
    setRunning(true)
    setSeconds(0)
    localStorage.setItem('active_timer', JSON.stringify({ entryId, startTime: now.getTime() }))
    await triggerWebhook('time.started', { userName: user.name, userId: user.id })
  }
  
  const stop = async () => {
    if (!activeEntryId || !user) return
    const entry = await db.get<TimeEntry>('timeEntries', activeEntryId)
    if (entry) {
      const totalHours = parseFloat((seconds / 3600).toFixed(2))
      await db.put('timeEntries', { ...entry, endTime: new Date().toISOString(), totalHours, overtime: Math.max(0, totalHours - 8) })
      await triggerWebhook('time.stopped', { userName: user.name, hours: totalHours, userId: user.id })
    }
    setRunning(false)
    setSeconds(0)
    setActiveEntryId(null)
    localStorage.removeItem('active_timer')
  }
  
  return (
    <button onClick={running ? stop : start}
            className="flex items-center gap-2 px-3 py-2 rounded-lg text-white text-sm font-semibold transition-transform hover:scale-105"
            style={{ backgroundColor: running ? '#ef4444' : '#10b981' }}>
      {running ? <Square className="w-4 h-4" /> : <Play className="w-4 h-4" />}
      <span className="hidden sm:inline">{running ? format(seconds) : 'Start'}</span>
    </button>
  )
}
