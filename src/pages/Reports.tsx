import { useState, useEffect } from 'react'
import { useTheme } from '@/contexts/ThemeContext'
import { db, TimeEntry, LeaveRequest } from '@/lib/db'
import { exportToJSON, exportToCSV } from '@/lib/export'
import { Download } from 'lucide-react'

export default function Reports() {
  const { theme } = useTheme()
  const [entries, setEntries] = useState<TimeEntry[]>([])
  const [leaves, setLeaves] = useState<LeaveRequest[]>([])
  
  useEffect(() => {
    db.getAll<TimeEntry>('timeEntries').then(setEntries)
    db.getAll<LeaveRequest>('leaveRequests').then(setLeaves)
  }, [])
  
  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold" style={{ color: theme.colors.text }}>Raporty</h1>
      <div className="p-6 rounded-xl" style={{ backgroundColor: theme.colors.cardBg, border: `1px solid ${theme.colors.border}` }}>
        <h2 className="font-semibold mb-4" style={{ color: theme.colors.text }}>Eksport</h2>
        <div className="flex gap-2 flex-wrap">
          <button onClick={() => exportToJSON(entries, 'entries')} className="flex items-center gap-2 px-4 py-2 rounded text-white" style={{ backgroundColor: theme.colors.primary }}>
            <Download className="w-4 h-4" /> JSON
          </button>
          <button onClick={() => exportToCSV(entries, 'entries')} className="flex items-center gap-2 px-4 py-2 rounded text-white" style={{ backgroundColor: theme.colors.primary }}>
            <Download className="w-4 h-4" /> CSV
          </button>
        </div>
      </div>
    </div>
  )
}
