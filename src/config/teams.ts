export const TEAMS_CONFIG = {
  CLIENT_ID: 'TWOJ_AZURE_CLIENT_ID',
  TENANT_ID: 'common',
  REDIRECT_URI: window.location.origin + '/ZenithMC/auth/teams-callback',
  SCOPES: ['User.Read', 'email', 'openid', 'profile'].join(' ')
}

export const getTeamsAuthUrl = () => {
  const params = new URLSearchParams({
    client_id: TEAMS_CONFIG.CLIENT_ID,
    response_type: 'token',
    redirect_uri: TEAMS_CONFIG.REDIRECT_URI,
    scope: TEAMS_CONFIG.SCOPES,
    response_mode: 'fragment',
    state: Math.random().toString(36).substring(7),
    nonce: Math.random().toString(36).substring(7)
  })
  return `https://login.microsoftonline.com/${TEAMS_CONFIG.TENANT_ID}/oauth2/v2.0/authorize?${params.toString()}`
}

export async function sendToTeams(webhookUrl: string, title: string, message: string) {
  return fetch(webhookUrl, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    mode: 'no-cors',
    body: JSON.stringify({
      "@type": "MessageCard",
      "@context": "https://schema.org/extensions",
      "themeColor": "6366f1",
      "summary": title,
      "sections": [{ "activityTitle": `**${title}**`, "text": message, "markdown": true }]
    })
  })
}
