import { useEffect } from 'react'
import { useNavigate, useLocation } from 'react-router-dom'
import { useAuth } from '@/contexts/AuthContext'

export default function AuthCallback() {
  const { handleDiscordCallback, handleTeamsCallback } = useAuth()
  const navigate = useNavigate()
  const location = useLocation()
  
  useEffect(() => {
    const hash = window.location.hash.substring(1)
    const params = new URLSearchParams(hash)
    const accessToken = params.get('access_token')
    const state = params.get('state')
    
    if (accessToken) {
      if (state === 'google_calendar' || location.pathname.includes('google')) {
        localStorage.setItem('google_token', accessToken)
        navigate('/integrations')
        return
      }
      if (location.pathname.includes('teams')) {
        handleTeamsCallback(accessToken).then(() => navigate('/'))
        return
      }
      handleDiscordCallback(accessToken).then(() => navigate('/'))
    } else {
      navigate('/login')
    }
  }, [])
  
  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="text-center">
        <div className="w-12 h-12 border-4 border-indigo-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
        <p>Logowanie...</p>
      </div>
    </div>
  )
}
