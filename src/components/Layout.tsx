import { Link, useLocation } from 'react-router-dom'
import { Home, Users, Calendar, FileText, BarChart3, Settings, LogOut, Zap } from 'lucide-react'
import { useAuth } from '@/contexts/AuthContext'
import { useTheme } from '@/contexts/ThemeContext'
import { TimeTracker } from './TimeTracker'
import { NotificationBell } from './NotificationBell'
import { ReactNode } from 'react'

export function Layout({ children }: { children: ReactNode }) {
  const { user, logout } = useAuth()
  const { theme } = useTheme()
  const location = useLocation()
  
  const nav = [
    { href: '/', icon: Home, label: 'Główna' },
    { href: '/team', icon: Users, label: 'Zespół' },
    { href: '/calendar', icon: Calendar, label: 'Kalendarz' },
    { href: '/leave', icon: FileText, label: 'Wnioski' },
    { href: '/reports', icon: BarChart3, label: 'Raporty' },
    { href: '/integrations', icon: Zap, label: 'Integracje' },
    { href: '/settings', icon: Settings, label: 'Ustawienia' }
  ]
  
  return (
    <div className="min-h-screen" style={{ backgroundColor: theme.colors.bg }}>
      <header className="sticky top-0 z-40 border-b" style={{ backgroundColor: theme.colors.cardBg, borderColor: theme.colors.border }}>
        <div className="max-w-7xl mx-auto px-4 h-16 flex items-center justify-between">
          <div className="flex items-center gap-8">
            <Link to="/" className="flex items-center gap-2">
              <div className="w-9 h-9 rounded-lg flex items-center justify-center text-white font-bold" style={{ backgroundColor: theme.colors.primary }}>Z</div>
              <span className="text-xl font-bold hidden sm:block" style={{ color: theme.colors.text }}>ZenithMC</span>
            </Link>
            <nav className="hidden lg:flex gap-1">
              {nav.map(item => {
                const Icon = item.icon
                const active = location.pathname === item.href
                return (
                  <Link key={item.href} to={item.href}
                        className="flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-medium"
                        style={{ backgroundColor: active ? theme.colors.primary + '20' : 'transparent',
                                color: active ? theme.colors.primary : theme.colors.textMuted }}>
                    <Icon className="w-4 h-4" />{item.label}
                  </Link>
                )
              })}
            </nav>
          </div>
          <div className="flex items-center gap-2">
            <TimeTracker />
            <NotificationBell />
            <div className="flex items-center gap-2 pl-2 border-l" style={{ borderColor: theme.colors.border }}>
              {user?.avatar ? (
                <img src={user.avatar} alt={user.name} className="w-8 h-8 rounded-full" />
              ) : (
                <div className="w-8 h-8 rounded-full flex items-center justify-center text-white font-semibold text-sm" style={{ backgroundColor: theme.colors.primary }}>
                  {user?.name?.[0]?.toUpperCase()}
                </div>
              )}
              <span className="hidden md:block text-sm" style={{ color: theme.colors.text }}>{user?.name}</span>
              <button onClick={logout} className="p-2 rounded-lg hover:opacity-70" style={{ color: theme.colors.textMuted }}>
                <LogOut className="w-5 h-5" />
              </button>
            </div>
          </div>
        </div>
      </header>
      <main className="max-w-7xl mx-auto p-4 pb-20 lg:pb-4">{children}</main>
      <nav className="lg:hidden fixed bottom-0 left-0 right-0 border-t flex z-40" style={{ backgroundColor: theme.colors.cardBg, borderColor: theme.colors.border }}>
        {nav.slice(0, 5).map(item => {
          const Icon = item.icon
          const active = location.pathname === item.href
          return (
            <Link key={item.href} to={item.href} className="flex-1 flex flex-col items-center py-2"
                  style={{ color: active ? theme.colors.primary : theme.colors.textMuted }}>
              <Icon className="w-5 h-5" />
              <span className="text-xs mt-1">{item.label}</span>
            </Link>
          )
        })}
      </nav>
    </div>
  )
}
