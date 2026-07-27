import express from 'express';
import db from '../database/index.js';
import { v4 as uuidv4 } from 'uuid';

const router = express.Router();
const DATE_REGEX = /^\d{4}-\d{2}-\d{2}$/;
const MAX_MESSAGE_LENGTH = 500;

const safeString = (value, maxLength) => {
  if (typeof value !== 'string') return '';
  return value.trim().slice(0, maxLength);
};

/**
 * Every day covered by a vacation, inclusive of both ends.
 * Dates are handled as plain YYYY-MM-DD strings so no timezone can shift them.
 */
export const expandVacationDays = (startDate, endDate) => {
  const days = [];
  const cursor = new Date(`${startDate}T00:00:00Z`);
  const end = new Date(`${endDate}T00:00:00Z`);

  while (cursor <= end) {
    days.push(cursor.toISOString().slice(0, 10));
    cursor.setUTCDate(cursor.getUTCDate() + 1);
  }

  return days;
};

/** True when the given YYYY-MM-DD falls inside any stored vacation. */
export const isVacationDate = async (date) => {
  if (!DATE_REGEX.test(date || '')) return false;

  const vacations = (await db.getAllVacations()) || [];
  return vacations.some(v => date >= v.startDate && date <= v.endDate);
};

// GET /api/vacations — public: the booking calendar and the notice both read this
router.get('/', async (req, res) => {
  try {
    const vacations = (await db.getAllVacations()) || [];
    res.json(vacations);
  } catch (error) {
    console.error('Error fetching vacations:', error);
    res.status(500).json({ error: 'Failed to fetch vacations' });
  }
});

// POST /api/vacations — schedule a period of leave
router.post('/', async (req, res) => {
  try {
    const { startDate, endDate, announce, messageBg, messageEn } = req.body;

    const normalizedStart = safeString(startDate, 20);
    const normalizedEnd = safeString(endDate, 20);

    if (!DATE_REGEX.test(normalizedStart) || !DATE_REGEX.test(normalizedEnd)) {
      return res.status(400).json({ error: 'Invalid date format. Use YYYY-MM-DD.' });
    }

    if (normalizedEnd < normalizedStart) {
      return res.status(400).json({ error: 'End date cannot be before the start date.' });
    }

    const existing = (await db.getAllVacations()) || [];
    const overlaps = existing.some(v => normalizedStart <= v.endDate && normalizedEnd >= v.startDate);
    if (overlaps) {
      return res.status(409).json({ error: 'This period overlaps an existing vacation.' });
    }

    const vacation = {
      id: uuidv4(),
      startDate: normalizedStart,
      endDate: normalizedEnd,
      announce: Boolean(announce),
      messageBg: safeString(messageBg, MAX_MESSAGE_LENGTH),
      messageEn: safeString(messageEn, MAX_MESSAGE_LENGTH),
      createdAt: new Date().toISOString()
    };

    const created = await db.createVacation(vacation);

    // Report any bookings already sitting inside the period so the barber can
    // deal with them; they are deliberately left untouched.
    const appointments = (await db.getAll()) || [];
    const affected = appointments.filter(
      a => a.status !== 'blocked' && a.date >= normalizedStart && a.date <= normalizedEnd
    );

    res.status(201).json({ vacation: created, affectedBookings: affected.length });
  } catch (error) {
    console.error('Error creating vacation:', error);
    res.status(500).json({ error: 'Failed to create vacation' });
  }
});

// DELETE /api/vacations/:id
router.delete('/:id', async (req, res) => {
  try {
    const removed = await db.removeVacation(req.params.id);
    if (!removed) {
      return res.status(404).json({ error: 'Vacation not found' });
    }
    res.json({ message: 'Vacation removed successfully' });
  } catch (error) {
    console.error('Error deleting vacation:', error);
    res.status(500).json({ error: 'Failed to delete vacation' });
  }
});

export default router;
