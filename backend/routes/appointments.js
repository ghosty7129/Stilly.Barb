import express from 'express';
import db from '../database/db.js';
import emailService from '../services/emailService.js';
import { v4 as uuidv4 } from 'uuid';

const router = express.Router();
const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const PHONE_REGEX = /^\d{10}$/;
const DATE_REGEX = /^\d{4}-\d{2}-\d{2}$/;
const TIME_REGEX = /^([01]\d|2[0-3]):(00|30)$/;

const BUSINESS_HOURS = {
  weekday: { start: 10, end: 19 },
  weekend: { start: 11, end: 17 }
};

const SERVICES = {
  normal: { name: 'Подстрижка със стайлинг', duration: 60, price: 15 },
  buzzcut: { name: 'Бъзкът / Фейд', duration: 30, price: 12 },
  beard: { name: 'Оформяне на брада', duration: 30, price: 12 }
};

const ADDONS = {
  'beard-addon': { name: 'Оформяне на брада', duration: 30, price: 7 },
  eyebrows: { name: 'Оформяне на вежди', duration: 30, price: 3 },
  'hair-wash': { name: 'Измиване на коса', duration: 0, price: 2 }
};

const getDayOfWeekFromIsoDate = (dateString) => {
  const [year, month, day] = dateString.split('-').map(Number);
  return new Date(Date.UTC(year, month - 1, day)).getUTCDay();
};

const getBusinessHoursForDate = (dateString) => {
  const dayOfWeek = getDayOfWeekFromIsoDate(dateString);
  return dayOfWeek === 0 || dayOfWeek === 6 ? BUSINESS_HOURS.weekend : BUSINESS_HOURS.weekday;
};

const parseMinutes = (time) => {
  const [hours, minutes] = time.split(':').map(Number);
  return hours * 60 + minutes;
};

const isDateWithinAllowedRange = (dateString) => {
  if (!DATE_REGEX.test(dateString)) return false;

  const now = new Date();
  const today = new Date(Date.UTC(now.getUTCFullYear(), now.getUTCMonth(), now.getUTCDate()));
  const selected = new Date(`${dateString}T00:00:00.000Z`);
  if (Number.isNaN(selected.getTime())) return false;

  const max = new Date(today);
  max.setUTCDate(max.getUTCDate() + 60);

  return selected >= today && selected <= max;
};

const getAppointmentDurationMinutes = (appointment) => {
  const normalizedTotal = Number(appointment?.total_duration);
  if (Number.isFinite(normalizedTotal) && normalizedTotal > 0) {
    return normalizedTotal;
  }

  const baseDuration = Number(appointment?.service_duration);
  let duration = Number.isFinite(baseDuration) && baseDuration > 0 ? baseDuration : 60;

  if (Array.isArray(appointment?.addon_details)) {
    for (const addon of appointment.addon_details) {
      const addonDuration = Number(addon?.duration);
      if (Number.isFinite(addonDuration) && addonDuration >= 0) {
        duration += addonDuration;
      }
    }
  }

  return duration;
};

const appointmentsOverlap = (startA, endA, startB, endB) => startA < endB && startB < endA;

const safeString = (value, maxLength = 255) => {
  if (typeof value !== 'string') return '';
  return value.trim().slice(0, maxLength);
};

// Get all appointments
router.get('/', (req, res) => {
  try {
    const appointments = db.getAll();
    res.json(appointments);
  } catch (error) {
    console.error('Error fetching appointments:', error);
    res.status(500).json({ error: 'Failed to fetch appointments' });
  }
});

// Get appointment by ID
router.get('/:id', (req, res) => {
  try {
    const appointment = db.getById(req.params.id);
    if (!appointment) {
      return res.status(404).json({ error: 'Appointment not found' });
    }
    res.json(appointment);
  } catch (error) {
    console.error('Error fetching appointment:', error);
    res.status(500).json({ error: 'Failed to fetch appointment' });
  }
});

// Create new appointment
router.post('/', async (req, res) => {
  try {
    const {
      customerName,
      email,
      phone,
      service,
      serviceName,
      serviceDuration,
      servicePrice,
      addons,
      addonNames,
      addonDetails,
      totalDuration,
      totalPrice,
      language,
      date,
      time,
      notes
    } = req.body;
    
    const normalizedCustomerName = safeString(customerName, 120);
    const normalizedEmail = safeString(email, 160).toLowerCase();
    const normalizedPhone = safeString(phone, 40).replace(/\s+/g, '');
    const normalizedService = safeString(service, 80);
    const normalizedServiceName = safeString(serviceName || service, 120);
    const normalizedDate = safeString(date, 20);
    const normalizedTime = safeString(time, 10);
    const normalizedNotes = safeString(notes || '', 1000);
    const normalizedLanguage = safeString(language || 'bg', 8) || 'bg';

    // Validation
    if (!normalizedCustomerName || !normalizedEmail || !normalizedPhone || !normalizedService || !normalizedDate || !normalizedTime) {
      return res.status(400).json({ error: 'Missing required fields' });
    }

    if (!EMAIL_REGEX.test(normalizedEmail)) {
      return res.status(400).json({ error: 'Invalid email address' });
    }

    if (!PHONE_REGEX.test(normalizedPhone)) {
      return res.status(400).json({ error: 'Phone number must be exactly 10 digits' });
    }

    if (!DATE_REGEX.test(normalizedDate) || !TIME_REGEX.test(normalizedTime)) {
      return res.status(400).json({ error: 'Invalid date or time format' });
    }

    if (!isDateWithinAllowedRange(normalizedDate)) {
      return res.status(400).json({ error: 'Date must be between today and 60 days ahead' });
    }

    const serviceDefinition = SERVICES[normalizedService];
    if (!serviceDefinition) {
      return res.status(400).json({ error: 'Selected service is not supported' });
    }

    const normalizedAddons = Array.isArray(addons) ? addons.map((addon) => safeString(addon, 80)).filter(Boolean) : [];
    const uniqueAddons = [...new Set(normalizedAddons)];

    if (uniqueAddons.some((addonId) => !ADDONS[addonId])) {
      return res.status(400).json({ error: 'One or more selected add-ons are not supported' });
    }

    if (normalizedService === 'beard' && uniqueAddons.includes('beard-addon')) {
      return res.status(400).json({ error: 'Selected add-ons are not valid for this service' });
    }

    const normalizedAddonDetails = uniqueAddons.map((addonId) => ({
      id: addonId,
      name: ADDONS[addonId].name,
      duration: ADDONS[addonId].duration,
      price: ADDONS[addonId].price
    }));

    const normalizedAddonNames = normalizedAddonDetails.map((addon) => addon.name);
    const normalizedServiceDuration = serviceDefinition.duration;
    const normalizedServicePrice = serviceDefinition.price;
    const normalizedTotalDuration = normalizedServiceDuration + normalizedAddonDetails.reduce((sum, addon) => sum + addon.duration, 0);
    const normalizedTotalPrice = normalizedServicePrice + normalizedAddonDetails.reduce((sum, addon) => sum + addon.price, 0);

    if (!Number.isFinite(normalizedTotalDuration) || normalizedTotalDuration <= 0) {
      return res.status(400).json({ error: 'Calculated appointment duration is invalid' });
    }

    const businessHours = getBusinessHoursForDate(normalizedDate);
    const startMinutes = parseMinutes(normalizedTime);
    const businessStartMinutes = businessHours.start * 60;
    const businessEndMinutes = businessHours.end * 60;
    const endMinutes = startMinutes + normalizedTotalDuration;

    if (startMinutes < businessStartMinutes || endMinutes > businessEndMinutes) {
      return res.status(400).json({ error: 'Selected time is outside business hours for that day' });
    }

    const conflictingAppointment = db.getAll().find((existingAppointment) => {
      if (existingAppointment.date !== normalizedDate) return false;

      const existingStatus = safeString(existingAppointment.status || '', 30).toLowerCase();
      if (existingStatus === 'cancelled' || existingStatus === 'canceled') return false;

      const existingTime = safeString(existingAppointment.time || '', 10);
      if (!TIME_REGEX.test(existingTime)) return false;

      const existingStartMinutes = parseMinutes(existingTime);
      const existingDuration = getAppointmentDurationMinutes(existingAppointment);
      if (!Number.isFinite(existingDuration) || existingDuration <= 0) return false;

      const existingEndMinutes = existingStartMinutes + existingDuration;

      return appointmentsOverlap(startMinutes, endMinutes, existingStartMinutes, existingEndMinutes);
    });

    if (conflictingAppointment) {
      return res.status(409).json({ error: 'Някой ви изпревари с няколко секунди! Моля изберете друг час.' });
    }

    const id = uuidv4();
    const newAppointment = {
      id,
      name: normalizedCustomerName,
      customer_name: normalizedCustomerName,
      email: normalizedEmail,
      phone: normalizedPhone,
      service: normalizedService,
      service_name: normalizedServiceName || serviceDefinition.name,
      service_duration: normalizedServiceDuration,
      service_price: normalizedServicePrice,
      addons: uniqueAddons,
      addon_names: normalizedAddonNames,
      addon_details: normalizedAddonDetails,
      total_duration: normalizedTotalDuration,
      total_price: normalizedTotalPrice,
      language: normalizedLanguage,
      date: normalizedDate,
      time: normalizedTime,
      notes: normalizedNotes,
      status: 'pending',
      created_at: new Date().toISOString()
    };

    db.create(newAppointment);

    // Send confirmation email in background — don't block the response
    setImmediate(async () => {
      try {
        await emailService.sendConfirmationEmail({
          customerName: normalizedCustomerName,
          phone: normalizedPhone,
          email: normalizedEmail,
          service: normalizedServiceName || serviceDefinition.name,
          serviceDuration: normalizedServiceDuration,
          servicePrice: normalizedServicePrice,
          addons: normalizedAddonNames,
          addonDetails: normalizedAddonDetails,
          totalDuration: normalizedTotalDuration,
          totalPrice: normalizedTotalPrice,
          language: normalizedLanguage,
          date: normalizedDate,
          time: normalizedTime
        });
        console.log(`✅ Confirmation email sent to ${normalizedEmail}`);
      } catch (error) {
        console.error('Background email error:', error.message);
      }
    });

    res.status(201).json(newAppointment);
  } catch (error) {
    console.error('Error creating appointment:', error);
    res.status(500).json({ error: 'Failed to create appointment' });
  }
});

// Delete appointment
router.delete('/:id', (req, res) => {
  try {
    const deleted = db.delete(req.params.id);
    
    if (!deleted) {
      return res.status(404).json({ error: 'Appointment not found' });
    }

    res.json({ message: 'Appointment deleted successfully' });
  } catch (error) {
    console.error('Error deleting appointment:', error);
    res.status(500).json({ error: 'Failed to delete appointment' });
  }
});

// Update appointment status
router.patch('/:id/status', (req, res) => {
  try {
    const { status } = req.body;
    if (!status) {
      return res.status(400).json({ error: 'Status is required' });
    }

    const updated = db.update(req.params.id, { status });

    if (!updated) {
      return res.status(404).json({ error: 'Appointment not found' });
    }

    res.json(updated);
  } catch (error) {
    console.error('Error updating appointment:', error);
    res.status(500).json({ error: 'Failed to update appointment' });
  }
});

export default router;
