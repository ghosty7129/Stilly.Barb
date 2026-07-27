import { useState, useMemo } from 'react'
import { motion } from 'framer-motion'
import { toDateKey } from '../../services/vacationApi'

const formatDay = (dateKey) => {
  const [year, month, day] = dateKey.split('-')
  return `${day}.${month}.${year}`
}

const countDays = (startDate, endDate) => {
  const start = new Date(`${startDate}T00:00:00Z`)
  const end = new Date(`${endDate}T00:00:00Z`)
  return Math.round((end - start) / 86400000) + 1
}

const isRealBooking = (booking) => booking.status !== 'blocked' && booking.service !== 'blocked'

const VacationPanel = ({ vacations, bookings, onAdd, onRemove }) => {
  const today = toDateKey(new Date())

  const [startDate, setStartDate] = useState('')
  const [endDate, setEndDate] = useState('')
  const [announce, setAnnounce] = useState(false)
  const [messageBg, setMessageBg] = useState('')
  const [messageEn, setMessageEn] = useState('')
  const [error, setError] = useState('')
  const [notice, setNotice] = useState('')
  const [isSaving, setIsSaving] = useState(false)

  // Warn before saving if customers are already booked inside the range.
  const clashes = useMemo(() => {
    if (!startDate || !endDate || endDate < startDate) return []
    return bookings.filter(b => isRealBooking(b) && b.date >= startDate && b.date <= endDate)
  }, [bookings, startDate, endDate])

  const resetForm = () => {
    setStartDate('')
    setEndDate('')
    setAnnounce(false)
    setMessageBg('')
    setMessageEn('')
  }

  const handleSubmit = async (event) => {
    event.preventDefault()
    setError('')
    setNotice('')

    if (!startDate || !endDate) {
      setError('Pick both a start and an end date.')
      return
    }
    if (endDate < startDate) {
      setError('The end date cannot be before the start date.')
      return
    }

    setIsSaving(true)
    const result = await onAdd({ startDate, endDate, announce, messageBg, messageEn })
    setIsSaving(false)

    if (!result.success) {
      setError(result.error || 'Could not save the time off.')
      return
    }

    setNotice(
      result.affectedBookings > 0
        ? `Time off saved. ${result.affectedBookings} existing booking${result.affectedBookings === 1 ? '' : 's'} in this period were kept — contact those clients.`
        : 'Time off saved. Those days are now closed for booking.'
    )
    resetForm()
  }

  const handleRemove = async (vacation) => {
    const label = `${formatDay(vacation.startDate)} — ${formatDay(vacation.endDate)}`
    if (!window.confirm(`Remove the time off ${label}? Those days become bookable again.`)) return

    setError('')
    setNotice('')
    const result = await onRemove(vacation.id)
    if (!result.success) setError(result.error || 'Could not remove the time off.')
    else setNotice('Time off removed. Those days are open again.')
  }

  const upcoming = [...vacations].sort((a, b) => a.startDate.localeCompare(b.startDate))

  return (
    <div className="grid grid-cols-1 gap-6 lg:grid-cols-5">
      {/* Form */}
      <div className="lg:col-span-2">
        <form onSubmit={handleSubmit} className="rounded-2xl border border-hairline bg-white p-5 shadow-card sm:p-6">
          <div className="flex items-center gap-3 text-neutral-400">
            <span className="h-1.5 w-1.5 rotate-45 bg-ink" />
            <h2 className="eyebrow">Schedule time off</h2>
          </div>

          <div className="mt-6 grid grid-cols-1 gap-4 sm:grid-cols-2">
            <div>
              <label htmlFor="vacation-start" className="text-[10px] uppercase tracking-eyebrow text-neutral-400">
                From
              </label>
              <input
                id="vacation-start"
                type="date"
                value={startDate}
                min={today}
                onChange={(e) => setStartDate(e.target.value)}
                className="mt-2 w-full rounded-xl border border-hairline bg-white px-3 py-2.5 font-display text-sm font-semibold text-ink focus:border-ink focus:outline-none"
              />
            </div>
            <div>
              <label htmlFor="vacation-end" className="text-[10px] uppercase tracking-eyebrow text-neutral-400">
                To
              </label>
              <input
                id="vacation-end"
                type="date"
                value={endDate}
                min={startDate || today}
                onChange={(e) => setEndDate(e.target.value)}
                className="mt-2 w-full rounded-xl border border-hairline bg-white px-3 py-2.5 font-display text-sm font-semibold text-ink focus:border-ink focus:outline-none"
              />
            </div>
          </div>

          {startDate && endDate && endDate >= startDate && (
            <p className="mt-3 text-[11px] uppercase tracking-wider2 text-neutral-400">
              {countDays(startDate, endDate)} day{countDays(startDate, endDate) === 1 ? '' : 's'} closed
            </p>
          )}

          {/* Optional announcement */}
          <label className="mt-6 flex cursor-pointer items-start gap-3 rounded-xl border border-hairline bg-paper-soft p-4 transition-colors hover:border-neutral-300">
            <input
              type="checkbox"
              checked={announce}
              onChange={(e) => setAnnounce(e.target.checked)}
              className="mt-0.5 h-4 w-4 shrink-0 rounded border-neutral-300 text-ink accent-ink focus:ring-ink"
            />
            <span>
              <span className="block font-display text-sm font-bold text-ink">
                Announce this to visitors
              </span>
              <span className="mt-1 block text-xs leading-relaxed text-neutral-500">
                Shows a notice to everyone who opens the site. Leave unticked to just close the days quietly.
              </span>
            </span>
          </label>

          {announce && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              transition={{ duration: 0.3, ease: [0.2, 0.7, 0.2, 1] }}
              className="overflow-hidden"
            >
              <div className="mt-4 space-y-4">
                <div>
                  <label htmlFor="vacation-msg-bg" className="text-[10px] uppercase tracking-eyebrow text-neutral-400">
                    Message (BG) — optional
                  </label>
                  <textarea
                    id="vacation-msg-bg"
                    rows={3}
                    value={messageBg}
                    onChange={(e) => setMessageBg(e.target.value)}
                    placeholder="Leave empty to use the default notice"
                    className="mt-2 w-full resize-none rounded-xl border border-hairline bg-white px-3 py-2.5 text-sm text-ink placeholder:text-neutral-400 focus:border-ink focus:outline-none"
                  />
                </div>
                <div>
                  <label htmlFor="vacation-msg-en" className="text-[10px] uppercase tracking-eyebrow text-neutral-400">
                    Message (EN) — optional
                  </label>
                  <textarea
                    id="vacation-msg-en"
                    rows={3}
                    value={messageEn}
                    onChange={(e) => setMessageEn(e.target.value)}
                    placeholder="Leave empty to use the default notice"
                    className="mt-2 w-full resize-none rounded-xl border border-hairline bg-white px-3 py-2.5 text-sm text-ink placeholder:text-neutral-400 focus:border-ink focus:outline-none"
                  />
                </div>
              </div>
            </motion.div>
          )}

          {clashes.length > 0 && (
            <div className="mt-5 rounded-xl border border-amber-200 bg-amber-50 p-4">
              <p className="text-xs font-semibold uppercase tracking-wider2 text-amber-700">
                {clashes.length} existing booking{clashes.length === 1 ? '' : 's'} in this period
              </p>
              <p className="mt-1.5 text-xs leading-relaxed text-amber-700/80">
                They will not be cancelled automatically — contact those clients yourself.
              </p>
            </div>
          )}

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
            {isSaving ? 'Saving...' : 'Save time off'}
          </button>
        </form>
      </div>

      {/* Scheduled periods */}
      <div className="lg:col-span-3">
        <div className="rounded-2xl border border-hairline bg-white p-5 shadow-card sm:p-8">
          <div className="mb-6 flex flex-wrap items-center gap-x-3 gap-y-2">
            <span className="h-1.5 w-1.5 rotate-45 bg-ink" />
            <h2 className="eyebrow text-neutral-500">Scheduled time off</h2>
            <span className="hidden h-px min-w-[2rem] flex-1 bg-hairline sm:block" />
            <span className="text-[10px] uppercase tracking-eyebrow text-neutral-400">
              {upcoming.length} {upcoming.length === 1 ? 'period' : 'periods'}
            </span>
          </div>

          {upcoming.length === 0 ? (
            <p className="py-14 text-center text-sm text-neutral-400">No time off scheduled</p>
          ) : (
            <div className="space-y-2.5">
              {upcoming.map((vacation, index) => {
                const isPast = vacation.endDate < today
                const isActive = vacation.startDate <= today && vacation.endDate >= today

                return (
                  <motion.div
                    key={vacation.id}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: Math.min(index * 0.04, 0.3) }}
                    className={`flex flex-wrap items-center gap-x-4 gap-y-3 rounded-xl border p-4 transition-colors sm:p-5 ${
                      isPast ? 'border-hairline bg-paper-soft' : 'border-hairline hover:border-ink'
                    }`}
                  >
                    <span
                      className={`h-2.5 w-2.5 flex-shrink-0 rounded-full ${
                        isActive ? 'bg-red-500' : isPast ? 'bg-neutral-300' : 'bg-ink'
                      }`}
                    />

                    <div className="min-w-0 flex-1">
                      <p className={`font-display text-base font-bold ${isPast ? 'text-neutral-400' : 'text-ink'}`}>
                        {formatDay(vacation.startDate)} — {formatDay(vacation.endDate)}
                      </p>
                      <p className="mt-1 flex flex-wrap items-center gap-x-2 gap-y-1 text-[10px] uppercase tracking-wider2 text-neutral-400">
                        <span>{countDays(vacation.startDate, vacation.endDate)} days</span>
                        <span className="text-neutral-300">/</span>
                        <span>{isActive ? 'Active now' : isPast ? 'Finished' : 'Upcoming'}</span>
                        {vacation.announce && (
                          <>
                            <span className="text-neutral-300">/</span>
                            <span className="text-ink">Announced</span>
                          </>
                        )}
                      </p>
                    </div>

                    <button
                      type="button"
                      onClick={() => handleRemove(vacation)}
                      className="flex h-9 w-9 flex-shrink-0 items-center justify-center rounded-full border border-hairline text-neutral-400 transition-colors hover:border-red-500 hover:bg-red-500 hover:text-white"
                      title="Remove time off"
                    >
                      <svg className="h-3.5 w-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                      </svg>
                    </button>
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

export default VacationPanel
