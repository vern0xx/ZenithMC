import { useState, useEffect } from 'react'
import { useTheme, THEMES, ThemeName } from '@/contexts/ThemeContext'
import { useNotifications } from '@/contexts/NotificationContext'
import { db, generateId, Webhook } from '@/lib/db'
import { Trash2, Plus, Check, Bell } from 'lucide-react'

export default function Settings() {
  const { theme, setTheme, themeName } = useTheme()
  const { permissionGranted, requestPermission } = useNotifications()
  const [webhooks, setWebhooks] = useState<Webhook[]>([])
  const [newWebhook, setNewWebhook] = useState<Omit<Webhook, 'id'>>({
    name: '', url: '', type: 'slack', events: [], active: true
  })
  
  useEffect(() => { loadWebhooks() }, [])
  const loadWebhooks = async () => setWebhooks(await db.getAll<Webhook>('webhooks'))
  
  const addWebhook = async () => {
    if (!newWebhook.name || !newWebhook.url) return
    await db.put('webhooks', { ...newWebhook, id: generateId() })
    setNewWebhook({ name: '', url: '', type: 'slack', events: [], active: true })
    loadWebhooks()
  }
  
  const events = ['user.created', 'time.started', 'time.stopped', 'leave.created', 'leave.approved', 'leave.rejected']
  
  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <h1 className="text-3xl font-bold" style={{ color: theme.colors.text }}>Ustawienia</h1>
      
      <div className="p-6 rounded-xl" style={{ backgroundColor: theme.colors.cardBg, border: `1px solid ${theme.colors.border}` }}>
        <h2 className="text-xl font-semibold mb-2" style={{ color: theme.colors.text }}>Powiadomienia push</h2>
        {!permissionGranted ? (
          <button onClick={requestPermission} className="flex items-center gap-2 px-4 py-2 rounded text-white" style={{ backgroundColor: theme.colors.primary }}>
            <Bell className="w-4 h-4" /> Włącz
          </button>
        ) : <p style={{ color: theme.colors.text }}>✅ Włączone</p>}
      </div>
      
      <div className="p-6 rounded-xl" style={{ backgroundColor: theme.colors.cardBg, border: `1px solid ${theme.colors.border}` }}>
        <h2 className="text-xl font-semibold mb-4" style={{ color: theme.colors.text }}>Motyw ({Object.keys(THEMES).length})</h2>
        <div className="grid grid-cols-2 md:grid-cols-5 gap-3">
          {(Object.keys(THEMES) as ThemeName[]).map(name => {
            const t = THEMES[name]
            const active = themeName === name
            return (
              <button key={name} onClick={() => setTheme(name)} className="relative p-3 rounded-lg"
                      style={{ backgroundColor: t.colors.cardBg, border: `2px solid ${active ? t.colors.primary : t.colors.border}` }}>
                <div className="flex gap-1 mb-2">
                  <div className="w-6 h-6 rounded" style={{ backgroundColor: t.colors.primary }} />
                  <div className="w-6 h-6 rounded" style={{ backgroundColor: t.colors.accent }} />
                </div>
                <div className="text-xs" style={{ color: t.colors.text }}>{t.label}</div>
                {active && <div className="absolute top-2 right-2 w-5 h-5 rounded-full flex items-center justify-center" style={{ backgroundColor: t.colors.primary }}><Check className="w-3 h-3 text-white" /></div>}
              </button>
            )
          })}
        </div>
      </div>
      
      <div className="p-6 rounded-xl" style={{ backgroundColor: theme.colors.cardBg, border: `1px solid ${theme.colors.border}` }}>
        <h2 className="text-xl font-semibold mb-4" style={{ color: theme.colors.text }}>Webhooks</h2>
        <div className="space-y-2 mb-4">
          {webhooks.map(w => (
            <div key={w.id} className="flex items-center justify-between p-3 rounded-lg" style={{ backgroundColor: theme.colors.bg }}>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2">
                  <span className="text-xs px-2 py-0.5 rounded uppercase" style={{ backgroundColor: theme.colors.primary, color: 'white' }}>{w.type}</span>
                  <span style={{ color: theme.colors.text }}>{w.name}</span>
                </div>
              </div>
              <button onClick={async () => { await db.delete('webhooks', w.id); loadWebhooks() }} className="p-2"><Trash2 className="w-4 h-4 text-red-500" /></button>
            </div>
          ))}
        </div>
        <div className="space-y-3 p-4 rounded-lg" style={{ backgroundColor: theme.colors.bg }}>
          <input placeholder="Nazwa" value={newWebhook.name} onChange={e => setNewWebhook({...newWebhook, name: e.target.value})} className="w-full px-3 py-2 rounded border" style={{ backgroundColor: theme.colors.cardBg, borderColor: theme.colors.border, color: theme.colors.text }} />
          <select value={newWebhook.type} onChange={e => setNewWebhook({...newWebhook, type: e.target.value as any})} className="w-full px-3 py-2 rounded border" style={{ backgroundColor: theme.colors.cardBg, borderColor: theme.colors.border, color: theme.colors.text }}>
            <option value="slack">Slack</option><option value="discord">Discord</option><option value="teams">Teams</option><option value="zapier">Zapier</option><option value="make">Make</option><option value="custom">Custom</option>
          </select>
          <input placeholder="URL" value={newWebhook.url} onChange={e => setNewWebhook({...newWebhook, url: e.target.value})} className="w-full px-3 py-2 rounded border" style={{ backgroundColor: theme.colors.cardBg, borderColor: theme.colors.border, color: theme.colors.text }} />
          <div className="flex flex-wrap gap-2">
            {events.map(e => (
              <label key={e} className="flex items-center gap-2 px-3 py-1 rounded text-sm" style={{ backgroundColor: theme.colors.cardBg, color: theme.colors.text }}>
                <input type="checkbox" checked={newWebhook.events.includes(e)} onChange={ev => {
                  if (ev.target.checked) setNewWebhook({...newWebhook, events: [...newWebhook.events, e]})
                  else setNewWebhook({...newWebhook, events: newWebhook.events.filter(ev => ev !== e)})
                }} />{e}
              </label>
            ))}
          </div>
          <button onClick={addWebhook} className="flex items-center gap-2 px-4 py-2 rounded text-white" style={{ backgroundColor: theme.colors.primary }}>
            <Plus className="w-4 h-4" /> Dodaj
          </button>
        </div>
      </div>
    </div>
  )
}
