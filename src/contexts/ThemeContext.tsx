import { createContext, useContext, useState, useEffect, ReactNode } from 'react'

export type ThemeName = 
  | 'indigo' | 'purple' | 'blue' | 'green' | 'orange' | 'pink' | 'red' 
  | 'teal' | 'amber' | 'rose' | 'cyan' | 'lime' | 'emerald' | 'fuchsia' | 'sky'
  | 'dark' | 'midnight' | 'forest' | 'ocean' | 'sunset' | 'cyberpunk' 
  | 'matrix' | 'dracula' | 'nord' | 'monokai'

export interface Theme {
  name: ThemeName
  label: string
  isDark: boolean
  colors: {
    primary: string; primaryHover: string; bg: string; cardBg: string
    text: string; textMuted: string; border: string; accent: string
  }
}

export const THEMES: Record<ThemeName, Theme> = {
  indigo: { name: 'indigo', label: '💜 Indygo', isDark: false, colors: { primary: '#6366f1', primaryHover: '#4f46e5', bg: '#f9fafb', cardBg: '#ffffff', text: '#111827', textMuted: '#6b7280', border: '#e5e7eb', accent: '#818cf8' }},
  purple: { name: 'purple', label: '🟣 Fioletowy', isDark: false, colors: { primary: '#a855f7', primaryHover: '#9333ea', bg: '#faf5ff', cardBg: '#ffffff', text: '#111827', textMuted: '#6b7280', border: '#e9d5ff', accent: '#c084fc' }},
  blue: { name: 'blue', label: '🔵 Niebieski', isDark: false, colors: { primary: '#3b82f6', primaryHover: '#2563eb', bg: '#eff6ff', cardBg: '#ffffff', text: '#111827', textMuted: '#6b7280', border: '#dbeafe', accent: '#60a5fa' }},
  green: { name: 'green', label: '🟢 Zielony', isDark: false, colors: { primary: '#10b981', primaryHover: '#059669', bg: '#f0fdf4', cardBg: '#ffffff', text: '#111827', textMuted: '#6b7280', border: '#d1fae5', accent: '#34d399' }},
  orange: { name: 'orange', label: '🟠 Pomarańczowy', isDark: false, colors: { primary: '#f97316', primaryHover: '#ea580c', bg: '#fff7ed', cardBg: '#ffffff', text: '#111827', textMuted: '#6b7280', border: '#fed7aa', accent: '#fb923c' }},
  pink: { name: 'pink', label: '🌸 Różowy', isDark: false, colors: { primary: '#ec4899', primaryHover: '#db2777', bg: '#fdf2f8', cardBg: '#ffffff', text: '#111827', textMuted: '#6b7280', border: '#fbcfe8', accent: '#f472b6' }},
  red: { name: 'red', label: '🔴 Czerwony', isDark: false, colors: { primary: '#ef4444', primaryHover: '#dc2626', bg: '#fef2f2', cardBg: '#ffffff', text: '#111827', textMuted: '#6b7280', border: '#fecaca', accent: '#f87171' }},
  teal: { name: 'teal', label: '🌊 Turkusowy', isDark: false, colors: { primary: '#14b8a6', primaryHover: '#0d9488', bg: '#f0fdfa', cardBg: '#ffffff', text: '#111827', textMuted: '#6b7280', border: '#ccfbf1', accent: '#5eead4' }},
  amber: { name: 'amber', label: '🟡 Bursztyn', isDark: false, colors: { primary: '#f59e0b', primaryHover: '#d97706', bg: '#fffbeb', cardBg: '#ffffff', text: '#111827', textMuted: '#6b7280', border: '#fde68a', accent: '#fbbf24' }},
  rose: { name: 'rose', label: '🌹 Róża', isDark: false, colors: { primary: '#f43f5e', primaryHover: '#e11d48', bg: '#fff1f2', cardBg: '#ffffff', text: '#111827', textMuted: '#6b7280', border: '#fecdd3', accent: '#fb7185' }},
  cyan: { name: 'cyan', label: '💎 Cyjan', isDark: false, colors: { primary: '#06b6d4', primaryHover: '#0891b2', bg: '#ecfeff', cardBg: '#ffffff', text: '#111827', textMuted: '#6b7280', border: '#cffafe', accent: '#22d3ee' }},
  lime: { name: 'lime', label: '🍋 Limonkowy', isDark: false, colors: { primary: '#84cc16', primaryHover: '#65a30d', bg: '#f7fee7', cardBg: '#ffffff', text: '#111827', textMuted: '#6b7280', border: '#d9f99d', accent: '#a3e635' }},
  emerald: { name: 'emerald', label: '💚 Szmaragd', isDark: false, colors: { primary: '#059669', primaryHover: '#047857', bg: '#ecfdf5', cardBg: '#ffffff', text: '#111827', textMuted: '#6b7280', border: '#a7f3d0', accent: '#10b981' }},
  fuchsia: { name: 'fuchsia', label: '🌺 Fuksja', isDark: false, colors: { primary: '#d946ef', primaryHover: '#c026d3', bg: '#fdf4ff', cardBg: '#ffffff', text: '#111827', textMuted: '#6b7280', border: '#f5d0fe', accent: '#e879f9' }},
  sky: { name: 'sky', label: '☁️ Niebo', isDark: false, colors: { primary: '#0ea5e9', primaryHover: '#0284c7', bg: '#f0f9ff', cardBg: '#ffffff', text: '#111827', textMuted: '#6b7280', border: '#bae6fd', accent: '#38bdf8' }},
  dark: { name: 'dark', label: '🌑 Ciemny', isDark: true, colors: { primary: '#6366f1', primaryHover: '#818cf8', bg: '#111827', cardBg: '#1f2937', text: '#f9fafb', textMuted: '#9ca3af', border: '#374151', accent: '#a5b4fc' }},
  midnight: { name: 'midnight', label: '🌌 Północ', isDark: true, colors: { primary: '#8b5cf6', primaryHover: '#a78bfa', bg: '#0f0f23', cardBg: '#1a1a3e', text: '#f0f0ff', textMuted: '#a0a0c0', border: '#2a2a5e', accent: '#c4b5fd' }},
  forest: { name: 'forest', label: '🌲 Las', isDark: true, colors: { primary: '#22c55e', primaryHover: '#16a34a', bg: '#0a1f0f', cardBg: '#152e1c', text: '#f0fff4', textMuted: '#86efac', border: '#1f3d28', accent: '#4ade80' }},
  ocean: { name: 'ocean', label: '🌊 Ocean', isDark: true, colors: { primary: '#06b6d4', primaryHover: '#0891b2', bg: '#0c1929', cardBg: '#162a3f', text: '#f0f9ff', textMuted: '#7dd3fc', border: '#1e3a52', accent: '#22d3ee' }},
  sunset: { name: 'sunset', label: '🌅 Zachód', isDark: true, colors: { primary: '#f97316', primaryHover: '#ea580c', bg: '#1f1410', cardBg: '#2d1f1a', text: '#fff7ed', textMuted: '#fdba74', border: '#3d2820', accent: '#fb923c' }},
  cyberpunk: { name: 'cyberpunk', label: '🤖 Cyberpunk', isDark: true, colors: { primary: '#ec4899', primaryHover: '#f472b6', bg: '#0a0014', cardBg: '#1a0033', text: '#fce7f3', textMuted: '#f0abfc', border: '#4c1d95', accent: '#a855f7' }},
  matrix: { name: 'matrix', label: '💚 Matrix', isDark: true, colors: { primary: '#22c55e', primaryHover: '#16a34a', bg: '#000000', cardBg: '#0a0f0a', text: '#86efac', textMuted: '#4ade80', border: '#14532d', accent: '#22c55e' }},
  dracula: { name: 'dracula', label: '🧛 Dracula', isDark: true, colors: { primary: '#bd93f9', primaryHover: '#9d6efb', bg: '#282a36', cardBg: '#44475a', text: '#f8f8f2', textMuted: '#6272a4', border: '#6272a4', accent: '#ff79c6' }},
  nord: { name: 'nord', label: '❄️ Nord', isDark: true, colors: { primary: '#88c0d0', primaryHover: '#5e81ac', bg: '#2e3440', cardBg: '#3b4252', text: '#eceff4', textMuted: '#d8dee9', border: '#4c566a', accent: '#81a1c1' }},
  monokai: { name: 'monokai', label: '🎨 Monokai', isDark: true, colors: { primary: '#f92672', primaryHover: '#fd5c8f', bg: '#272822', cardBg: '#3e3d32', text: '#f8f8f2', textMuted: '#75715e', border: '#49483e', accent: '#a6e22e' }}
}

interface ThemeContextType {
  theme: Theme
  setTheme: (name: ThemeName) => void
  themeName: ThemeName
}

const ThemeContext = createContext<ThemeContextType | null>(null)

export function ThemeProvider({ children }: { children: ReactNode }) {
  const [themeName, setThemeName] = useState<ThemeName>(() => 
    (localStorage.getItem('theme') as ThemeName) || 'indigo'
  )
  const theme = THEMES[themeName] || THEMES.indigo
  useEffect(() => {
    document.body.style.backgroundColor = theme.colors.bg
    document.body.style.color = theme.colors.text
    localStorage.setItem('theme', themeName)
  }, [theme, themeName])
  return (
    <ThemeContext.Provider value={{ theme, setTheme: setThemeName, themeName }}>
      {children}
    </ThemeContext.Provider>
  )
}

export const useTheme = () => {
  const ctx = useContext(ThemeContext)
  if (!ctx) throw new Error('useTheme must be inside ThemeProvider')
  return ctx
}
