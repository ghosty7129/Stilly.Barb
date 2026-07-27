const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api'

/**
 * Vacation periods. Days inside a vacation are closed for booking, and when a
 * period is flagged `announce` the site shows a notice to every visitor.
 */
class VacationAPI {
  async getAll() {
    try {
      const response = await fetch(`${API_URL}/vacations`)
      if (!response.ok) throw new Error('Failed to fetch vacations')
      return await response.json()
    } catch (error) {
      console.error('Error fetching vacations:', error)
      return []
    }
  }

  async create({ startDate, endDate, announce, messageBg, messageEn }) {
    try {
      const response = await fetch(`${API_URL}/vacations`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ startDate, endDate, announce, messageBg, messageEn })
      })

      const data = await response.json()
      if (!response.ok) return { success: false, error: data.error || 'Failed to save vacation' }

      return { success: true, vacation: data.vacation, affectedBookings: data.affectedBookings || 0 }
    } catch (error) {
      console.error('Error creating vacation:', error)
      return { success: false, error: 'Network error. Please try again.' }
    }
  }

  async remove(id) {
    try {
      const response = await fetch(`${API_URL}/vacations/${id}`, { method: 'DELETE' })
      if (!response.ok) {
        const data = await response.json().catch(() => ({}))
        return { success: false, error: data.error || 'Failed to remove vacation' }
      }
      return { success: true }
    } catch (error) {
      console.error('Error removing vacation:', error)
      return { success: false, error: 'Network error. Please try again.' }
    }
  }
}

export const vacationAPI = new VacationAPI()

/** Local date -> YYYY-MM-DD, without the UTC shift toISOString() would cause. */
export const toDateKey = (date) => {
  const pad = (n) => String(n).padStart(2, '0')
  return `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())}`
}

export const isDateOnVacation = (date, vacations = []) => {
  const key = typeof date === 'string' ? date : toDateKey(date)
  return vacations.some(v => key >= v.startDate && key <= v.endDate)
}

/** The announced period covering today or starting next, if any. */
export const getActiveAnnouncement = (vacations = []) => {
  const today = toDateKey(new Date())
  return vacations
    .filter(v => v.announce && v.endDate >= today)
    .sort((a, b) => a.startDate.localeCompare(b.startDate))[0] || null
}
