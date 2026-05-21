import { useState, useEffect } from 'react'
import { useAuth } from '@/contexts/AuthContext'
import { useTheme } from '@/contexts/ThemeContext'
import { db, generateId, LeaveRequest } from '@/lib/db'
import { triggerWebhook } from '@/lib/webhooks'
import { Plus } from 'lucide-react'

export default function LeaveRequests() {
  const { user } = useAuth()
  const { theme } = useTheme()
  const [requests, setRequests] = useState<LeaveRequest[]>([])
  const [showForm, setShowForm] = useState(false)
  const [form, setForm] = useState({ type: 'Urlop wypoczynkowy', startDate: '', endDate: '', reason: '' })
  
  useEffect(() => { loadRequests() }, [])
  const loadRequests = async () => {
    if (!user) return
    const all = user.role === 'ADMIN' ? await db.getAll<LeaveRequest>('leaveRequests') : await db.query<LeaveRequest>('leaveRequests', r => r.userId === user.id)
    setRequests(all)
  }
  
  const submit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!user) return
    const days = Math.ceil((new Date(form.endDate).getTime() - new Date(form.startDate).getTime()) / 86400000) + 1
    const request: LeaveRequest = {
      id: generateId(), userId: user.id, userName: user.name, type: form.type,
      startDate: form.startDate, endDate: form.endDate, daysCount: days,
      status: 'Oczekujący', reason: form.reason, createdAt: new Date().toISOString()
    }
    await db.put('leaveRequests', request)
    await triggerWebhook('leave.created', { userName: user.name, type: form.type, days })
    setShowForm(false)
    setForm({ type: 'Urlop wypoczynkowy', startDate: '', endDate: '', reason: '' })
    loadRequests()
  }
  
  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold" style={{ color: theme.colors.text }}>Wnioski</h1>
        <button onClick={() => setShowForm(true)} className="flex items-center gap-2 px-4 py-2 rounded text-white" style={{ backgroundColor: theme.colors.primary }}>
          <Plus className="w-4 h-4" /> Nowy
        </button>
      </div>
      {showForm && (
        <form onSubmit={submit} className="p-6 rounded-xl space-y-3" style={{ backgroundColor: theme.colors.cardBg, border: `1px solid ${theme.colors.border}` }}>
          <select value={form.type} onChange={e => setForm({...form, type: e.target.value})} className="w-full px-3 py-2 rounded border" style={{ backgroundColor: theme.colors.bg, borderColor: theme.colors.border, color: theme.colors.text }}>
            <option>Urlop wypoczynkowy</option><option>Urlop na żądanie</option><option>Zwolnienie lekarskie</option>
          </select>
          <div className="grid grid-cols-2 gap-3">
            <input type="date" required value={form.startDate} onChange={e => setForm({...form, startDate: e.target.value})} className="px-3 py-2 rounded border" style={{ backgroundColor: theme.colors.bg, borderColor: theme.colors.border, color: theme.colors.text }} />
            <input type="date" required value={form.endDate} onChange={e => setForm({...form, endDate: e.target.value})} className="px-3 py-2 rounded border" style={{ backgroundColor: theme.colors.bg, borderColor: theme.colors.border, color: theme.colors.text }} />
          </div>
          <button type="submit" className="px-4 py-2 rounded text-white" style={{ backgroundColor: theme.colors.primary }}>Złóż</button>
        </form>
      )}
      <div className="rounded-xl overflow-hidden" style={{ backgroundColor: theme.colors.cardBg, border: `1px solid ${theme.colors.border}` }}>
        <table className="w-full">
          <thead style={{ backgroundColor: theme.colors.bg }}>
            <tr><th className="p-3 text-left text-sm" style={{ color: theme.colors.text }}>Typ</th>
            <th className="p-3 text-left text-sm" style={{ color: theme.colors.text }}>Okres</th>
            <th className="p-3 text-left text-sm" style={{ color: theme.colors.text }}>Status</th></tr>
          </thead>
          <tbody>
            {requests.map(r => (
              <tr key={r.id} className="border-t" style={{ borderColor: theme.colors.border }}>
                <td className="p-3 text-sm" style={{ color: theme.colors.text }}>{r.type}</td>
                <td className="p-3 text-sm" style={{ color: theme.colors.text }}>{r.startDate} - {r.endDate}</td>
                <td className="p-3"><span className="text-xs px-2 py-1 rounded bg-yellow-100 text-yellow-700">{r.status}</span></td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}
