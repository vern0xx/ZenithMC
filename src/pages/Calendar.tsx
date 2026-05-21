import { useTheme } from '@/contexts/ThemeContext'
export default function Calendar() {
  const { theme } = useTheme()
  return <div><h1 className="text-3xl font-bold" style={{ color: theme.colors.text }}>Kalendarz</h1></div>
}
