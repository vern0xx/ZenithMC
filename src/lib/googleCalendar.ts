const API_BASE = 'https://www.googleapis.com/calendar/v3'

function getToken(): string | null { return localStorage.getItem('google_token') }
function headers() { return { 'Authorization': `Bearer ${getToken()}`, 'Content-Type': 'application/json' } }

export const GoogleCalendar = {
  async isConnected(): Promise<boolean> {
    const token = getToken()
    if (!token) return false
    try {
      const res = await fetch(`${API_BASE}/calendars/primary`, { headers: headers() })
      return res.ok
    } catch { return false }
  },
  
  async listEvents(timeMin?: string, timeMax?: string) {
    const params = new URLSearchParams({
      ...(timeMin && { timeMin }), ...(timeMax && { timeMax }),
      singleEvents: 'true', orderBy: 'startTime', maxResults: '100'
    })
    const res = await fetch(`${API_BASE}/calendars/primary/events?${params}`, { headers: headers() })
    if (!res.ok) throw new Error('Błąd pobierania')
    const data = await res.json()
    return data.items
  },
  
  async createEvent(event: any) {
    const res = await fetch(`${API_BASE}/calendars/primary/events`, {
      method: 'POST', headers: headers(), body: JSON.stringify(event)
    })
    if (!res.ok) throw new Error('Błąd tworzenia')
    return await res.json()
  },
  
  async syncLeaveToCalendar(leave: any) {
    return this.createEvent({
      summary: `🌴 ${leave.type}`,
      description: leave.reason || `Urlop: ${leave.type}`,
      start: { date: leave.startDate },
      end: { date: leave.endDate },
      colorId: '5'
    })
  }
}
