import { WORKER_ENDPOINTS } from '@/config/workers'

export const BambooHR = {
  async getEmployees() {
    const res = await fetch(`${WORKER_ENDPOINTS.bamboohr}/employees/directory`)
    if (!res.ok) throw new Error('BambooHR błąd')
    return await res.json()
  },
  async importEmployees() {
    const data = await this.getEmployees()
    return data.employees?.map((emp: any) => ({
      externalId: emp.id, name: `${emp.firstName} ${emp.lastName}`,
      email: emp.workEmail, position: emp.jobTitle,
      department: emp.department, source: 'bamboohr'
    })) || []
  }
}

export const Workday = {
  async getWorkers() {
    const res = await fetch(`${WORKER_ENDPOINTS.workday}/workers`)
    if (!res.ok) throw new Error('Workday błąd')
    return await res.json()
  },
  async importWorkers() {
    const data = await this.getWorkers()
    return data.data?.map((w: any) => ({
      externalId: w.id, name: w.descriptor,
      email: w.primaryWorkEmail?.emailAddress,
      position: w.jobProfileSummary?.jobTitle, source: 'workday'
    })) || []
  }
}

export const DISCORD_BOT_INFO = {
  inviteUrl: (clientId: string) =>
    `https://discord.com/oauth2/authorize?client_id=${clientId}&scope=bot+applications.commands&permissions=2147486720`,
  commands: [
    { name: '/time start', description: 'Rozpocznij pracę' },
    { name: '/time stop', description: 'Zakończ pracę' },
    { name: '/time status', description: 'Status' },
    { name: '/leave', description: 'Wniosek urlopowy' },
    { name: '/stats', description: 'Statystyki' },
    { name: '/help', description: 'Pomoc' }
  ]
}
