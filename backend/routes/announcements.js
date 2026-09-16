import express from 'express';
import db from '../database/index.js';
import { v4 as uuidv4 } from 'uuid';

const router = express.Router();
const DATE_REGEX = /^\d{4}-\d{2}-\d{2}$/;
const MAX_TITLE_LENGTH = 120;
const MAX_MESSAGE_LENGTH = 500;
const STYLES = ['banner', 'popup'];

const safeString = (value, maxLength) => {
  if (typeof value !== 'string') return '';
  return value.trim().slice(0, maxLength);
};

/** '' | undefined -> '', otherwise a validated YYYY-MM-DD. Throws on garbage. */
const safeDate = (value) => {
  const date = safeString(value, 20);
  if (!date) return '';
  if (!DATE_REGEX.test(date)) throw new Error('Invalid date format. Use YYYY-MM-DD.');
  return date;
};

/**
 * Standalone site messages. Unlike vacations these close no days and carry no
 * dates of their own unless the barber sets a window — they only put text in
 * front of visitors.
 */

// GET /api/announcements — public: the site reads this to decide what to show
router.get('/', async (req, res) => {
  try {
    const announcements = (await db.getAllAnnouncements()) || [];
    res.json(announcements);
  } catch (error) {
    console.error('Error fetching announcements:', error);
    res.status(500).json({ error: 'Failed to fetch announcements' });
  }
});

// POST /api/announcements — publish a new message
router.post('/', async (req, res) => {
  try {
    const { titleBg, titleEn, messageBg, messageEn, style, active, startDate, endDate } = req.body;

    const normalized = {
      titleBg: safeString(titleBg, MAX_TITLE_LENGTH),
      titleEn: safeString(titleEn, MAX_TITLE_LENGTH),
      messageBg: safeString(messageBg, MAX_MESSAGE_LENGTH),
      messageEn: safeString(messageEn, MAX_MESSAGE_LENGTH)
    };

    if (!normalized.messageBg && !normalized.messageEn) {
      return res.status(400).json({ error: 'Write the message in at least one language.' });
    }

    let window;
    try {
      window = { startDate: safeDate(startDate), endDate: safeDate(endDate) };
    } catch (err) {
      return res.status(400).json({ error: err.message });
    }

    if (window.startDate && window.endDate && window.endDate < window.startDate) {
      return res.status(400).json({ error: 'End date cannot be before the start date.' });
    }

    const announcement = {
      id: uuidv4(),
      ...normalized,
      ...window,
      style: STYLES.includes(style) ? style : 'banner',
      active: active !== false,
      createdAt: new Date().toISOString()
    };

    const created = await db.createAnnouncement(announcement);
    res.status(201).json({ announcement: created });
  } catch (error) {
    console.error('Error creating announcement:', error);
    res.status(500).json({ error: 'Failed to create announcement' });
  }
});

// PATCH /api/announcements/:id — mainly the show/hide toggle
router.patch('/:id', async (req, res) => {
  try {
    const { titleBg, titleEn, messageBg, messageEn, style, active, startDate, endDate } = req.body;
    const updates = {};

    if (titleBg !== undefined) updates.titleBg = safeString(titleBg, MAX_TITLE_LENGTH);
    if (titleEn !== undefined) updates.titleEn = safeString(titleEn, MAX_TITLE_LENGTH);
    if (messageBg !== undefined) updates.messageBg = safeString(messageBg, MAX_MESSAGE_LENGTH);
    if (messageEn !== undefined) updates.messageEn = safeString(messageEn, MAX_MESSAGE_LENGTH);
    if (style !== undefined && STYLES.includes(style)) updates.style = style;
    if (active !== undefined) updates.active = Boolean(active);

    try {
      if (startDate !== undefined) updates.startDate = safeDate(startDate);
      if (endDate !== undefined) updates.endDate = safeDate(endDate);
    } catch (err) {
      return res.status(400).json({ error: err.message });
    }

    if (Object.keys(updates).length === 0) {
      return res.status(400).json({ error: 'Nothing to update.' });
    }

    const updated = await db.updateAnnouncement(req.params.id, updates);
    if (!updated) return res.status(404).json({ error: 'Announcement not found' });

    res.json({ announcement: updated });
  } catch (error) {
    console.error('Error updating announcement:', error);
    res.status(500).json({ error: 'Failed to update announcement' });
  }
});

// DELETE /api/announcements/:id
router.delete('/:id', async (req, res) => {
  try {
    const removed = await db.removeAnnouncement(req.params.id);
    if (!removed) return res.status(404).json({ error: 'Announcement not found' });
    res.json({ message: 'Announcement removed successfully' });
  } catch (error) {
    console.error('Error deleting announcement:', error);
    res.status(500).json({ error: 'Failed to delete announcement' });
  }
});

export default router;
