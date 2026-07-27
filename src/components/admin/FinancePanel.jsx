import { useMemo } from 'react'
import { motion } from 'framer-motion'
import { subDays, startOfDay, isBefore } from 'date-fns'
import { SERVICES } from '../../services/appointmentService'

// Windows the barber asked for, shortest first.
const PERIODS = [
  { id: 'day', label: 'Last 24 hours', days: 1 },
  { id: 'week', label: 'Last week', days: 7 },
  { id: 'month', label: 'Last month', days: 30 },
  { id: 'halfYear', label: 'Last 6 months', days: 182 },
  { id: 'year', label: 'Last year', days: 365 }
]

const isRealBooking = (booking) => booking.status !== 'blocked' && booking.service !== 'blocked'

const FinancePanel = ({ bookings, getTotalPrice }) => {
  // Revenue is counted on the day of the visit, so future bookings never
  // inflate what has actually been earned.
  const stats = useMemo(() => {
    const today = startOfDay(new Date())

    const past = bookings
      .filter((booking) => {
        if (!isRealBooking(booking) || !booking.date) return false
        const date = startOfDay(new Date(`${booking.date}T00:00:00`))
        return !Number.isNaN(date.getTime()) && !isBefore(today, date)
      })
      .map((booking) => ({
        date: startOfDay(new Date(`${booking.date}T00:00:00`)),
        price: getTotalPrice(booking),
        service: booking.service
      }))

    const byPeriod = PERIODS.map((period) => {
      const cutoff = subDays(today, period.days - 1)
      const items = past.filter((item) => !isBefore(item.date, cutoff))
      const revenue = items.reduce((sum, item) => sum + item.price, 0)

      return {
        ...period,
        revenue,
        count: items.length,
        average: items.length ? revenue / items.length : 0
      }
    })

    const yearItems = past.filter((item) => !isBefore(item.date, subDays(today, 364)))
    const byService = Object.entries(
      yearItems.reduce((map, item) => {
        map[item.service] = map[item.service] || { revenue: 0, count: 0 }
        map[item.service].revenue += item.price
        map[item.service].count += 1
        return map
      }, {})
    )
      .map(([service, value]) => ({
        service,
        name: SERVICES.find(s => s.id === service)?.name || service,
        ...value
      }))
      .sort((a, b) => b.revenue - a.revenue)

    return { byPeriod, byService, allTime: past.reduce((sum, item) => sum + item.price, 0) }
  }, [bookings, getTotalPrice])

  const topRevenue = Math.max(...stats.byService.map((s) => s.revenue), 1)

  return (
    <div className="space-y-6">
      {/* Period cards */}
      <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3">
        {stats.byPeriod.map((period, index) => (
          <motion.div
            key={period.id}
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.05, duration: 0.4, ease: [0.2, 0.7, 0.2, 1] }}
            className="rounded-2xl border border-hairline bg-white p-5 shadow-card sm:p-6"
          >
            <div className="flex items-center gap-3 text-neutral-400">
              <span className="h-1.5 w-1.5 rotate-45 bg-ink" />
              <span className="eyebrow">{period.label}</span>
            </div>

            <p className="mt-4 font-display text-3xl font-bold leading-none text-ink sm:text-4xl">
              €{period.revenue.toFixed(2)}
            </p>

            <dl className="mt-5 flex items-center gap-5 border-t border-hairline pt-4">
              <div>
                <dt className="text-[10px] uppercase tracking-eyebrow text-neutral-400">Visits</dt>
                <dd className="mt-1 font-display text-base font-bold text-ink">{period.count}</dd>
              </div>
              <div>
                <dt className="text-[10px] uppercase tracking-eyebrow text-neutral-400">Average</dt>
                <dd className="mt-1 font-display text-base font-bold text-ink">
                  €{period.average.toFixed(2)}
                </dd>
              </div>
            </dl>
          </motion.div>
        ))}

        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: PERIODS.length * 0.05, duration: 0.4, ease: [0.2, 0.7, 0.2, 1] }}
          className="rounded-2xl bg-ink p-5 sm:p-6"
        >
          <div className="flex items-center gap-3 text-white/40">
            <span className="h-1.5 w-1.5 rotate-45 bg-white/70" />
            <span className="eyebrow">All time</span>
          </div>
          <p className="mt-4 font-display text-3xl font-bold leading-none text-white sm:text-4xl">
            €{stats.allTime.toFixed(2)}
          </p>
          <p className="mt-5 border-t border-hairline-light pt-4 text-[11px] uppercase tracking-wider2 text-white/45">
            Completed visits only
          </p>
        </motion.div>
      </div>

      {/* Breakdown by service over the last year */}
      <div className="rounded-2xl border border-hairline bg-white p-5 shadow-card sm:p-8">
        <div className="mb-6 flex flex-wrap items-center gap-x-3 gap-y-2">
          <span className="h-1.5 w-1.5 rotate-45 bg-ink" />
          <h2 className="eyebrow text-neutral-500">By service — last 12 months</h2>
          <span className="hidden h-px min-w-[2rem] flex-1 bg-hairline sm:block" />
        </div>

        {stats.byService.length === 0 ? (
          <p className="py-10 text-center text-sm text-neutral-400">No revenue recorded yet</p>
        ) : (
          <div className="space-y-4">
            {stats.byService.map((row) => (
              <div key={row.service}>
                <div className="flex items-baseline justify-between gap-4">
                  <span className="truncate font-display text-base font-semibold text-ink">
                    {row.name}
                  </span>
                  <span className="flex-shrink-0 font-display text-base font-bold text-ink">
                    €{row.revenue.toFixed(2)}
                  </span>
                </div>
                <div className="mt-2 flex items-center gap-3">
                  <div className="h-1.5 flex-1 overflow-hidden rounded-full bg-neutral-100">
                    <motion.div
                      initial={{ width: 0 }}
                      animate={{ width: `${(row.revenue / topRevenue) * 100}%` }}
                      transition={{ duration: 0.7, ease: [0.2, 0.7, 0.2, 1] }}
                      className="h-full rounded-full bg-ink"
                    />
                  </div>
                  <span className="w-[5.5rem] flex-shrink-0 whitespace-nowrap text-right text-[10px] uppercase tracking-wider2 text-neutral-400">
                    {row.count} {row.count === 1 ? 'visit' : 'visits'}
                  </span>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}

export default FinancePanel
