export const DISCORD_CONFIG = {
  CLIENT_ID: 'TWOJ_DISCORD_CLIENT_ID',
  REDIRECT_URI: window.location.origin + '/ZenithMC/auth/callback',
  SCOPES: ['identify', 'email'].join(' ')
}

export const getDiscordAuthUrl = () => {
  const params = new URLSearchParams({
    client_id: DISCORD_CONFIG.CLIENT_ID,
    redirect_uri: DISCORD_CONFIG.REDIRECT_URI,
    response_type: 'token',
    scope: DISCORD_CONFIG.SCOPES
  })
  return `https://discord.com/api/oauth2/authorize?${params.toString()}`
}
