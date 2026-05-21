import { createContext, useContext, useState, useEffect, ReactNode } from 'react'
import { db, generateId, User } from '@/lib/db'
import { triggerWebhook } from '@/lib/webhooks'
import { getDiscordAuthUrl } from '@/config/discord'
import { getTeamsAuthUrl } from '@/config/teams'

interface AuthContextType {
  user: User | null
  loading: boolean
  loginWithDiscord: () => void
  loginWithTeams: () => void
  logout: () => void
  handleDiscordCallback: (token: string) => Promise<void>
  handleTeamsCallback: (token: string) => Promise<void>
}

const AuthContext = createContext<AuthContextType | null>(null)

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [loading, setLoading] = useState(true)
  
  useEffect(() => {
    const init = async () => {
      await db.init()
      const stored = localStorage.getItem('user')
      if (stored) setUser(JSON.parse(stored))
      setLoading(false)
    }
    init()
  }, [])
  
  const loginWithDiscord = () => { window.location.href = getDiscordAuthUrl() }
  const loginWithTeams = () => { window.location.href = getTeamsAuthUrl() }
  
  const handleDiscordCallback = async (accessToken: string) => {
    try {
      const res = await fetch('https://discord.com/api/users/@me', {
        headers: { Authorization: `Bearer ${accessToken}` }
      })
      const discordUser = await res.json()
      const existing = await db.query<User>('users', u => u.discordId === discordUser.id)
      let appUser: User
      if (existing.length > 0) {
        appUser = existing[0]
      } else {
        const allUsers = await db.getAll<User>('users')
        appUser = {
          id: generateId(),
          discordId: discordUser.id,
          email: discordUser.email || `${discordUser.username}@discord.local`,
          name: discordUser.global_name || discordUser.username,
          avatar: discordUser.avatar ? `https://cdn.discordapp.com/avatars/${discordUser.id}/${discordUser.avatar}.png` : undefined,
          role: allUsers.length === 0 ? 'ADMIN' : 'EMPLOYEE',
          status: 'Aktywny', vacationDays: 26, usedVacation: 0
        }
        await db.put('users', appUser)
        await triggerWebhook('user.created', { user: appUser })
      }
      setUser(appUser)
      localStorage.setItem('user', JSON.stringify(appUser))
      localStorage.setItem('discord_token', accessToken)
    } catch (error) { console.error(error) }
  }
  
  const handleTeamsCallback = async (accessToken: string) => {
    try {
      const res = await fetch('https://graph.microsoft.com/v1.0/me', {
        headers: { Authorization: `Bearer ${accessToken}` }
      })
      const msUser = await res.json()
      const existing = await db.query<User>('users', u => u.microsoftId === msUser.id)
      let appUser: User
      if (existing.length > 0) {
        appUser = existing[0]
      } else {
        const allUsers = await db.getAll<User>('users')
        appUser = {
          id: generateId(),
          microsoftId: msUser.id,
          email: msUser.mail || msUser.userPrincipalName,
          name: msUser.displayName,
          role: allUsers.length === 0 ? 'ADMIN' : 'EMPLOYEE',
          status: 'Aktywny', vacationDays: 26, usedVacation: 0
        }
        await db.put('users', appUser)
      }
      setUser(appUser)
      localStorage.setItem('user', JSON.stringify(appUser))
      localStorage.setItem('teams_token', accessToken)
    } catch (error) { console.error(error) }
  }
  
  const logout = () => {
    setUser(null)
    localStorage.clear()
  }
  
  return (
    <AuthContext.Provider value={{ user, loading, loginWithDiscord, loginWithTeams, logout, handleDiscordCallback, handleTeamsCallback }}>
      {children}
    </AuthContext.Provider>
  )
}

export const useAuth = () => {
  const ctx = useContext(AuthContext)
  if (!ctx) throw new Error('useAuth must be inside AuthProvider')
  return ctx
}
