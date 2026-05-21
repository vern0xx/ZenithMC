import { useAuth } from '@/contexts/AuthContext'
import { useTheme, THEMES, ThemeName } from '@/contexts/ThemeContext'

export default function Login() {
  const { loginWithDiscord, loginWithTeams } = useAuth()
  const { theme, setTheme, themeName } = useTheme()
  
  return (
    <div className="min-h-screen flex items-center justify-center p-4"
         style={{ background: `linear-gradient(135deg, ${theme.colors.primary}, ${theme.colors.accent})` }}>
      <div className="rounded-2xl shadow-2xl p-8 w-full max-w-md" style={{ backgroundColor: theme.colors.cardBg }}>
        <div className="text-center mb-8">
          <div className="w-16 h-16 mx-auto mb-4 rounded-2xl flex items-center justify-center text-3xl font-bold text-white" style={{ backgroundColor: theme.colors.primary }}>Z</div>
          <h1 className="text-3xl font-bold" style={{ color: theme.colors.text }}>ZenithMC</h1>
          <p className="mt-2" style={{ color: theme.colors.textMuted }}>System HR</p>
        </div>
        <div className="space-y-3">
          <button onClick={loginWithDiscord} className="w-full py-3 rounded-lg font-semibold text-white" style={{ backgroundColor: '#5865F2' }}>
            Zaloguj przez Discord
          </button>
          <button onClick={loginWithTeams} className="w-full py-3 rounded-lg font-semibold text-white" style={{ backgroundColor: '#5059C9' }}>
            Zaloguj przez Microsoft Teams
          </button>
        </div>
        <div className="mt-8 pt-6 border-t" style={{ borderColor: theme.colors.border }}>
          <p className="text-sm mb-3" style={{ color: theme.colors.textMuted }}>Motyw ({Object.keys(THEMES).length}):</p>
          <div className="grid grid-cols-5 gap-2">
            {(Object.keys(THEMES) as ThemeName[]).map(name => (
              <button key={name} onClick={() => setTheme(name)}
                      className={`h-10 rounded-lg ${themeName === name ? 'ring-2 ring-offset-2 scale-110' : ''}`}
                      style={{ background: `linear-gradient(135deg, ${THEMES[name].colors.primary}, ${THEMES[name].colors.accent})` }}
                      title={THEMES[name].label} />
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
