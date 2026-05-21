import { useState, useEffect } from 'react'
import { useAuth } from '@/contexts/AuthContext'
import { useTheme } from '@/contexts/ThemeContext'
import { db, TimeEntry, LeaveRequest } from '@/lib/db'
import { Clock, Calendar, FileText, TrendingUp } from 'lucide-react'

export default function Dashboard() {
  const { user } = useAuth()
  const { theme } = useTheme()
  const [entries, setEntries] = useState<TimeEntry[]>([])
  const [leaves, setLeaves] = useState<LeaveRequest[]>([])
  
  useEffect(() => {
    if (user) loadData()
    const interval = setInterval(loadData, 5000)
    return () => clearInterval(interval)
  }, [user])
  
  const loadData = async () => {
    if (!user) return
    setEntries(await db.query<TimeEntry>('timeEntries', e => e.userId === user.id))
    setLeaves(await db.query<LeaveRequest>('leaveRequests', l => l.userId === user.id))
  }
  
  const totalHours = entries.reduce((s, e) => s + (e.totalHours || 0), 0)
  const overtime = entries.reduce((s, e) => s + (e.overtime || 0), 0)
  const pending = leaves.filter(l => l.status === 'Oczekujący').length
  
  const stats = [
    { label: 'Łączny czas', value: `${totalHours.toFixed(1)}h`, icon: Clock, color: theme.colors.primary },
    { label: 'Nadgodziny', value: `${overtime.toFixed(1)}h`, icon: TrendingUp, color: '#f97316' },
    { label: 'Wnioski', value: pending, icon: FileText, color: '#a855f7' },
    { label: 'Wpisy', value: entries.length, icon: Calendar, color: '#10b981' }
  ]
  
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold" style={{ color: theme.colors.text }}>Witaj, {user?.name}! 👋</h1>
        <p style={{ color: theme.colors.textMuted }}>{new Date().toLocaleDateString('pl-PL', { weekday: 'long', day: 'numeric', month: 'long' })}</p>
      </div>
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {stats.map(s => {
          const Icon = s.icon
          return (
            <div key={s.label} className="p-6 rounded-xl" style={{ backgroundColor: theme.colors.cardBg, border: `1px solid ${theme.colors.border}` }}>
              <div className="w-10 h-10 rounded-lg flex items-center justify-center mb-3" style={{ backgroundColor: s.color }}>
                <Icon className="w-5 h-5 text-white" />
              </div>
              <div className="text-2xl font-bold" style={{ color: theme.colors.text }}>{s.value}</div>
              <div className="text-sm" style={{ color: theme.colors.textMuted }}>{s.label}</div>
            </div>
          )
        })}
      </div>
    </div>
  )
}
