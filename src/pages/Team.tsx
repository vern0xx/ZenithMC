import { useState, useEffect } from 'react'
import { db, User } from '@/lib/db'
import { useTheme } from '@/contexts/ThemeContext'

export default function Team() {
  const { theme } = useTheme()
  const [users, setUsers] = useState<User[]>([])
  useEffect(() => { db.getAll<User>('users').then(setUsers) }, [])
  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold" style={{ color: theme.colors.text }}>Zespół</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {users.map(u => (
          <div key={u.id} className="p-6 rounded-xl" style={{ backgroundColor: theme.colors.cardBg, border: `1px solid ${theme.colors.border}` }}>
            <div className="flex items-center gap-3 mb-3">
              {u.avatar ? <img src={u.avatar} alt={u.name} className="w-12 h-12 rounded-full" /> :
                <div className="w-12 h-12 rounded-full flex items-center justify-center text-white font-semibold" style={{ backgroundColor: theme.colors.primary }}>{u.name[0]}</div>}
              <div>
                <div className="font-semibold" style={{ color: theme.colors.text }}>{u.name}</div>
                <div className="text-sm" style={{ color: theme.colors.textMuted }}>{u.email}</div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
