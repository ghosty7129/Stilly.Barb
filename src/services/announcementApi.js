import { toDateKey } from './vacationApi'

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api'

/**
 * Standalone site messages. Nothing here closes a day or touches the booking
 * calendar — an announcement only puts text in front of visitors, so the
 * barber can post news without implying an absence.
 */
class AnnouncementAPI {
  async getAll() {
    try {
      const response = await fetch(`${API_URL}/announcements`)
      if (!response.ok) throw new Error('Failed to fetch announcements')
      return await response.json()
    } catch (error) {
      console.error('Error fetching announcements:', error)
      return []
    }
  }

  async create(announcement) {
    try {
      const response = await fetch(`${API_URL}/announcements`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(announcement)
      })

      const data = await response.json()
      if (!response.ok) return { success: false, error: data.error || 'Failed to save the message' }

      return { success: true, announcement: data.announcement }
    } catch (error) {
      console.error('Error creating announcement:', error)
      return { success: false, error: 'Network error. Please try again.' }
    }
  }

  async update(id, updates) {
    try {
      const response = await fetch(`${API_URL}/announcements/${id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(updates)
      })

      const data = await response.json()
      if (!response.ok) return { success: false, error: data.error || 'Failed to update the message' }

      return { success: true, announcement: data.announcement }
    } catch (error) {
      console.error('Error updating announcement:', error)
      return { success: false, error: 'Network error. Please try again.' }
    }
  }

  async remove(id) {
    try {
      const response = await fetch(`${API_URL}/announcements/${id}`, { method: 'DELETE' })
      if (!response.ok) {
        const data = await response.json().catch(() => ({}))
        return { success: false, error: data.error || 'Failed to remove the message' }
      }
      return { success: true }
    } catch (error) {
      console.error('Error removing announcement:', error)
      return { success: false, error: 'Network error. Please try again.' }
    }
  }
}

export const announcementAPI = new AnnouncementAPI()

/** Empty start/end dates mean "no limit on that end". */
export const isAnnouncementLive = (announcement, today = toDateKey(new Date())) => {
  if (!announcement?.active) return false
  if (announcement.startDate && today < announcement.startDate) return false
  if (announcement.endDate && today > announcement.endDate) return false
  return true
}

/** Live messages, oldest first, so a new one joins the end of the stack. */
export const getLiveAnnouncements = (announcements = [], today = toDateKey(new Date())) =>
  announcements
    .filter(a => isAnnouncementLive(a, today))
    .sort((a, b) => String(a.createdAt).localeCompare(String(b.createdAt)))

/** The message body in the visitor's language, falling back to the other one. */
export const announcementText = (announcement, language) => {
  if (!announcement) return { title: '', body: '' }

  const pick = (primary, secondary) => (primary && primary.trim() ? primary : secondary || '')

  return language === 'en'
    ? {
        title: pick(announcement.titleEn, announcement.titleBg),
        body: pick(announcement.messageEn, announcement.messageBg)
      }
    : {
        title: pick(announcement.titleBg, announcement.titleEn),
        body: pick(announcement.messageBg, announcement.messageEn)
      }
}
