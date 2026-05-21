import { useState, useEffect } from 'react'
import { useTheme } from '@/contexts/ThemeContext'
import { useAuth } from '@/contexts/AuthContext'
import { getGoogleAuthUrl } from '@/config/google'
import { GoogleCalendar } from '@/lib/googleCalendar'
import { BambooHR, Workday, DISCORD_BOT_INFO } from '@/lib/hrIntegrations'
import { sendSMS, SMSTemplates } from '@/lib/sms'
import { DISCORD_CONFIG } from '@/config/discord'
import { Calendar, MessageSquare, Database, Bot, RefreshCw, Send } from 'lucide-react'

export default function Integrations() {
  const { theme } = useTheme()
  const { user } = useAuth()
  const [googleConnected, setGoogleConnected] = useState(false)
  const [smsForm, setSmsForm] = useState({ to: '', message: '' })
  const [smsStatus, setSmsStatus] = useState('')
  const [loading, setLoading] = useState<string | null>(null)
  
  useEffect(() => { GoogleCalendar.isConnected().then(setGoogleConnected) }, [])
  
  const handleSMS = async () => {
    if (!smsForm.to || !smsForm.message) return
    setLoading('sms')
    const result = await sendSMS(smsForm.to, smsForm.message)
    setSmsStatus(result.success ? '✅ Wysłany!' : `❌ ${result.error}`)
    setLoading(null)
  }
  
  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold" style={{ color: theme.colors.text }}>Integracje</h1>
      
      <Card theme={theme} icon={Calendar} title="Google Calendar">
        {!googleConnected ? (
          <button onClick={() => window.location.href = getGoogleAuthUrl()} className="px-4 py-2 rounded text-white" style={{ backgroundColor: '#4285F4' }}>
            Połącz Google
          </button>
        ) : <p style={{ color: theme.colors.text }}>✅ Połączono</p>}
      </Card>
      
      <Card theme={theme} icon={Bot} title="Discord Bot">
        <a href={DISCORD_BOT_INFO.inviteUrl(DISCORD_CONFIG.CLIENT_ID)} target="_blank" rel="noopener" className="inline-block px-4 py-2 rounded text-white" style={{ backgroundColor: '#5865F2' }}>
          Zaproś bota
        </a>
        <div className="mt-3 space-y-1">
          {DISCORD_BOT_INFO.commands.map(c => (
            <div key={c.name} className="text-sm" style={{ color: theme.colors.text }}>
              <code className="px-2 py-0.5 rounded" style={{ backgroundColor: theme.colors.bg }}>{c.name}</code> — {c.description}
            </div>
          ))}
        </div>
      </Card>
      
      <Card theme={theme} icon={Database} title="BambooHR">
        <button onClick={async () => { setLoading('b'); try { await BambooHR.importEmployees() } catch(e: any){ alert(e.message) } setLoading(null) }}
                className="flex items-center gap-2 px-4 py-2 rounded text-white" style={{ backgroundColor: '#73C41D' }}>
          <RefreshCw className={`w-4 h-4 ${loading === 'b' ? 'animate-spin' : ''}`} /> Importuj
        </button>
      </Card>
      
      <Card theme={theme} icon={Database} title="Workday">
        <button onClick={async () => { setLoading('w'); try { await Workday.importWorkers() } catch(e: any){ alert(e.message) } setLoading(null) }}
                className="flex items-center gap-2 px-4 py-2 rounded text-white" style={{ backgroundColor: '#F38B00' }}>
          <RefreshCw className={`w-4 h-4 ${loading === 'w' ? 'animate-spin' : ''}`} /> Importuj
        </button>
      </Card>
      
      <Card theme={theme} icon={MessageSquare} title="SMS (Twilio)">
        <div className="space-y-3">
          <input type="tel" placeholder="+48..." value={smsForm.to} onChange={e => setSmsForm({...smsForm, to: e.target.value})}
                 className="w-full px-3 py-2 rounded border" style={{ backgroundColor: theme.colors.bg, borderColor: theme.colors.border, color: theme.colors.text }} />
          <textarea placeholder="Wiadomość" value={smsForm.message} onChange={e => setSmsForm({...smsForm, message: e.target.value})}
                    rows={3} className="w-full px-3 py-2 rounded border" style={{ backgroundColor: theme.colors.bg, borderColor: theme.colors.border, color: theme.colors.text }} />
          <button onClick={() => setSmsForm({...smsForm, message: SMSTemplates.workReminder(user?.name || 'X')})}
                  className="text-xs px-3 py-1 rounded" style={{ backgroundColor: theme.colors.bg, color: theme.colors.text }}>
            Szablon: Przypomnienie
          </button>
          <button onClick={handleSMS} disabled={loading === 'sms'}
                  className="flex items-center gap-2 px-4 py-2 rounded text-white" style={{ backgroundColor: '#F22F46' }}>
            <Send className="w-4 h-4" /> Wyślij
          </button>
          {smsStatus && <p style={{ color: theme.colors.text }}>{smsStatus}</p>}
        </div>
      </Card>
    </div>
  )
}

function Card({ theme, icon: Icon, title, children }: any) {
  return (
    <div className="p-6 rounded-xl" style={{ backgroundColor: theme.colors.cardBg, border: `1px solid ${theme.colors.border}` }}>
      <div className="flex items-center gap-3 mb-4">
        <div className="w-10 h-10 rounded-lg flex items-center justify-center" style={{ backgroundColor: theme.colors.primary + '20' }}>
          <Icon className="w-5 h-5" style={{ color: theme.colors.primary }} />
        </div>
        <h3 className="font-semibold" style={{ color: theme.colors.text }}>{title}</h3>
      </div>
      {children}
    </div>
  )
}
