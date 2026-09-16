import { useState } from 'react'
import { motion } from 'framer-motion'
import { toDateKey } from '../../services/vacationApi'
import { isAnnouncementLive } from '../../services/announcementApi'

const formatDay = (dateKey) => {
  const [year, month, day] = dateKey.split('-')
  return `${day}.${month}.${year}`
}

const describeWindow = ({ startDate, endDate }) => {
  if (startDate && endDate) return `${formatDay(startDate)} — ${formatDay(endDate)}`
  if (startDate) return `From ${formatDay(startDate)}`
  if (endDate) return `Until ${formatDay(endDate)}`
  return 'No end date'
}

const STYLE_OPTIONS = [
  {
    id: 'banner',
    label: 'Bar at the bottom',
    hint: 'Quiet strip along the bottom of the page. Good for news and short notes.'
  },
  {
    id: 'popup',
    label: 'Pop-up',
    hint: 'Opens in the middle of the screen on arrival. Use it when it has to be read.'
  }
]

/**
 * Free-standing site messages. These close no days and are entirely separate
 * from time off — posting one says nothing about the barber's availability.
 */
const AnnouncementPanel = ({ announcements, onAdd, onUpdate, onRemove }) => {
  const today = toDateKey(new Date())

  const [titleBg, setTitleBg] = useState('')
  const [titleEn, setTitleEn] = useState('')
  const [messageBg, setMessageBg] = useState('')
  const [messageEn, setMessageEn] = useState('')
  const [style, setStyle] = useState('banner')
  const [startDate, setStartDate] = useState('')
  const [endDate, setEndDate] = useState('')
  const [error, setError] = useState('')
  const [notice, setNotice] = useState('')
  const [isSaving, setIsSaving] = useState(false)

  const resetForm = () => {
    setTitleBg('')
    setTitleEn('')
    setMessageBg('')
    setMessageEn('')
    setStyle('banner')
    setStartDate('')
    setEndDate('')
  }

  const handleSubmit = async (event) => {
    event.preventDefault()
    setError('')
    setNotice('')

    if (!messageBg.trim() && !messageEn.trim()) {
      setError('Write the message in at least one language.')
      return
    }
    if (startDate && endDate && endDate < startDate) {
      setError('The end date cannot be before the start date.')
      return
    }

    setIsSaving(true)
    const result = await onAdd({
      titleBg, titleEn, messageBg, messageEn, style, startDate, endDate, active: true
    })
    setIsSaving(false)

    if (!result.success) {
      setError(result.error || 'Could not publish the message.')
      return
    }

    setNotice(
      startDate && startDate > today
        ? `Message saved. It appears on the site from ${formatDay(startDate)}.`
        : 'Message published. Visitors see it now.'
    )
    resetForm()
  }

  const handleToggle = async (announcement) => {
    setError('')
    setNotice('')
    const result = await onUpdate(announcement.id, { active: !announcement.active })
    if (!result.success) setError(result.error || 'Could not update the message.')
    else setNotice(announcement.active ? 'Message hidden from the site.' : 'Message is showing again.')
  }

  const handleRemove = async (announcement) => {
    if (!window.confirm('Delete this message for good?')) return

    setError('')
    setNotice('')
    const result = await onRemove(announcement.id)
    if (!result.success) setError(result.error || 'Could not delete the message.')
    else setNotice('Message deleted.')
  }

  const sorted = [...announcements].sort((a, b) => String(b.createdAt).localeCompare(String(a.createdAt)))
  const liveCount = sorted.filter((a) => isAnnouncementLive(a, today)).length

  return (
    <div className="grid grid-cols-1 gap-6 lg:grid-cols-5">
      {/* Composer */}
      <div className="lg:col-span-2">
        <form onSubmit={handleSubmit} className="rounded-2xl border border-hairline bg-white p-5 shadow-card sm:p-6">
          <div className="flex items-center gap-3 text-neutral-400">
            <span className="h-1.5 w-1.5 rotate-45 bg-ink" />
            <h2 className="eyebrow">Post a message</h2>
          </div>

          <p className="mt-4 text-xs leading-relaxed text-neutral-500">
            Shown on the site to everyone. It does not close any days — for that, use Time off.
          </p>

          <div className="mt-6 space-y-4">
            <div>
              <label htmlFor="announce-title-bg" className="text-[10px] uppercase tracking-eyebrow text-neutral-400">
                Heading (BG) — optional
              </label>
              <input
                id="announce-title-bg"
                type="text"
                value={titleBg}
                maxLength={120}
                onChange={(e) => setTitleBg(e.target.value)}
                placeholder="Съобщение"
                className="mt-2 w-full rounded-xl border border-hairline bg-white px-3 py-2.5 text-sm text-ink placeholder:text-neutral-400 focus:border-ink focus:outline-none"
              />
            </div>

            <div>
              <label htmlFor="announce-msg-bg" className="text-[10px] uppercase tracking-eyebrow text-neutral-400">
                Message (BG)
              </label>
              <textarea
                id="announce-msg-bg"
                rows={3}
                value={messageBg}
                maxLength={500}
                onChange={(e) => setMessageBg(e.target.value)}
                placeholder="Какво да прочетат клиентите"
                className="mt-2 w-full resize-none rounded-xl border border-hairline bg-white px-3 py-2.5 text-sm text-ink placeholder:text-neutral-400 focus:border-ink focus:outline-none"
              />
            </div>

            <div>
              <label htmlFor="announce-title-en" className="text-[10px] uppercase tracking-eyebrow text-neutral-400">
                Heading (EN) — optional
              </label>
              <input
                id="announce-title-en"
                type="text"
                value={titleEn}
                maxLength={120}
                onChange={(e) => setTitleEn(e.target.value)}
                placeholder="Notice"
                className="mt-2 w-full rounded-xl border border-hairline bg-white px-3 py-2.5 text-sm text-ink placeholder:text-neutral-400 focus:border-ink focus:outline-none"
              />
            </div>

            <div>
              <label htmlFor="announce-msg-en" className="text-[10px] uppercase tracking-eyebrow text-neutral-400">
                Message (EN)
              </label>
              <textarea
                id="announce-msg-en"
                rows={3}
                value={messageEn}
                maxLength={500}
                onChange={(e) => setMessageEn(e.target.value)}
                placeholder="Leave empty to show the Bulgarian text to everyone"
                className="mt-2 w-full resize-none rounded-xl border border-hairline bg-white px-3 py-2.5 text-sm text-ink placeholder:text-neutral-400 focus:border-ink focus:outline-none"
              />
            </div>
          </div>

          {/* How it appears */}
          <fieldset className="mt-6">
            <legend className="text-[10px] uppercase tracking-eyebrow text-neutral-400">How it appears</legend>
            <div className="mt-3 space-y-2.5">
              {STYLE_OPTIONS.map((option) => (
                <label
                  key={option.id}
                  className={`flex cursor-pointer items-start gap-3 rounded-xl border p-4 transition-colors ${
                    style === option.id ? 'border-ink bg-paper-soft' : 'border-hairline hover:border-neutral-300'
                  }`}
                >
                  <input
                    type="radio"
                    name="announcement-style"
                    value={option.id}
                    checked={style === option.id}
                    onChange={() => setStyle(option.id)}
                    className="mt-0.5 h-4 w-4 shrink-0 border-neutral-300 text-ink accent-ink focus:ring-ink"
                  />
                  <span>
                    <span className="block font-display text-sm font-bold text-ink">{option.label}</span>
                    <span className="mt-1 block text-xs leading-relaxed text-neutral-500">{option.hint}</span>
                  </span>
                </label>
              ))}
            </div>
          </fieldset>

          {/* Optional schedule */}
          <div className="mt-6 grid grid-cols-1 gap-4 sm:grid-cols-2">
            <div>
              <label htmlFor="announce-start" className="text-[10px] uppercase tracking-eyebrow text-neutral-400">
                Show from — optional
              </label>
              <input
                id="announce-start"
                type="date"
                value={startDate}
                onChange={(e) => setStartDate(e.target.value)}
                className="mt-2 w-full rounded-xl border border-hairline bg-white px-3 py-2.5 font-display text-sm font-semibold text-ink focus:border-ink focus:outline-none"
              />
            </div>
            <div>
              <label htmlFor="announce-end" className="text-[10px] uppercase tracking-eyebrow text-neutral-400">
                Show until — optional
              </label>
              <input
                id="announce-end"
                type="date"
                value={endDate}
                min={startDate || undefined}
                onChange={(e) => setEndDate(e.target.value)}
                className="mt-2 w-full rounded-xl border border-hairline bg-white px-3 py-2.5 font-display text-sm font-semibold text-ink focus:border-ink focus:outline-none"
              />
            </div>
          </div>

          <p className="mt-3 text-[11px] leading-relaxed text-neutral-400">
            Leave both empty and the message stays up until you hide or delete it.
          </p>

          {error && (
            <p className="mt-5 rounded-xl border border-red-200 bg-red-50 p-3.5 text-sm text-red-600">{error}</p>
          )}
          {notice && (
            <p className="mt-5 rounded-xl border border-hairline bg-paper-soft p-3.5 text-sm text-neutral-600">{notice}</p>
          )}

          <button
            type="submit"
            disabled={isSaving}
            className="btn-primary mt-6 w-full disabled:cursor-not-allowed disabled:opacity-40"
          >
            {isSaving ? 'Publishing...' : 'Publish message'}
          </button>
        </form>
      </div>

      {/* Posted messages */}
      <div className="lg:col-span-3">
        <div className="rounded-2xl border border-hairline bg-white p-5 shadow-card sm:p-8">
          <div className="mb-6 flex flex-wrap items-center gap-x-3 gap-y-2">
            <span className="h-1.5 w-1.5 rotate-45 bg-ink" />
            <h2 className="eyebrow text-neutral-500">Messages</h2>
            <span className="hidden h-px min-w-[2rem] flex-1 bg-hairline sm:block" />
            <span className="text-[10px] uppercase tracking-eyebrow text-neutral-400">
              {liveCount} showing
            </span>
          </div>

          {sorted.length === 0 ? (
            <p className="py-14 text-center text-sm text-neutral-400">No messages posted</p>
          ) : (
            <div className="space-y-2.5">
              {sorted.map((announcement, index) => {
                const isLive = isAnnouncementLive(announcement, today)
                const isScheduled = announcement.active && !isLive

                return (
                  <motion.div
                    key={announcement.id}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: Math.min(index * 0.04, 0.3) }}
                    className={`flex flex-wrap items-start gap-x-4 gap-y-3 rounded-xl border p-4 transition-colors sm:flex-nowrap sm:p-5 ${
                      isLive ? 'border-hairline hover:border-ink' : 'border-hairline bg-paper-soft'
                    }`}
                  >
                    <span
                      className={`mt-1.5 h-2.5 w-2.5 flex-shrink-0 rounded-full ${
                        isLive ? 'bg-red-500' : isScheduled ? 'bg-ink' : 'bg-neutral-300'
                      }`}
                    />

                    <div className="min-w-0 flex-1 basis-0">
                      <p className={`font-display text-base font-bold ${isLive ? 'text-ink' : 'text-neutral-400'}`}>
                        {announcement.titleBg || announcement.titleEn || 'Съобщение'}
                      </p>
                      <p className="mt-1.5 whitespace-pre-line text-sm leading-relaxed text-neutral-500">
                        {announcement.messageBg || announcement.messageEn}
                      </p>
                      <p className="mt-2.5 flex flex-wrap items-center gap-x-2 gap-y-1 text-[10px] uppercase tracking-wider2 text-neutral-400">
                        <span>{announcement.style === 'popup' ? 'Pop-up' : 'Bottom bar'}</span>
                        <span className="text-neutral-300">/</span>
                        <span className={isLive ? 'text-ink' : ''}>
                          {isLive ? 'Showing now' : isScheduled ? 'Scheduled' : 'Hidden'}
                        </span>
                        <span className="text-neutral-300">/</span>
                        <span>{describeWindow(announcement)}</span>
                      </p>
                    </div>

                    <div className="flex w-full flex-shrink-0 items-center justify-end gap-2 border-t border-hairline pt-3 sm:w-auto sm:border-0 sm:pt-0">
                      <button
                        type="button"
                        onClick={() => handleToggle(announcement)}
                        className={`rounded-full border px-4 py-2 text-[10px] font-semibold uppercase tracking-wider2 transition-colors ${
                          announcement.active
                            ? 'border-hairline text-neutral-500 hover:border-ink hover:text-ink'
                            : 'border-ink bg-ink text-white hover:opacity-80'
                        }`}
                      >
                        {announcement.active ? 'Hide' : 'Show'}
                      </button>

                      <button
                        type="button"
                        onClick={() => handleRemove(announcement)}
                        className="flex h-9 w-9 items-center justify-center rounded-full border border-hairline text-neutral-400 transition-colors hover:border-red-500 hover:bg-red-500 hover:text-white"
                        title="Delete message"
                      >
                        <svg className="h-3.5 w-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                        </svg>
                      </button>
                    </div>
                  </motion.div>
                )
              })}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

export default AnnouncementPanel
