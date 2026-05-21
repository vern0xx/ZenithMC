export const GOOGLE_CONFIG = {
  CLIENT_ID: 'TWOJ_GOOGLE_CLIENT_ID.apps.googleusercontent.com',
  REDIRECT_URI: window.location.origin + '/ZenithMC/auth/google-callback',
  SCOPES: ['https://www.googleapis.com/auth/calendar', 'https://www.googleapis.com/auth/calendar.events'].join(' ')
}

export const getGoogleAuthUrl = () => {
  const params = new URLSearchParams({
    client_id: GOOGLE_CONFIG.CLIENT_ID,
    redirect_uri: GOOGLE_CONFIG.REDIRECT_URI,
    response_type: 'token',
    scope: GOOGLE_CONFIG.SCOPES,
    prompt: 'consent',
    state: 'google_calendar'
  })
  return `https://accounts.google.com/o/oauth2/v2/auth?${params.toString()}`
}
