import { WORKER_ENDPOINTS } from '@/config/workers'

export async function sendSMS(to: string, message: string): Promise<{ success: boolean; error?: string }> {
  try {
    const res = await fetch(WORKER_ENDPOINTS.sms, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ to, message })
    })
    return await res.json()
  } catch (error: any) {
    return { success: false, error: error.message }
  }
}

export const SMSTemplates = {
  leaveApproved: (name: string, type: string, from: string, to: string) =>
    `ZenithMC: ${name}! Wniosek o ${type} (${from} - ${to}) ZATWIERDZONY ✅`,
  leaveRejected: (name: string, type: string) =>
    `ZenithMC: ${name}, wniosek o ${type} odrzucony.`,
  workReminder: (name: string) => `ZenithMC: ${name}! Zarejestruj czas pracy ⏰`,
  overtimeAlert: (name: string, hours: number) =>
    `ZenithMC: ${name}, przekroczyłeś ${hours}h nadgodzin.`
}
