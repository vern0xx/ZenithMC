import { useState } from 'react'
import { Bell } from 'lucide-react'
import { useNotifications } from '@/contexts/NotificationContext'
import { useTheme } from '@/contexts/ThemeContext'
import { markAsRead } from '@/lib/notifications'

export function NotificationBell() {
  const { notifications, unreadCount, refresh } = useNotifications()
  const { theme } = useTheme()
  const [open, setOpen] = useState(false)
  
  return (
    <div className="relative">
      <button onClick={() => setOpen(!open)} className="relative p-2 rounded-lg hover:bg-black/5" style={{ color: theme.colors.text }}>
        <Bell className="w-5 h-5" />
        {unreadCount > 0 && (
          <span className="absolute top-0 right-0 w-5 h-5 rounded-full bg-red-500 text-white text-xs flex items-center justify-center">
            {unreadCount > 9 ? '9+' : unreadCount}
          </span>
        )}
      </button>
      {open && (
        <>
          <div className="fixed inset-0 z-40" onClick={() => setOpen(false)} />
          <div className="absolute right-0 mt-2 w-80 rounded-xl shadow-2xl z-50 max-h-96 overflow-y-auto"
               style={{ backgroundColor: theme.colors.cardBg, border: `1px solid ${theme.colors.border}` }}>
            <div className="p-3 border-b" style={{ borderColor: theme.colors.border }}>
              <h3 className="font-semibold" style={{ color: theme.colors.text }}>Powiadomienia</h3>
            </div>
            {notifications.length === 0 ? (
              <p className="p-4 text-center text-sm" style={{ color: theme.colors.textMuted }}>Brak powiadomień</p>
            ) : (
              notifications.slice(0, 10).map(n => (
                <button key={n.id} onClick={async () => { await markAsRead(n.id); await refresh() }}
                        className="w-full p-3 text-left hover:bg-black/5 border-b last:border-0"
                        style={{ borderColor: theme.colors.border, backgroundColor: n.read ? 'transparent' : theme.colors.primary + '10' }}>
                  <div className="font-medium text-sm" style={{ color: theme.colors.text }}>{n.title}</div>
                  <div className="text-xs mt-1" style={{ color: theme.colors.textMuted }}>{n.message}</div>
                </button>
              ))
            )}
          </div>
        </>
      )}
    </div>
  )
}
